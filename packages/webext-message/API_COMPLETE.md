# webext-message - Complete API Documentation

Type-safe messaging library for WXT browser extensions. Full function reference with examples.

---

## 📋 Table of Contents

1. [Main Module (webext-message)](#main-module)
2. [Hooks Module (webext-message/hook)](#hooks-module)
3. [Port Module (webext-message/port)](#port-module)
4. [Relay Module (webext-message/relay)](#relay-module)
5. [Pub-Sub Module (webext-message/pub-sub)](#pub-sub-module)
6. [Message Module (webext-message/message)](#message-module)
7. [Background Module (webext-message/background)](#background-module)
8. [Debug Module (webext-message/debug)](#debug-module)
9. [Utils Module (webext-message/utils)](#utils-module)
10. [Types Module](#types-module)

---

# Main Module: webext-message

Import from: `import { ... } from 'webext-message'`

---

## sendToBackground

Send message to background service worker from content script or popup.

```typescript
const response = await sendToBackground<RequestBody, ResponseBody>(request)
```

**Parameters:**
- `request` - Message request object
  - `name` (string) - Message identifier (required)
  - `body` (any) - Message payload (optional)
  - `extensionId` (string) - Target extension ID (optional, for external messages)
  - `tabId` (number) - Tab ID (optional, auto-filled)

**Returns:** Promise<ResponseBody>

**Throws:** Error if message fails or times out

**Examples:**

Basic message:
```typescript
import { sendToBackground } from 'webext-message'

await sendToBackground({
  name: 'ping',
  body: { message: 'hello' }
})
```

With types:
```typescript
interface PingRequest {
  message: string
}

interface PingResponse {
  reply: string
  timestamp: number
}

const response = await sendToBackground<PingRequest, PingResponse>({
  name: 'ping',
  body: { message: 'hello' }
})

console.log(response.reply) // typed as string
console.log(response.timestamp) // typed as number
```

No body:
```typescript
const response = await sendToBackground({
  name: 'getStatus'
})
```

External extension:
```typescript
const response = await sendToBackground({
  name: 'externalMsg',
  body: { data: 'test' },
  extensionId: 'other-extension-id'
})
```

Error handling:
```typescript
try {
  const response = await sendToBackground({
    name: 'operation',
    body: {}
  })
  console.log('Success:', response)
} catch (error) {
  console.error('Failed:', error instanceof Error ? error.message : 'Unknown error')
}
```

---

## sendToContentScript

Send message to content script on specific tab.

```typescript
const response = await sendToContentScript<RequestBody, ResponseBody>(request)
```

**Parameters:**
- `request` - Message request object
  - `name` (string) - Message identifier (required)
  - `body` (any) - Message payload (optional)
  - `tabId` (number) - Target tab ID (optional, defaults to active tab)

**Returns:** Promise<ResponseBody>

**Throws:** Error if no active tab or message fails

**Examples:**

Send to active tab:
```typescript
import { sendToContentScript } from 'webext-message'

const response = await sendToContentScript({
  name: 'contentMsg',
  body: { action: 'highlight' }
})
```

Send to specific tab:
```typescript
const response = await sendToContentScript({
  name: 'contentMsg',
  body: { data: 'test' },
  tabId: 123
})
```

With response handling:
```typescript
interface ContentRequest {
  selector: string
}

interface ContentResponse {
  found: boolean
  count: number
}

const response = await sendToContentScript<ContentRequest, ContentResponse>({
  name: 'findElements',
  body: { selector: '.item' }
})

console.log(`Found ${response.count} elements`)
```

Error when no tab:
```typescript
try {
  const response = await sendToContentScript({
    name: 'msg',
    body: {}
  })
} catch (error) {
  console.error('No active tab found')
}
```

---

## sendToActiveContentScript

**DEPRECATED** - Use `sendToContentScript` instead.

```typescript
const response = await sendToActiveContentScript(request)
```

Alias for `sendToContentScript()` for backwards compatibility.

---

## onMessage

Listen for messages in any context (background, content script, popup).

```typescript
const unsubscribe = onMessage<RequestBody, ResponseBody>(handler)
```

**Parameters:**
- `handler` - Async function
  - `request` - Message request with sender info
  - `response` - Response object with send() method

**Returns:** () => void (cleanup function)

**Handler signature:**
```typescript
async (request, response) => {
  response.send(responseBody)
}
```

**Examples:**

Basic handler:
```typescript
import { onMessage } from 'webext-message'

onMessage(async (request, response) => {
  console.log('Message received:', request.name)
  response.send({ success: true })
})
```

With types:
```typescript
interface UserRequest {
  userId: string
}

interface UserResponse {
  name: string
  email: string
}

const unsubscribe = onMessage<UserRequest, UserResponse>(
  async (request, response) => {
    const { userId } = request.body || {}
    
    const user = await fetchUser(userId)
    response.send(user)
  }
)

// Later, cleanup
unsubscribe()
```

Specific message:
```typescript
onMessage(async (request, response) => {
  if (request.name === 'getData') {
    const data = await getData()
    response.send({ data })
  }
})
```

Get sender info:
```typescript
onMessage(async (request, response) => {
  const tabId = request.sender?.tab?.id
  const url = request.sender?.url
  
  console.log(`Message from tab ${tabId}: ${url}`)
  response.send({ ok: true })
})
```

Async operations:
```typescript
onMessage(async (request, response) => {
  try {
    const result = await heavyOperation()
    response.send({ result })
  } catch (error) {
    response.send({ error: error.message })
  }
})
```

Multiple handlers:
```typescript
onMessage(async (request, response) => {
  if (request.name === 'ping') {
    response.send({ pong: true })
  }
})

onMessage(async (request, response) => {
  if (request.name === 'echo') {
    response.send({ echo: request.body })
  }
})
```

---

## onPort

Listen on specific named port for long-lived connections.

```typescript
const unsubscribe = onPort<RequestBody, ResponseBody>(
  name,
  handler
)
```

**Parameters:**
- `name` (string) - Port name identifier
- `handler` - Async function handling port messages

**Returns:** () => void (cleanup function)

**Examples:**

Basic port:
```typescript
import { onPort } from 'webext-message'

onPort('worker', async (message) => {
  console.log('Port message:', message)
})
```

With types:
```typescript
interface WorkerTask {
  type: 'process' | 'fetch'
  data: any
}

const cleanup = onPort<WorkerTask>(
  'worker',
  async (message) => {
    if (message.type === 'process') {
      const result = await process(message.data)
      // Send back via port
    }
  }
)
```

Multiple handlers:
```typescript
onPort('stream', async (data) => {
  console.log('Stream data:', data)
})

onPort('stream', async (data) => {
  saveData(data)
})
```

Cleanup:
```typescript
const cleanup = onPort('temp', handler)
// Later...
cleanup()
```

---

## relayMessage

Setup relay for window message communication (content script/page).

```typescript
const cleanup = relayMessage<RequestBody, ResponseBody>(request)
```

**Parameters:**
- `request` - Relay request
  - `name` (string) - Message name
  - `relayId` (string) - Relay identifier (optional)
  - `targetOrigin` (string) - Target origin (optional)

**Returns:** () => void (cleanup function)

**Examples:**

Basic relay:
```typescript
import { relayMessage } from 'webext-message'

const cleanup = relayMessage({
  name: 'pageMsg',
  body: { data: 'test' }
})
```

With types:
```typescript
interface PageRequest {
  query: string
}

const cleanup = relayMessage<PageRequest>({
  name: 'search',
  body: { query: 'react' }
})
```

With relay ID:
```typescript
const cleanup = relayMessage({
  name: 'relay',
  body: {},
  relayId: 'unique-123'
})
```

Cleanup on unmount:
```typescript
useEffect(() => {
  const cleanup = relayMessage({
    name: 'msg',
    body: {}
  })
  
  return cleanup
}, [])
```

---

## sendViaRelay

Send message via relay mechanism (content script to page or vice versa).

```typescript
const response = await sendViaRelay<RequestBody, ResponseBody>(request)
```

**Parameters:**
- `request` - Relay request
  - `name` (string) - Message name
  - `body` (any) - Payload
  - `relayId` (string) - Relay ID (optional)
  - `targetOrigin` (string) - Target origin

**Returns:** Promise<ResponseBody>

**Timeout:** 30 seconds

**Examples:**

Basic relay send:
```typescript
import { sendViaRelay } from 'webext-message'

const response = await sendViaRelay({
  name: 'relayMsg',
  body: { data: 'test' }
})
```

With types:
```typescript
interface RelayRequest {
  command: string
}

interface RelayResponse {
  result: string
}

const response = await sendViaRelay<RelayRequest, RelayResponse>({
  name: 'command',
  body: { command: 'execute' }
})

console.log(response.result)
```

With relay ID:
```typescript
const response = await sendViaRelay({
  name: 'msg',
  body: {},
  relayId: 'instance-1'
})
```

Timeout handling:
```typescript
try {
  const response = await sendViaRelay({
    name: 'slowOp',
    body: {}
  })
} catch (error) {
  console.error('Timeout after 30 seconds')
}
```

---

## sendToBackgroundViaRelay

Send message via relay to background (alias for sendViaRelay).

```typescript
const response = await sendToBackgroundViaRelay<Req, Res>(request)
```

Same as `sendViaRelay()`.

**Example:**
```typescript
import { sendToBackgroundViaRelay } from 'webext-message'

const response = await sendToBackgroundViaRelay({
  name: 'bgMsg',
  body: { data: 'test' }
})
```

---

## relay

**DEPRECATED** - Use `relayMessage` instead.

```typescript
const cleanup = relay(request)
```

Alias for backwards compatibility.

---

## sendViaRelay (from relay module)

**DEPRECATED** - Use `sendToBackgroundViaRelay` instead.

```typescript
const response = await sendViaRelay(request)
```

Alias for backwards compatibility.

---

## initializeBackgroundMessaging

Setup background message routing (call once at startup).

```typescript
import { initializeBackgroundMessaging } from 'webext-message'

initializeBackgroundMessaging()
```

**Parameters:** None

**Returns:** void

**When to use:** Background script initialization

**Examples:**

In background.ts:
```typescript
import { initializeBackgroundMessaging, onMessage } from 'webext-message'

// Initialize first
initializeBackgroundMessaging()

// Then setup handlers
onMessage(async (request, response) => {
  response.send({ ok: true })
})
```

Auto-initialization:
```typescript
// No explicit call needed - auto-called on import
// But recommended for clarity
import { initializeBackgroundMessaging } from 'webext-message'

initializeBackgroundMessaging()
```

---

## startHub

Initialize pub-sub hub in background for multi-tab communication.

```typescript
import { startHub } from 'webext-message'

startHub()
```

**Parameters:** None

**Returns:** void

**When to use:** Once in background script

**Examples:**

Setup hub:
```typescript
import { startHub, broadcast } from 'webext-message'

startHub()

// Now can broadcast to other tabs
broadcast({
  payload: { type: 'update', data: 'new' }
})
```

---

## broadcast

Send message to all subscribed tabs/contexts.

```typescript
broadcast(message)
```

**Parameters:**
- `message` - Broadcast message
  - `payload` (any) - Data to send (required)
  - `from` (number) - Sender tab ID (optional, auto-skipped)
  - `to` (number) - Target tab ID (optional)

**Returns:** void

**Examples:**

Basic broadcast:
```typescript
import { broadcast } from 'webext-message'

broadcast({
  payload: { type: 'stateChange', state: newState }
})
```

With sender info:
```typescript
const currentTabId = await getCurrentTabId()

broadcast({
  from: currentTabId,
  payload: { type: 'notification', message: 'hello' }
})
```

Targeted broadcast:
```typescript
broadcast({
  to: targetTabId,
  payload: { type: 'direct', data: 'test' }
})
```

Complex payload:
```typescript
broadcast({
  payload: {
    type: 'sync',
    data: {
      users: [{ id: 1, name: 'John' }],
      settings: { theme: 'dark' }
    },
    timestamp: Date.now()
  }
})
```

---

## subscribe

Subscribe to pub-sub broadcasts.

```typescript
const unsubscribe = subscribe(callback)
```

**Parameters:**
- `callback` - Function handling messages
  - Receives broadcast message

**Returns:** () => void (unsubscribe function)

**Examples:**

Basic subscribe:
```typescript
import { subscribe } from 'webext-message'

const unsubscribe = subscribe((message) => {
  console.log('Broadcast received:', message.payload)
})

// Later
unsubscribe()
```

With types:
```typescript
interface BroadcastPayload {
  type: 'update' | 'delete' | 'create'
  data: any
}

subscribe((message) => {
  const { type, data } = message.payload as BroadcastPayload
  
  if (type === 'update') {
    updateUI(data)
  }
})
```

Multiple subscribers:
```typescript
subscribe((message) => {
  console.log('Sub 1:', message)
})

subscribe((message) => {
  console.log('Sub 2:', message)
})
```

Unsubscribe:
```typescript
const unsubscribe = subscribe(handler)

// Later when done
unsubscribe()
```

---

# Hooks Module: webext-message/hook

Import from: `import { ... } from 'webext-message/hook'`

---

## useMessage

React hook to listen for messages in component.

```typescript
const { data } = useMessage<RequestBody, ResponseBody>(handler)
```

**Parameters:**
- `handler` - Async message handler
  - `request` - Message request
  - `response` - Response with send() method

**Returns:** Object
- `data` - Latest received message body

**Examples:**

Basic hook:
```typescript
import { useMessage } from 'webext-message/hook'

function MyComponent() {
  const { data } = useMessage(async (request, response) => {
    console.log('Message received')
    response.send({ ok: true })
  })

  return <div>{JSON.stringify(data)}</div>
}
```

With types:
```typescript
interface NotificationPayload {
  title: string
  message: string
}

function NotificationComponent() {
  const { data } = useMessage<
    NotificationPayload,
    { dismissed: boolean }
  >(async (request, response) => {
    const { title, message } = request.body || {}
    
    showNotification(title, message)
    response.send({ dismissed: true })
  })

  return <div>{data?.title}</div>
}
```

Multiple message types:
```typescript
function Dashboard() {
  const { data: updateData } = useMessage(async (request, response) => {
    if (request.name === 'dataUpdate') {
      response.send({ processed: true })
    }
  })

  const { data: alertData } = useMessage(async (request, response) => {
    if (request.name === 'alert') {
      response.send({ acknowledged: true })
    }
  })

  return (
    <div>
      <div>Update: {JSON.stringify(updateData)}</div>
      <div>Alert: {JSON.stringify(alertData)}</div>
    </div>
  )
}
```

State management:
```typescript
function DataDisplay() {
  const [count, setCount] = useState(0)

  const { data } = useMessage(async (request, response) => {
    if (request.name === 'increment') {
      setCount(prev => prev + 1)
      response.send({ count: count + 1 })
    }
  })

  return <div>Count: {count}</div>
}
```

---

## usePort

React hook for port-based communication.

```typescript
const { data, send, listen } = usePort<RequestBody, ResponseBody>(name)
```

**Parameters:**
- `name` (string) - Port name identifier

**Returns:** Object
- `data` - Latest received port data
- `send` - Send function: (payload) => void
- `listen` - Register listener: (handler) => { port, disconnect }

**Examples:**

Basic port:
```typescript
import { usePort } from 'webext-message/hook'

function PortComponent() {
  const { data, send } = usePort('worker')

  return (
    <button onClick={() => send({ type: 'ping' })}>
      Send Message
    </button>
  )
}
```

With types:
```typescript
interface WorkerMessage {
  type: 'task' | 'query'
  payload: any
}

interface WorkerResponse {
  result: string
  timestamp: number
}

function TaskExecutor() {
  const { data, send } = usePort<WorkerMessage, WorkerResponse>('executor')

  const runTask = (payload: any) => {
    send({ type: 'task', payload })
  }

  return (
    <div>
      <button onClick={() => runTask({ action: 'process' })}>
        Execute
      </button>
      <div>Result: {data?.result}</div>
    </div>
  )
}
```

Listen for data:
```typescript
function Listener() {
  const { listen } = usePort('updates')

  const handleData = (msg: any) => {
    console.log('Update:', msg)
  }

  const { port, disconnect } = listen(handleData)

  return (
    <button onClick={disconnect}>
      Stop Listening
    </button>
  )
}
```

Full example:
```typescript
function DataSync() {
  const { data, send, listen } = usePort('sync')

  useEffect(() => {
    const { disconnect } = listen((newData) => {
      console.log('Synced:', newData)
    })

    return disconnect
  }, [])

  return (
    <div>
      <button onClick={() => send({ action: 'sync' })}>
        Sync Data
      </button>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
```

---

## useRelay

React hook for relay-based communication.

```typescript
const cleanup = useRelay<RequestBody, ResponseBody>(request, handler)
```

**Parameters:**
- `request` - Relay request object
- `handler` - Async handler for responses

**Returns:** () => void (cleanup function)

**Examples:**

Basic relay:
```typescript
import { useRelay } from 'webext-message/hook'

function RelayComponent() {
  useRelay(
    { name: 'relayMsg' },
    async (request) => ({ response: 'ok' })
  )

  return <div>Relay active</div>
}
```

With types:
```typescript
interface PageRequest {
  command: string
}

interface PageResponse {
  status: string
}

function PageController() {
  useRelay<PageRequest, PageResponse>(
    { name: 'pageControl' },
    async (request) => {
      const { command } = request
      
      if (command === 'load') {
        return { status: 'loaded' }
      }
      
      return { status: 'unknown' }
    }
  )

  return <div>Controlling page</div>
}
```

Cleanup:
```typescript
function TemporaryRelay() {
  const cleanup = useRelay(
    { name: 'temp' },
    async (req) => ({ ok: true })
  )

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return <div>Temp relay</div>
}
```

---

## useMessageRelay

Simplified hook for message relay.

```typescript
useMessageRelay<RequestBody>(request)
```

**Parameters:**
- `request` - Message relay request

**Returns:** void

**Examples:**

Basic usage:
```typescript
import { useMessageRelay } from 'webext-message/hook'

function Component() {
  useMessageRelay({
    name: 'msg',
    body: { data: 'test' }
  })

  return <div>Relay setup</div>
}
```

---

# Port Module: webext-message/port

Import from: `import { ... } from 'webext-message/port'`

---

## getPort

Get or create port connection with name.

```typescript
const port = getPort(name)
```

**Parameters:**
- `name` (string) - Port name identifier

**Returns:** chrome.runtime.Port

**Caching:** Ports cached by name, reused on subsequent calls

**Examples:**

Get port:
```typescript
import { getPort } from 'webext-message/port'

const port = getPort('worker')
port.postMessage({ type: 'task' })
```

Send message:
```typescript
const port = getPort('stream')

port.postMessage({
  type: 'data',
  payload: { items: [1, 2, 3] }
})
```

Listen for response:
```typescript
const port = getPort('bidirectional')

port.onMessage.addListener((message) => {
  console.log('Response:', message)
})

port.postMessage({ type: 'request' })
```

Multiple ports:
```typescript
const worker = getPort('worker')
const stream = getPort('stream')
const ui = getPort('ui')

// Each maintains separate connection
worker.postMessage({ type: 'work' })
stream.postMessage({ type: 'stream' })
ui.postMessage({ type: 'update' })
```

---

## removePort

Remove port from cache, forces new connection next time.

```typescript
removePort(name)
```

**Parameters:**
- `name` (string) - Port name

**Returns:** void

**Examples:**

Clear port:
```typescript
import { removePort } from 'webext-message/port'

removePort('worker')

// Next getPort call creates new connection
const port = getPort('worker')
```

After disconnect:
```typescript
const port = getPort('temp')

port.onDisconnect.addListener(() => {
  removePort('temp')
  console.log('Port cleaned up')
})
```

Reset connection:
```typescript
function reconnectPort(name: string) {
  removePort(name)
  return getPort(name) // New connection
}
```

---

## listen

Listen on port for messages.

```typescript
const { port, disconnect } = listen<ResponseBody>(
  name,
  handler,
  onReconnect?
)
```

**Parameters:**
- `name` (string) - Port name
- `handler` - Async function: (message) => void | Promise
- `onReconnect` - Optional callback on disconnect

**Returns:** Object
- `port` - chrome.runtime.Port
- `disconnect` - Cleanup function

**Examples:**

Basic listen:
```typescript
import { listen } from 'webext-message/port'

const { port, disconnect } = listen('messages', (message) => {
  console.log('Received:', message)
})

// Later
disconnect()
```

With types:
```typescript
interface PortMessage {
  type: 'update' | 'delete'
  data: any
}

const { port, disconnect } = listen<PortMessage>(
  'data-sync',
  async (message) => {
    if (message.type === 'update') {
      await updateDatabase(message.data)
    }
  }
)
```

Reconnection:
```typescript
const { port, disconnect } = listen(
  'worker',
  (message) => {
    console.log('Message:', message)
  },
  () => {
    console.log('Reconnecting...')
    // Attempt reconnect
  }
)
```

Multiple listeners:
```typescript
const listener1 = listen('stream', (msg) => {
  console.log('Listener 1:', msg)
})

const listener2 = listen('stream', (msg) => {
  console.log('Listener 2:', msg)
})

// Both receive same messages
```

Cleanup:
```typescript
useEffect(() => {
  const { disconnect } = listen('component-port', handler)
  return disconnect
}, [])
```

---

# Relay Module: webext-message/relay

Import from: `import { ... } from 'webext-message/relay'`

---

## relay

Setup relay handler for window.postMessage.

```typescript
const cleanup = relay<RequestBody, ResponseBody>(
  request,
  handler,
  messagePort?
)
```

**Parameters:**
- `request` - Relay request
  - `name` (string) - Message name
  - `relayId` (string) - Relay ID (optional)
- `handler` - Async function: (request) => Promise<ResponseBody>
- `messagePort` - Optional message port (default: window)

**Returns:** () => void (cleanup function)

**Examples:**

Basic relay:
```typescript
import { relay } from 'webext-message/relay'

const cleanup = relay(
  { name: 'getData' },
  async (request) => {
    const data = await fetch('/data')
    return { data }
  }
)
```

With types:
```typescript
interface QueryRequest {
  query: string
  limit: number
}

interface QueryResponse {
  results: any[]
  total: number
}

const cleanup = relay<QueryRequest, QueryResponse>(
  { name: 'search' },
  async (request) => {
    const results = await search(
      request.body?.query || '',
      request.body?.limit || 10
    )
    
    return { results, total: results.length }
  }
)
```

With relay ID:
```typescript
const cleanup = relay(
  { name: 'msg', relayId: 'instance-1' },
  async (request) => ({ ok: true })
)
```

Custom port:
```typescript
const customPort = document.getElementById('iframe') as HTMLIFrameElement
const cleanup = relay(
  { name: 'iframeMsg' },
  async (request) => ({ response: 'ok' }),
  customPort.contentWindow as any
)
```

Error handling:
```typescript
const cleanup = relay(
  { name: 'risky' },
  async (request) => {
    try {
      return await riskyOperation()
    } catch (error) {
      throw new Error('Operation failed')
    }
  }
)
```

Cleanup:
```typescript
useEffect(() => {
  const cleanup = relay({ name: 'temp' }, handler)
  return cleanup
}, [])
```

---

## sendViaRelay

Send message via relay mechanism.

```typescript
const response = await sendViaRelay<RequestBody, ResponseBody>(
  request,
  messagePort?
)
```

**Parameters:**
- `request` - Relay request
  - `name` (string) - Message name
  - `body` (any) - Payload
  - `relayId` (string) - Relay ID (optional)
  - `targetOrigin` (string) - Target origin (optional)
- `messagePort` - Optional message port (default: window)

**Returns:** Promise<ResponseBody>

**Timeout:** 30 seconds default

**Examples:**

Basic send:
```typescript
import { sendViaRelay } from 'webext-message/relay'

const response = await sendViaRelay({
  name: 'getData',
  body: { id: 123 }
})
```

With types:
```typescript
interface Request {
  action: 'load' | 'save'
  payload: any
}

interface Response {
  success: boolean
  message: string
}

const response = await sendViaRelay<Request, Response>({
  name: 'action',
  body: { action: 'load', payload: {} }
})

console.log(response.message)
```

With target origin:
```typescript
const response = await sendViaRelay({
  name: 'msg',
  body: {},
  targetOrigin: 'https://example.com'
})
```

Custom port:
```typescript
const iframe = document.getElementById('myframe') as HTMLIFrameElement
const response = await sendViaRelay(
  { name: 'iframeMsg', body: {} },
  iframe.contentWindow
)
```

Error handling:
```typescript
try {
  const response = await sendViaRelay({
    name: 'operation',
    body: {}
  })
  console.log('Success:', response)
} catch (error) {
  console.error('Relay failed:', error)
}
```

Timeout handling:
```typescript
try {
  const response = await sendViaRelay({
    name: 'slowOp',
    body: {}
  })
} catch (error) {
  if (error.message.includes('Timeout')) {
    console.error('Operation took too long (>30s)')
  }
}
```

---

# Pub-Sub Module: webext-message/pub-sub

Import from: `import { ... } from 'webext-message/pub-sub'`

---

## startHub

Initialize pub-sub hub in background.

```typescript
startHub()
```

**Parameters:** None

**Returns:** void

**When to use:** Once in background.ts

**Examples:**

Setup:
```typescript
import { startHub } from 'webext-message/pub-sub'

startHub()

console.log('Hub ready, can broadcast now')
```

With other init:
```typescript
import { initializeBackgroundMessaging } from 'webext-message'
import { startHub } from 'webext-message/pub-sub'

initializeBackgroundMessaging()
startHub()
```

---

## getHubMap

Get internal port map for hub (advanced usage).

```typescript
const map = getHubMap()
```

**Parameters:** None

**Returns:** Map<number, chrome.runtime.Port>

**Note:** Usually don't need direct access

**Examples:**

Check active connections:
```typescript
import { getHubMap } from 'webext-message/pub-sub'

const map = getHubMap()
console.log(`Connected tabs: ${map.size}`)
```

Iterate tabs:
```typescript
const map = getHubMap()

for (const [tabId, port] of map.entries()) {
  console.log(`Tab ${tabId} connected`)
}
```

---

## broadcast

Send message to all subscribed tabs.

```typescript
broadcast(message)
```

**Parameters:**
- `message` - Broadcast message
  - `payload` (any) - Data (required)
  - `from` (number) - Sender tab ID
  - `to` (number) - Target tab ID

**Returns:** void

**Examples:**

Basic broadcast:
```typescript
import { broadcast } from 'webext-message/pub-sub'

broadcast({
  payload: { type: 'notification', message: 'Hello all tabs!' }
})
```

With sender:
```typescript
const tabId = await getCurrentTabId()

broadcast({
  from: tabId,
  payload: { type: 'update', data: newData }
})
```

Targeted:
```typescript
broadcast({
  to: specificTabId,
  payload: { type: 'direct', message: 'Just for you' }
})
```

Complex payload:
```typescript
broadcast({
  payload: {
    type: 'sync',
    timestamp: Date.now(),
    changes: {
      added: [{ id: 1, name: 'New Item' }],
      removed: [2, 3],
      modified: { 4: { status: 'active' } }
    }
  }
})
```

---

## subscribe

Subscribe to broadcasts.

```typescript
const unsubscribe = subscribe(callback)
```

**Parameters:**
- `callback` - Function: (message) => void
  - Receives: { payload, from?, to? }

**Returns:** () => void (unsubscribe)

**Examples:**

Basic subscribe:
```typescript
import { subscribe } from 'webext-message/pub-sub'

const unsubscribe = subscribe((message) => {
  console.log('Broadcast:', message.payload)
})

// Later
unsubscribe()
```

With types:
```typescript
interface BroadcastMessage {
  type: 'update' | 'delete' | 'notification'
  data?: any
  timestamp?: number
}

subscribe((message) => {
  const payload = message.payload as BroadcastMessage
  
  switch (payload.type) {
    case 'update':
      updateUI(payload.data)
      break
    case 'delete':
      removeItem(payload.data)
      break
    case 'notification':
      showNotification(payload.data)
      break
  }
})
```

Multiple subscriptions:
```typescript
subscribe((msg) => console.log('Sub1:', msg))
subscribe((msg) => console.log('Sub2:', msg))
subscribe((msg) => console.log('Sub3:', msg))
```

Unsubscribe cleanup:
```typescript
useEffect(() => {
  const unsubscribe = subscribe(handleBroadcast)
  return unsubscribe
}, [])
```

Conditional handling:
```typescript
subscribe((message) => {
  if (message.from === getCurrentTabId()) {
    return // Ignore own messages
  }
  
  handleBroadcast(message.payload)
})
```

---

# Message Module: webext-message/message

Import from: `import { listen } from 'webext-message/message'`

---

## listen

Low-level message listener (use onMessage instead).

```typescript
const unsubscribe = listen<RequestBody, ResponseBody>(handler)
```

**Parameters:**
- `handler` - Async function: (request, response) => void

**Returns:** () => void (cleanup)

**Examples:**

Basic listener:
```typescript
import { listen } from 'webext-message/message'

const unsubscribe = listen(async (request, response) => {
  console.log('Message:', request.name)
  response.send({ ok: true })
})
```

With types:
```typescript
const unsubscribe = listen<{ id: string }, { success: boolean }>(
  async (request, response) => {
    const id = request.body?.id
    response.send({ success: !!id })
  }
)
```

Cleanup:
```typescript
const cleanup = listen(handler)
// Later
cleanup()
```

---

# Background Module: webext-message/background

Import from: `import { ... } from 'webext-message/background'`

---

## initializeBackgroundMessaging

Setup background message routing.

```typescript
import { initializeBackgroundMessaging } from 'webext-message'

initializeBackgroundMessaging()
```

Already covered in main module section above.

---

## getPortMap

Get map of active ports (advanced).

```typescript
const map = getPortMap()
```

**Parameters:** None

**Returns:** Map<string, chrome.runtime.Port>

**Examples:**

Check active ports:
```typescript
import { getPortMap } from 'webext-message/background'

const map = getPortMap()
console.log(`Active ports: ${map.size}`)
```

Iterate:
```typescript
const map = getPortMap()

for (const [name, port] of map.entries()) {
  console.log(`Port ${name} active`)
}
```

---

## getPort (background version)

Get port from background map.

```typescript
const port = getPort(name)
```

**Parameters:**
- `name` (string) - Port name

**Returns:** chrome.runtime.Port

**Throws:** Error if port not found

**Examples:**

Get port:
```typescript
import { getPort } from 'webext-message/background'

const port = getPort('worker')
port.postMessage({ type: 'task' })
```

---

# Debug Module: webext-message/debug

Import from: `import { getDebugger } from 'webext-message/debug'`

---

## getDebugger

Get debug instance for message tracking.

```typescript
const debugger = getDebugger()
```

**Parameters:** None

**Returns:** MessageDebugger instance

**Examples:**

Enable debugging:
```typescript
import { getDebugger } from 'webext-message/debug'

const debugger = getDebugger()
debugger.enable()

// Now logs all messages
```

View logs:
```typescript
const debugger = getDebugger()

debugger.printEvents()
debugger.printStats()
```

Console access:
```typescript
// In browser console
window.__extMessagingDebugger.enable()
window.__extMessagingDebugger.printEvents()
window.__extMessagingDebugger.printStats()
```

---

## MessageDebugger Class

Debug message activity.

**Methods:**

### enable()
Enable debug logging.

```typescript
debugger.enable()
```

### disable()
Disable debug logging.

```typescript
debugger.disable()
```

### logSend(name, body, tabId?)
Log outgoing message.

```typescript
debugger.logSend('getMessage', { id: 1 }, 123)
```

### logReceive(name, body, tabId?)
Log incoming message.

```typescript
debugger.logReceive('dataUpdate', data, 456)
```

### logPortConnect(name)
Log port connection.

```typescript
debugger.logPortConnect('worker')
```

### logPortDisconnect(name)
Log port disconnect.

```typescript
debugger.logPortDisconnect('worker')
```

### logError(name, error)
Log error.

```typescript
debugger.logError('operation', new Error('Failed'))
```

### getEvents()
Get all logged events.

```typescript
const events = debugger.getEvents()
console.log(events)
```

### getStats()
Get statistics.

```typescript
const stats = debugger.getStats()
console.table(stats)
```

### clear()
Clear all logs.

```typescript
debugger.clear()
```

### printEvents()
Print events to console.

```typescript
debugger.printEvents()
```

### printStats()
Print stats to console.

```typescript
debugger.printStats()
```

**Example:**

```typescript
import { getDebugger } from 'webext-message/debug'

const debugger = getDebugger()
debugger.enable()

// Use extension normally, logs all messages

debugger.printEvents()  // Show all events
debugger.printStats()   // Show statistics
debugger.getStats()     // Get as object
```

---

# Utils Module: webext-message/utils

Import from: `import { ... } from 'webext-message/utils'` or individual imports

---

## getExtRuntime

Get Chrome/browser runtime API.

```typescript
const runtime = getExtRuntime()
```

**Parameters:** None

**Returns:** chrome.runtime

**Throws:** Error if runtime not available

**Examples:**

Get runtime:
```typescript
import { getExtRuntime } from 'webext-message/utils'

const runtime = getExtRuntime()
console.log(runtime.id)
```

Send message:
```typescript
const runtime = getExtRuntime()
runtime.sendMessage({ test: true })
```

---

## getExtTabs

Get Chrome tabs API.

```typescript
const tabs = getExtTabs()
```

**Parameters:** None

**Returns:** chrome.tabs

**Throws:** Error if tabs API not available

**Examples:**

Get tabs:
```typescript
import { getExtTabs } from 'webext-message/utils'

const tabs = getExtTabs()
const [activeTab] = await tabs.query({ active: true, currentWindow: true })
```

---

## getActiveTab

Get current active tab.

```typescript
const tab = await getActiveTab()
```

**Parameters:** None

**Returns:** Promise<chrome.tabs.Tab | undefined>

**Examples:**

Get active tab:
```typescript
import { getActiveTab } from 'webext-message/utils'

const tab = await getActiveTab()
if (tab) {
  console.log(`Active tab: ${tab.url}`)
}
```

With ID:
```typescript
const tab = await getActiveTab()
const tabId = tab?.id

if (tabId) {
  await sendToContentScript({
    name: 'msg',
    body: {},
    tabId
  })
}
```

---

## isSameOrigin

Validate message origin for relay.

```typescript
const isSame = isSameOrigin(event, request)
```

**Parameters:**
- `event` - MessageEvent
- `request` - Request object

**Returns:** boolean

**Examples:**

Check origin:
```typescript
import { isSameOrigin } from 'webext-message/utils'

window.addEventListener('message', (event) => {
  if (isSameOrigin(event, { name: 'msg' })) {
    console.log('Valid origin')
  }
})
```

---

## getRuntimeContext

Detect extension context (background, content, etc).

```typescript
const context = getRuntimeContext()
```

**Parameters:** None

**Returns:** 'background' | 'content-script' | 'window' | undefined

**Examples:**

Detect context:
```typescript
import { getRuntimeContext } from 'webext-message/utils'

const context = getRuntimeContext()

if (context === 'background') {
  console.log('Running in background')
} else if (context === 'content-script') {
  console.log('Running in content script')
} else if (context === 'window') {
  console.log('Running in page context')
}
```

Conditional logic:
```typescript
const context = getRuntimeContext()

if (context === 'background') {
  // Setup background handlers
  initializeBackgroundMessaging()
} else if (context === 'content-script') {
  // Setup content script listeners
  setupContentScript()
}
```

---

# Types Module

Import from: `import type { ... } from 'webext-message'`

---

## ExtMessaging Namespace

All type definitions.

```typescript
import type { ExtMessaging } from 'webext-message'
```

**Key types:**

### ExtMessaging.Request<Name, Body>
Message request.

```typescript
interface Request<TName = any, TBody = any> {
  name: TName
  extensionId?: string
  port?: chrome.runtime.Port
  sender?: chrome.runtime.MessageSender
  body?: TBody
  tabId?: number
  relayId?: string
  targetOrigin?: string
}
```

### ExtMessaging.Response<Body>
Response object.

```typescript
interface Response<TBody = any> {
  send: (body: TBody) => void
}
```

### ExtMessaging.Handler<Name, ReqBody, ResBody>
Message handler.

```typescript
type Handler<
  RequestName = string,
  RequestBody = any,
  ResponseBody = any
> = (
  request: Request<RequestName, RequestBody>,
  response: Response<ResponseBody>
) => void | Promise<void> | boolean
```

### ExtMessaging.PortHandler
Port handler type.

### ExtMessaging.MessageHandler
Message handler type.

### ExtMessaging.SendFx
Send function type.

### ExtMessaging.RelayFx
Relay function type.

### ExtMessaging.PortHook
Port hook return type.

---

## PlasmoMessaging Namespace

Compatibility alias (same as ExtMessaging).

```typescript
import type { PlasmoMessaging } from 'webext-message'

// Same as ExtMessaging
type Request = PlasmoMessaging.Request
```

---

# Complete Examples

## Example 1: Simple Message Flow

```typescript
// background.ts
import { onMessage } from 'webext-message'

onMessage<{ name: string }, { greeting: string }>(
  async (request, response) => {
    const greeting = `Hello, ${request.body?.name || 'User'}!`
    response.send({ greeting })
  }
)

// content.ts
import { sendToBackground } from 'webext-message'

const response = await sendToBackground<
  { name: string },
  { greeting: string }
>({
  name: 'greet',
  body: { name: 'John' }
})

console.log(response.greeting) // "Hello, John!"
```

## Example 2: Port Communication

```typescript
// background.ts
import { onPort } from 'webext-message'

onPort('stream', async (message) => {
  console.log('Stream data:', message)
})

// content.ts
import { usePort } from 'webext-message/hook'

function Streamer() {
  const { send } = usePort('stream')

  const stream = () => {
    for (let i = 0; i < 10; i++) {
      send({ chunk: i })
    }
  }

  return <button onClick={stream}>Stream Data</button>
}
```

## Example 3: Pub-Sub

```typescript
// background.ts
import { startHub, broadcast } from 'webext-message'

startHub()

broadcast({
  payload: { type: 'update', data: 'new state' }
})

// content.ts
import { subscribe } from 'webext-message/pub-sub'

subscribe((message) => {
  const { type, data } = message.payload
  if (type === 'update') {
    updateUI(data)
  }
})
```

---

**End of API Documentation**

All functions documented with parameters, return values, and practical examples.

For more patterns and advanced usage, see PATTERNS.md.
