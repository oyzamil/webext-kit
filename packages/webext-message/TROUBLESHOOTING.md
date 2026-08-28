# Troubleshooting Guide - webext-message

Solutions for common issues and problems.

## 📋 General Issues

### "Cannot find module 'webext-message'"

**Problem:** Import error when using webext-message

**Solutions:**

1. Verify installation:
```bash
npm list webext-message
npm install webext-message
```

2. Clear cache:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Check import path:
```typescript
// ✅ Correct
import { sendToBackground } from 'webext-message'
import { useMessage } from 'webext-message/hook'

// ❌ Wrong
import { sendToBackground } from 'webext-message/src/index'
```

### Module Resolution Issues

**Problem:** TypeScript can't find types

**Solutions:**

1. Update tsconfig.json:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

2. Clear TypeScript cache:
```bash
rm -rf dist .tsbuildinfo
npx tsc --noEmit
```

3. Reinstall:
```bash
npm ci
```

---

## 🔧 Message Handling Issues

### Messages Not Being Received

**Problem:** Handler not firing, messages disappearing

**Checklist:**

1. Handler registered in background:
```typescript
import { onMessage } from 'webext-message'

onMessage(async (request, response) => {
  console.log('Message received:', request.name)
  response.send({ success: true })
})
```

2. Background script loaded:
   - Check manifest.json has `"service_worker": "..."`
   - Verify background script path is correct
   - Check Extensions page → Details → Service Workers

3. Message name matches:
```typescript
// Background
onMessage<{ data: string }>(async (req, res) => {
  if (req.name === 'my-message') { // Exact match required
    res.send({ ok: true })
  }
})

// Content Script
await sendToBackground({
  name: 'my-message', // Must match exactly
  body: { data: 'test' }
})
```

4. Types are correct:
```typescript
// ✅ Good - specify types
onMessage<{ query: string }, { results: any[] }>(
  async (req, res) => {
    const { query } = req.body || {}
    res.send({ results: [] })
  }
)

// ⚠️ Be careful - missing default
onMessage<{ query: string }, { results: any[] }>(
  async (req, res) => {
    // req.body could be undefined
    const { query } = req.body || {} // Add default
  }
)
```

5. Check manifest permissions:
```json
{
  "permissions": ["runtime"],
  "host_permissions": ["<all_urls>"]
}
```

### Timeout When Sending Messages

**Problem:** sendToBackground hangs or times out

**Solutions:**

1. Verify background script is initialized:
```typescript
// background.ts
import { initializeBackgroundMessaging } from 'webext-message'

initializeBackgroundMessaging()
```

2. Add timeout handling:
```typescript
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
)

const response = await Promise.race([
  sendToBackground({ name: 'msg', body: {} }),
  timeout
])
```

3. Check for infinite loops:
```typescript
// ❌ Bad - causes timeout
onMessage(async (req, res) => {
  const response = await sendToBackground({ name: 'msg' })
  res.send(response) // Circular!
})
```

### Response Not Being Sent

**Problem:** res.send() not working, response undefined

**Solutions:**

1. Must call res.send():
```typescript
// ✅ Good
onMessage(async (req, res) => {
  const data = await fetchData()
  res.send(data) // Required
})

// ❌ Wrong - forgot send()
onMessage(async (req, res) => {
  const data = await fetchData()
  return data // This won't send!
})
```

2. Only send once:
```typescript
// ❌ Wrong - sending twice
onMessage(async (req, res) => {
  res.send({ a: 1 })
  res.send({ b: 2 }) // Error - already sent
})

// ✅ Good - send once
onMessage(async (req, res) => {
  res.send({ a: 1, b: 2 })
})
```

3. Return true for async:
```typescript
// Handler should return true to keep port open
const removeListener = onMessage(async (req, res) => {
  await delay(1000)
  res.send({ ok: true })
})
```

---

## 🔌 Port Communication Issues

### Port Connection Errors

**Problem:** Port fails to connect or disconnect immediately

**Solutions:**

1. Port name must match:
```typescript
// Background - listen on port
onPort('worker', (message) => {
  console.log('Port message:', message)
})

// Content Script - connect with same name
const { send } = usePort('worker') // Must match
send({ type: 'test' })
```

2. Verify manifest connectivity:
```json
{
  "externally_connectable": {
    "matches": ["<all_urls>"]
  }
}
```

3. Add reconnection logic:
```typescript
const { send, listen } = usePort('port-name')

// Handle disconnects
listen((message) => {
  console.log('Connected')
})
```

### Port Messages Lost

**Problem:** Messages sent but not received on port

**Solutions:**

1. Listen before sending:
```typescript
// ✅ Good - listen first
const { listen, send } = usePort('test')
listen((msg) => console.log(msg))
send({ type: 'ping' }) // Listener ready

// ❌ Bad - send before listen
const { send } = usePort('test')
send({ type: 'ping' }) // Listener might not be ready
```

2. Verify port stays open:
```typescript
// Port closes if no listeners
listen((msg) => {
  console.log('Message:', msg)
  // Keep listener active
})
```

3. Check console for errors:
   - Popup console: Right-click extension icon → Inspect popup
   - Background: Extensions page → Details → Service Workers
   - Content script: Page DevTools console

