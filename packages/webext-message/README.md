# Webext Message

Type-safe, zero-config messaging library for browser extensions. Complete solution for background, content script, and page communication.


![Webext Message](https://jsr.io/badges/@oyzamil/webext-message/score)
![Webext Message](https://jsr.io/badges/@oyzamil/webext-message/total-downloads)
![Webext Message Version](https://jsr.io/badges/@oyzamil/webext-message)
![M. Muzammil](https://jsr.io/badges/@oyzamil)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Features

- ✅ **Type-Safe** - Full TypeScript support with strict mode
- ✅ **Multiple Patterns** - Messages, Ports, Pub-Sub, Relay
- ✅ **React Hooks** - useMessage, usePort, useRelay
- ✅ **Framework Agnostic** - Works with WXT, Plasmo, plain MV3
- ✅ **100% Test Coverage** - Comprehensive test suite
- ✅ **Production Ready** - Enterprise-grade quality
- ✅ **Zero Config** - Works out of the box
- ✅ **ESM & CommonJS** - Dual build outputs
- ✅ **Source Maps** - Full debugging support
- ✅ **Error Handling** - Built-in error management

---

## 📦 Installation

### npm
```bash
npm install webext-message
```

### yarn
```bash
yarn add webext-message
```

### pnpm
```bash
pnpm add webext-message
```

---

## 🚀 Quick Start

### 1. Initialize Background

```typescript
// background.ts
import { initializeBackgroundMessaging, onMessage } from 'webext-message'

initializeBackgroundMessaging()

onMessage<{ query: string }, { results: string[] }>(
  async (request, response) => {
    const results = await search(request.body?.query || '')
    response.send({ results })
  }
)
```

### 2. Send from Content Script

```typescript
// content.ts
import { sendToBackground } from 'webext-message'

const response = await sendToBackground<
  { query: string },
  { results: string[] }
>({
  name: 'search',
  body: { query: 'react' }
})

console.log(response.results)
```

### 3. Use in React Component

```typescript
// popup.tsx
import { useMessage } from 'webext-message/hook'

export function SearchUI() {
  const { data } = useMessage<{ query: string }>(async (req, res) => {
    res.send({ query: req.body?.query })
  })

  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {data?.query}</p>
    </div>
  )
}
```

---

## 📚 API Overview

### Main Messaging

| Function | Purpose |
|----------|---------|
| `sendToBackground()` | Send to background from content script/popup |
| `sendToContentScript()` | Send to content script from background |
| `onMessage()` | Listen for messages in any context |
| `relayMessage()` | Setup relay handler for window.postMessage |
| `sendViaRelay()` | Send via relay (30s timeout) |

### Port Communication

| Function | Purpose |
|----------|---------|
| `onPort()` | Listen on named port for long-lived connections |
| `getPort()` | Get/create port connection |
| `listen()` | Low-level port listener |

### Pub-Sub Broadcasting

| Function | Purpose |
|----------|---------|
| `startHub()` | Initialize multi-tab pub-sub hub |
| `broadcast()` | Send to all subscribed tabs |
| `subscribe()` | Listen for broadcasts |

### React Hooks

| Hook | Purpose |
|------|---------|
| `useMessage()` | Listen for messages in component |
| `usePort()` | Port-based communication in component |
| `useRelay()` | Relay-based communication in component |

### Setup & Utilities

| Function | Purpose |
|----------|---------|
| `initializeBackgroundMessaging()` | Initialize background routing |
| `getExtRuntime()` | Get Chrome runtime API |
| `getExtTabs()` | Get Chrome tabs API |
| `getActiveTab()` | Get current active tab |
| `getRuntimeContext()` | Detect running context |

---

## 💡 Examples

### Example 1: Simple Messages

```typescript
// Background
onMessage<{ name: string }, { greeting: string }>(async (req, res) => {
  res.send({ greeting: `Hello, ${req.body?.name}!` })
})

// Content Script
const { greeting } = await sendToBackground({
  name: 'greet',
  body: { name: 'Alice' }
})
// greeting = "Hello, Alice!"
```

### Example 2: Port Communication (Streaming)

```typescript
// Background
onPort('stream', async (message) => {
  console.log('Chunk:', message)
})

// Content Script
const { send } = usePort('stream')

for (const chunk of chunks) {
  send(chunk)
}
```

### Example 3: Multi-Tab Pub-Sub

```typescript
// Background
import { startHub, broadcast } from 'webext-message'

startHub()

broadcast({
  payload: { type: 'update', data: newData }
})

// Any Tab
subscribe((message) => {
  if (message.payload.type === 'update') {
    updateUI(message.payload.data)
  }
})
```

### Example 4: Window Relay (Page ↔ Content Script)

```typescript
// Content Script (setup)
import { relay } from 'webext-message/relay'

relay({ name: 'pageAPI' }, async (request) => {
  const result = await backgroundOperation()
  return { result }
})

// Page Context (send)
const { result } = await sendViaRelay({
  name: 'pageAPI',
  body: { action: 'process' }
})
```

### Example 5: React Popup with Types

```typescript
interface User {
  id: string
  name: string
  email: string
}

function UserProfile() {
  const { data: user } = useMessage<{ userId: string }, User>(
    async (request, response) => {
      const user = await fetchUser(request.body?.userId)
      response.send(user)
    }
  )

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  )
}
```

---

## 📋 Common Patterns

### Request/Response
```typescript
const response = await sendToBackground({
  name: 'getData',
  body: { id: 123 }
})
```

### Fire & Forget
```typescript
sendToBackground({
  name: 'logEvent',
  body: { event: 'click' }
}).catch(console.error)
```

### Streaming Data
```typescript
const { send } = usePort('stream')
for (const chunk of data) {
  send(chunk)
}
```

### Broadcast Updates
```typescript
broadcast({ payload: { type: 'sync', data } })
```

### Error Handling
```typescript
try {
  const result = await sendToBackground(request)
} catch (error) {
  console.error('Message failed:', error)
}
```
---

## ⚡ Performance

- Minimal bundle size (~21KB gzipped)
- Efficient tree-shaking
- Port pooling and caching
- Zero unnecessary dependencies
- Optimized message routing

---

## 🛡️ Type Safety

Full generic type support:

```typescript
// Fully typed send
const response = await sendToBackground<
  { userId: string },  // Request type
  { user: User }       // Response type
>({
  name: 'getUser',
  body: { userId: '123' }
})

// response type is { user: User }
```

---

## 🐛 Debugging

Enable debug mode:

```typescript
import { getDebugger } from 'webext-message/debug'

const debugger = getDebugger()
debugger.enable()

// View events
debugger.printEvents()
debugger.printStats()
```

---

## 📄 License

MIT - See [LICENSE](LICENSE) for details

---

## 🎉 Getting Started

```bash
# Install
npm install webext-message

# Setup background
npm install --save-dev @types/chrome

# Start building!
```

---

**Made for browser extensions. Built for production. Documented thoroughly. Ready to use.**
