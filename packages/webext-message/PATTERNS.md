# webext-message - Advanced Patterns & Best Practices

## 🎯 Communication Patterns

### Pattern 1: Request/Response with Validation

```typescript
// Background
import { onMessage } from 'webext-message'

interface UserRequest {
  userId: string
  action: 'get' | 'update'
  data?: any
}

interface UserResponse {
  success: boolean
  user?: any
  error?: string
}

onMessage<UserRequest, UserResponse>(async (request, response) => {
  if (request.name === 'user-action') {
    try {
      const { userId, action, data } = request.body || {}

      // Validate input
      if (!userId || !action) {
        return response.send({
          success: false,
          error: 'Missing required fields'
        })
      }

      // Process action
      let result
      switch (action) {
        case 'get':
          result = await fetchUser(userId)
          break
        case 'update':
          result = await updateUser(userId, data)
          break
      }

      response.send({ success: true, user: result })
    } catch (error) {
      response.send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
})

// Content Script
const response = await sendToBackground<UserRequest, UserResponse>({
  name: 'user-action',
  body: { userId: '123', action: 'get' }
})

if (response.success) {
  console.log('User:', response.user)
} else {
  console.error('Error:', response.error)
}
```

### Pattern 2: Batched Messages

```typescript
// Background
const messageQueue = new Map<string, any[]>()
let flushTimeout: NodeJS.Timeout

const flushQueue = async (queueName: string) => {
  const messages = messageQueue.get(queueName) || []
  if (messages.length === 0) return

  messageQueue.delete(queueName)
  
  // Process batch
  console.log(`Processing ${messages.length} messages from ${queueName}`)
  // ... process messages
}

onMessage<{ type: string; payload: any }, { queued: boolean }>(
  async (request, response) => {
    if (request.name === 'batch-message') {
      const { type, payload } = request.body || {}
      const queueName = type

      if (!messageQueue.has(queueName)) {
        messageQueue.set(queueName, [])
      }

      messageQueue.get(queueName)!.push(payload)

      // Debounce flush
      clearTimeout(flushTimeout)
      flushTimeout = setTimeout(() => flushQueue(queueName), 1000)

      response.send({ queued: true })
    }
  }
)

// Content Script
for (const item of largeDataset) {
  await sendToBackground({
    name: 'batch-message',
    body: { type: 'analytics', payload: item }
  })
}
```

### Pattern 3: Streaming Data via Relay

```typescript
// Content script uses relay for streaming
const setupStream = () => {
  let offset = 0
  const pageSize = 100

  const streamNext = async () => {
    const data = await sendToBackgroundViaRelay({
      name: 'stream-data',
      body: { offset, pageSize }
    })

    if (data.items.length > 0) {
      processItems(data.items)
      offset += pageSize
      
      if (!data.hasMore) return
      
      // Request next batch
      streamNext()
    }
  }

  streamNext()
}
```

### Pattern 4: Typed Message Dispatcher

```typescript
// Background
type MessageHandler<T = any, R = any> = (body: T) => Promise<R>

class MessageDispatcher {
  private handlers = new Map<string, MessageHandler>()

  register<T, R>(name: string, handler: MessageHandler<T, R>) {
    this.handlers.set(name, handler)
  }

  async dispatch<R>(name: string, body: any): Promise<R> {
    const handler = this.handlers.get(name)
    if (!handler) {
      throw new Error(`No handler for message: ${name}`)
    }
    return handler(body)
  }
}

const dispatcher = new MessageDispatcher()

// Register handlers
dispatcher.register('fetch-data', async (body: { query: string }) => {
  return { results: await search(body.query) }
})

dispatcher.register('save-data', async (body: { data: any }) => {
  await save(body.data)
  return { success: true }
})

// Use dispatcher
onMessage(async (request, response) => {
  try {
    const result = await dispatcher.dispatch(request.name, request.body)
    response.send(result)
  } catch (error) {
    response.send({ error: error instanceof Error ? error.message : 'Error' })
  }
})

// Content Script
const result = await sendToBackground({
  name: 'fetch-data',
  body: { query: 'react' }
})
```

### Pattern 5: Request Deduplication