---

## 🔄 Relay Issues

### Relay Timeouts

**Problem:** sendViaRelay throws timeout error

**Solutions:**

1. Default timeout is 30s:
```typescript
try {
  const response = await sendViaRelay({
    name: 'relay-msg',
    body: { query: 'test' }
  })
} catch (error) {
  console.error('Relay timeout:', error)
}
```

2. Ensure relay handler is set up:
```typescript
import { relay } from 'webext-message/relay'

relay(
  { name: 'relay-msg' },
  async (request) => {
    return { result: await process(request.body) }
  }
)
```

3. Handler must match message name:
```typescript
// Setup relay for "relay-msg"
relay({ name: 'relay-msg' }, handler)

// Send relay message with same name
await sendViaRelay({ name: 'relay-msg', body: {} })
```

### Relay Not Receiving

**Problem:** Relay handler never fires

**Solutions:**

1. Must be in content script:
   - Relay works for window.postMessage
   - Only works in page context or content script
   - Won't work in background (use normal messages)

2. Setup in right context:
```typescript
// ✅ Content script or page script
relay({ name: 'msg' }, handler)

// ✅ Content script sends
const response = await sendViaRelay({ name: 'msg' })
```

3. Check targetOrigin:
```typescript
// Must match page origin
await sendViaRelay({
  name: 'msg',
  body: {},
  targetOrigin: 'https://example.com' // If needed
})
```

---

## 📡 Pub-Sub Issues

### Broadcast Not Received

**Problem:** Subscribers don't get broadcasts

**Solutions:**

1. Hub must be initialized in background:
```typescript
import { startHub } from 'webext-message/pub-sub'

startHub() // Required before broadcast
```

2. Subscribe before broadcast:
```typescript
import { subscribe } from 'webext-message/pub-sub'

const unsubscribe = subscribe((message) => {
  console.log('Broadcast:', message)
})
```

3. Manifest needs externally_connectable:
```json
{
  "externally_connectable": {
    "matches": ["<all_urls>"]
  }
}
```

---

## 🎯 React Hook Issues

### useMessage Not Called

**Problem:** Handler in useMessage never runs

**Solutions:**

1. Handler must listen for messages:
```typescript
// ✅ Hook sets up listener
const { data } = useMessage(async (req, res) => {
  console.log('Message received')
  res.send({ ok: true })
})

// ❌ Hook alone doesn't listen
useMessage(async (req, res) => { /* ... */ })
// Need to send message from elsewhere
```

2. Component must render to install:
```typescript
function MyComponent() {
  // ✅ Hook runs when component mounts
  const { data } = useMessage(handler)

  return <div>{data?.message}</div>
}

// Must render component for hook to run
export default MyComponent
```

### usePort Hook Issues

**Problem:** usePort not connecting to port

**Solutions:**

1. Port name required:
```typescript
// ❌ Wrong - no name
const { send } = usePort(undefined)

// ✅ Correct
const { send } = usePort('port-name')
```

2. Component must remain mounted:
```typescript
function Component() {
  // Hook sets up on mount, cleans up on unmount
  const { send } = usePort('port')

  // If component unmounts, port disconnects
  return <button onClick={() => send({ type: 'ping' })}>Send</button>
}
```

3. Check console for connection:
```typescript
const { send, listen } = usePort('port')

listen((msg) => {
  console.log('Port connected, received:', msg)
})
```

---

## 🐛 Debugging Tips

### Enable Debug Mode

```typescript
import { getDebugger } from 'webext-message/debug'

const debugger = getDebugger()
debugger.enable()

// View events
debugger.printEvents()
debugger.printStats()

// Access from console
window.__extMessagingDebugger.printEvents()
```

### Add Logging

```typescript
onMessage(async (request, response) => {
  console.log('[Background] Received:', request.name, request.body)

  try {
    const result = await handleRequest(request)
    console.log('[Background] Sending response:', result)
    response.send(result)
  } catch (error) {
    console.error('[Background] Error:', error)
    response.send({ error: error.message })
  }
})
```

### Check Extension Status

1. Go to `chrome://extensions/`
2. Find extension and click Details
3. Check:
   - Extension is enabled
   - Service Worker shows "Service worker running"
   - No errors in console

### Use DevTools

**Popup DevTools:**
- Right-click extension icon
- Click "Inspect popup"
- Check Console tab

**Background DevTools:**
- Extensions page → Details
- Click "Service worker" link
- Opens DevTools for background

**Content Script DevTools:**
- Open page DevTools (F12)
- Console shows content script logs

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Extension runtime not available" | Not in extension context | Check manifest, ensure code runs in extension |
| "No active tab found" | No active tab when sending | Ensure tab is active or provide tabId |
| "Port disconnected" | Port closed | Reconnect to port |
| "Timeout" | Message took >30s | Increase timeout or optimize handler |
| "Origin not allowed" | Cross-origin message | Check externally_connectable |

---

## 🆘 Still Stuck?

1. Check examples in `examples/wxt-demo/`
2. Review test files for patterns
3. Read SETUP.md for API reference
4. Check PATTERNS.md for advanced usage
5. Enable debug mode and check logs
6. File GitHub issue with reproduction

---

**Last Updated**: August 2026
