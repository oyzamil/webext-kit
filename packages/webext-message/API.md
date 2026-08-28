# API Quick Reference - webext-message

Fast lookup for all exported functions and hooks.

## Main Module: webext-message

### Messaging

`sendToBackground<Req, Res>(request)`
- Send message to background service worker
- Returns Promise<Res>
- Use from content scripts, popups, options pages

`sendToContentScript<Req, Res>(request)`
- Send message to content script on specific tab
- Returns Promise<Res>
- Use from background or other pages

`relayMessage<Req, Res>(request)`
- Relay message through background
- Returns () => void (cleanup function)
- For window-to-window communication

`sendToBackgroundViaRelay<Req, Res>(request)`
- Send message via relay to background
- Returns Promise<Res>
- Timeout: 30 seconds

### Handlers

`onMessage<Req, Res>(handler)`
- Listen for messages in any context
- Handler: (request, response) => void | Promise
- Returns () => void (cleanup function)
- Executes in background, content script, or page

`onPort<Req, Res>(name, handler)`
- Listen on specific port connection
- Handler: (message) => void | Promise
- Returns { port, disconnect }
- For long-lived connections

### Pub-Sub

`startHub()`
- Initialize pub-sub hub in background
- No parameters
- Call once at startup

`broadcast(message)`
- Send message to all subscribers
- Message: { payload, from?, to? }
- Use for multi-tab communication

`subscribe(callback)`
- Subscribe to broadcasts
- Callback: (message) => void
- Returns () => void (unsubscribe)

### Setup

`initializeBackgroundMessaging()`
- Initialize background message handling
- No parameters
- Auto-called on import (recommend explicit call)

---

## Hooks Module: webext-message/hook

### React Hooks

`useMessage<Req, Res>(handler)`
- Hook to listen for messages in component
- Handler: (request, response) => void | Promise
- Returns { data?: Req }
- Mounts listener on component mount

`usePort<Req, Res>(name)`
- Hook for port communication
- Returns { data?, send, listen }
- Connects on mount, disconnects on unmount

`useRelay<Req, Res>(request, handler)`
- Hook for relay communication
- Returns () => void (cleanup)
- Sets up relay on mount

`useMessageRelay<Req>(request)`
- Hook to relay message
- No return value
- Simplified relay hook

---

## Port Module: webext-message/port

### Port Management

`getPort(name)`
- Get or create port connection
- Returns chrome.runtime.Port
- Cached per name

`removePort(name)`
- Remove port from cache
- No return value
- Forces new connection on next getPort

`listen<T>(name, handler, onReconnect?)`
- Listen on port
- Handler: (msg) => void | Promise
- Returns { port, disconnect }
- Supports reconnection callback

---

## Relay Module: webext-message/relay

### Relay Functions

`relay<Req, Res>(request, handler, port?)`
- Set up relay handler
- Handler: (request) => Promise<Res>
- Returns () => void (cleanup)
- Optional port parameter (default: window)

`sendViaRelay<Req, Res>(request, port?)`
- Send via relay
- Returns Promise<Res>
- Timeout: 30 seconds
- Optional port parameter

---

## Pub-Sub Module: webext-message/pub-sub

### Pub-Sub Functions

`getHubMap()`
- Get port map for hub
- Returns Map<number, chrome.runtime.Port>
- Usually don't need direct access

`startHub()`
- Initialize hub in background
- Handles onConnectExternal
- Required before broadcast

`broadcast(message)`
- Send to all connected ports
- Message: { payload, from?, to? }
- from: sender tabId (auto-skipped), to: recipient tabId

`subscribe(callback)`
- Subscribe to messages
- Callback: (message) => void
- Returns () => void to unsubscribe

---

## Message Module: webext-message/message

### Message Handler

`listen<Req, Res>(handler)`
- Listen for messages (lower-level)
- Handler: (request, response) => void | Promise
- Returns () => void (cleanup)
- Similar to onMessage but basic wrapper

---

## Background Module: webext-message/background

### Background Functions