```typescript
// Background
class DedupedRequests<T> {
  private pending = new Map<string, Promise<T>>()

  async request<R>(
    key: string,
    fetch: () => Promise<R>
  ): Promise<R> {
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<R>
    }

    const promise = fetch()
    this.pending.set(key, promise)

    try {
      return await promise
    } finally {
      this.pending.delete(key)
    }
  }
}

const dedup = new DedupedRequests()

onMessage<{ userId: string }, { user: any }>(async (request, response) => {
  if (request.name === 'get-user') {
    const user = await dedup.request(
      `user-${request.body?.userId}`,
      () => fetchUserFromAPI(request.body?.userId!)
    )
    response.send({ user })
  }
})
```

### Pattern 6: Message Filtering & Middleware

```typescript
// Background
type MessageMiddleware = (
  name: string,
  body: any
) => Promise<boolean> // true to continue, false to skip

class MessageBus {
  private middleware: MessageMiddleware[] = []

  use(middleware: MessageMiddleware) {
    this.middleware.push(middleware)
  }

  async runMiddleware(name: string, body: any) {
    for (const mw of this.middleware) {
      if (!(await mw(name, body))) {
        return false
      }
    }
    return true
  }
}

const bus = new MessageBus()

// Auth middleware
bus.use(async (name, body) => {
  if (name.startsWith('private:')) {
    // Verify auth
    return await isUserAuthenticated()
  }
  return true
})

// Rate limiting middleware
const rateLimits = new Map<string, number>()
bus.use(async (name, body) => {
  const key = `${name}:${body?.userId}`
  const count = rateLimits.get(key) || 0
  
  if (count > 100) {
    return false // Rate limited
  }
  
  rateLimits.set(key, count + 1)
  return true
})

// Apply middleware
onMessage(async (request, response) => {
  const canContinue = await bus.runMiddleware(
    request.name,
    request.body
  )

  if (!canContinue) {
    response.send({ error: 'Request blocked by middleware' })
    return
  }

  // Handle message
  response.send({ success: true })
})
```

### Pattern 7: Port Pool for Performance

```typescript
// Background
class PortPool {
  private ports = new Map<string, chrome.runtime.Port[]>()
  private poolSize = 5

  getPort(name: string): chrome.runtime.Port {
    if (!this.ports.has(name)) {
      this.ports.set(name, [])
    }

    const pool = this.ports.get(name)!
    
    // Return existing port if available
    if (pool.length > 0) {
      return pool.pop()!
    }

    // Create new port if under limit
    return chrome.runtime.connect({ name })
  }

  releasePort(name: string, port: chrome.runtime.Port) {
    const pool = this.ports.get(name) || []
    
    if (pool.length < this.poolSize) {
      pool.push(port)
    } else {
      port.disconnect()
    }
  }
}

const portPool = new PortPool()

// Usage
const port = portPool.getPort('worker')
port.postMessage({ task: 'process' })
portPool.releasePort('worker', port)
```

### Pattern 8: Error Recovery with Retry

```typescript
// Content Script
interface RetryOptions {
  maxAttempts: number
  delayMs: number
  backoff?: number
}

async function sendWithRetry<R>(
  request: any,
  options: RetryOptions = { maxAttempts: 3, delayMs: 100, backoff: 2 }
): Promise<R> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await sendToBackground<any, R>(request)
    } catch (error) {
      lastError = error as Error
      
      if (attempt < options.maxAttempts - 1) {
        const delay = options.delayMs * Math.pow(options.backoff || 1, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(
    `Failed after ${options.maxAttempts} attempts: ${lastError?.message}`
  )
}

// Usage
const result = await sendWithRetry(
  { name: 'critical-operation', body: {} },
  { maxAttempts: 5, delayMs: 50, backoff: 1.5 }
)
```

### Pattern 9: Type-Safe Message Registry

```typescript
// types.ts
export type MessageRegistry = {
  'user.fetch': {
    request: { userId: string }
    response: { user: UserData }
  }
  'user.update': {
    request: { userId: string; data: Partial<UserData> }
    response: { success: boolean }
  }
  'analytics.track': {
    request: { event: string; properties: Record<string, any> }
    response: void
  }
}

// Background
import { onMessage } from 'webext-message'
import type { MessageRegistry } from './types'

type Handler<K extends keyof MessageRegistry> = (
  body: MessageRegistry[K]['request']
) => Promise<MessageRegistry[K]['response']>

class TypedDispatcher {
  private handlers = new Map<string, Handler<any>>()

  register<K extends keyof MessageRegistry>(
    name: K,
    handler: Handler<K>
  ) {
    this.handlers.set(name as string, handler)
  }

  async dispatch<K extends keyof MessageRegistry>(
    name: K,
    body: MessageRegistry[K]['request']
  ): Promise<MessageRegistry[K]['response']> {
    const handler = this.handlers.get(name as string)
    if (!handler) throw new Error(`No handler: ${name}`)
    return handler(body)
  }
}

const dispatcher = new TypedDispatcher()

dispatcher.register('user.fetch', async (body) => {
  // body is typed as { userId: string }
  return { user: await fetchUser(body.userId) }
})

// Content Script
const user = await sendToBackground<
  MessageRegistry['user.fetch']['request'],
  MessageRegistry['user.fetch']['response']
>({
  name: 'user.fetch',
  body: { userId: '123' }
})
```