`initializeBackgroundMessaging()`
- Set up background message routing
- No parameters
- Auto-called on module import

`getPortMap()`
- Get map of active ports
- Returns Map<PortName, chrome.runtime.Port>
- For advanced port management

`getPort(name)`
- Get port from map
- Throws if port not found
- For managing active ports

---

## Types Module: webext-message/types

### Type Definitions

`ExtMessaging`
- Main namespace with all types
- Contains Request, Response, Handler, etc.

`ExtMessaging.Request<Name, Body>`
- Message request type
- Properties: name, body?, tabId?, extensionId?, sender?, port?, relayId?, targetOrigin?

`ExtMessaging.Response<Body>`
- Response object type
- Methods: send(body)

`ExtMessaging.Handler<Name, ReqBody, ResBody>`
- Handler function type
- Signature: (request, response) => void | Promise

`PlasmoMessaging`
- Compatibility namespace (alias for ExtMessaging)
- Use for Plasmo migration

---

## Quick Examples

### Send Message
```typescript
const response = await sendToBackground({
  name: 'getData',
  body: { id: 123 }
})
```

### Listen for Message
```typescript
const unsubscribe = onMessage<{ id: number }, { data: any }>(
  async (request, response) => {
    const result = await fetch(...)
    response.send({ data: result })
  }
)
```

### Port Communication
```typescript
const { send, listen } = usePort('worker')
send({ type: 'task' })
listen((response) => console.log(response))
```

### Broadcast
```typescript
broadcast({
  payload: { type: 'notify', message: 'hello' }
})

subscribe((message) => {
  console.log(message.payload)
})
```

---

## Request/Response Types

### Request Object
```typescript
{
  name: string                  // Message name
  body?: any                   // Payload
  tabId?: number               // Target tab (auto-filled)
  extensionId?: string         // Target extension
  sender?: MessageSender       // Sender info
  port?: chrome.runtime.Port   // Associated port
  relayId?: string             // Relay ID
  targetOrigin?: string        // For relay
}
```

### Response Object
```typescript
{
  send: (body: any) => void   // Send response
}
```

---

## Type Safe Usage

```typescript
interface MyMessage {
  request: { query: string }
  response: { results: any[] }
}

// Type-safe sending
const res = await sendToBackground<
  MyMessage['request'],
  MyMessage['response']
>({
  name: 'search',
  body: { query: 'test' }
})

// Type-safe receiving
onMessage<MyMessage['request'], MyMessage['response']>(
  async (req, res) => {
    // req.body.query is typed
    // res.send() expects MyMessage['response']
  }
)
```

---

## Common Patterns

### Request/Response
```typescript
const result = await sendToBackground<
  { action: string },
  { success: boolean }
>({
  name: 'action',
  body: { action: 'save' }
})
```

### Fire-and-Forget
```typescript
sendToBackground({
  name: 'log',
  body: { event: 'click' }
}).catch(console.error)
```

### Streaming (Port)
```typescript
const { send } = usePort('stream')
for (const chunk of data) {
  send(chunk)
}
```

### Pub-Sub (Multi-tab)
```typescript
broadcast({
  payload: { type: 'stateChange', state: newState }
})
```

---

## Common Mistakes

❌ Forget to send response
```typescript
onMessage(async (req, res) => {
  const data = await fetch()
  return data // Won't work!
})
```

✅ Use res.send()
```typescript
onMessage(async (req, res) => {
  const data = await fetch()
  res.send(data) // Correct
})
```

---

❌ Wrong import for hooks
```typescript
import { useMessage } from 'webext-message'
```

✅ Use /hook import
```typescript
import { useMessage } from 'webext-message/hook'
```

---

❌ Port name mismatch
```typescript
onPort('worker', handler)
usePort('worker-pool') // Different name
```

✅ Use same name
```typescript
onPort('worker', handler)
usePort('worker') // Same name
```

---

## Performance Tips

- Use Ports for high-frequency messages
- Batch small messages together
- Cache responses when possible
- Clear listeners to prevent leaks
- Use pub-sub for multi-tab updates

---

**Last Updated**: August 2026