## 🚀 Performance Tips

### 1. Minimize Message Size
```typescript
// ❌ Bad: Sending entire objects
response.send({ user, posts, comments, followers, ... })

// ✅ Good: Send only needed data
response.send({ userId: user.id, postCount: posts.length })
```

### 2. Use Ports for High Frequency
```typescript
// ❌ Bad: Sending many individual messages
for (const item of largeList) {
  await sendToBackground({ name: 'process', body: item })
}

// ✅ Good: Use port for streaming
const { send } = usePort('stream')
for (const item of largeList) {
  send(item)
}
```

### 3. Batch Operations
```typescript
// ❌ Bad: Individual saves
for (const item of items) {
  await sendToBackground({ name: 'save', body: item })
}

// ✅ Good: Batch save
await sendToBackground({
  name: 'save-batch',
  body: { items }
})
```

### 4. Cache Results
```typescript
class MessageCache {
  private cache = new Map<string, any>()
  private ttl = new Map<string, number>()

  async get<R>(
    key: string,
    fetcher: () => Promise<R>,
    ttlMs = 5000
  ): Promise<R> {
    if (this.cache.has(key)) {
      const expiry = this.ttl.get(key)!
      if (Date.now() < expiry) {
        return this.cache.get(key)
      }
    }

    const result = await fetcher()
    this.cache.set(key, result)
    this.ttl.set(key, Date.now() + ttlMs)
    return result
  }
}
```

## 🛡️ Security Patterns

### 1. Message Validation
```typescript
function validateRequest<T>(
  body: unknown,
  schema: Record<keyof T, string>
): body is T {
  if (typeof body !== 'object' || body === null) return false

  for (const [key, type] of Object.entries(schema)) {
    if (typeof (body as any)[key] !== type) return false
  }

  return true
}

onMessage(async (request, response) => {
  if (
    validateRequest(request.body, {
      userId: 'string',
      action: 'string'
    })
  ) {
    // body is now typed safely
    handleRequest(request.body)
  }
})
```

### 2. Origin Verification
```typescript
const ALLOWED_ORIGINS = [
  'https://trusted-domain.com',
  'https://app.trusted-domain.com'
]

onMessage(async (request, response) => {
  const origin = request.sender?.url
  
  if (!origin || !ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))) {
    response.send({ error: 'Origin not allowed' })
    return
  }

  // Process trusted request
})
```

### 3. Sensitive Data Handling
```typescript
// Never log sensitive data
onMessage(async (request, response) => {
  const { token, password, ...safe } = request.body

  console.log('Request:', safe) // No secrets logged

  // Use token securely
  const result = await authenticatedOperation(token)
  
  // Don't send secrets back
  response.send({ success: true })
})
```

## 📊 Monitoring & Debugging

### Pattern: Message Logger

```typescript
class MessageLogger {
  private logs: Array<{
    timestamp: number
    name: string
    direction: 'send' | 'receive'
    size: number
  }> = []

  log(name: string, body: any, direction: 'send' | 'receive') {
    this.logs.push({
      timestamp: Date.now(),
      name,
      direction,
      size: JSON.stringify(body).length
    })

    // Keep last 1000 messages
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }
  }

  getStats() {
    const stats: Record<string, any> = {}
    
    for (const log of this.logs) {
      if (!stats[log.name]) {
        stats[log.name] = { sent: 0, received: 0, totalSize: 0 }
      }

      if (log.direction === 'send') stats[log.name].sent++
      else stats[log.name].received++

      stats[log.name].totalSize += log.size
    }

    return stats
  }
}

const logger = new MessageLogger()

// Log all messages
onMessage(async (request, response) => {
  logger.log(request.name, request.body, 'receive')
  // ... handle message
})
```

---

**Happy messaging! 🚀**
