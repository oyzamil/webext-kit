# webext-message - Complete Setup Guide

Type-safe, zero-config messaging library for WXT browser extensions built with tsdown, Vite, and TypeScript.

## 📦 Package Structure

```
webext-message/
├── src/                           # Main package source
│   ├── types.ts                  # Core type definitions
│   ├── utils.ts                  # Utility functions
│   ├── message.ts                # Message handler
│   ├── port.ts                   # Port management
│   ├── pub-sub.ts                # Pub-sub system
│   ├── relay.ts                  # Relay functionality
│   ├── background.ts             # Background setup
│   ├── hook.ts                   # React hooks
│   ├── index.ts                  # Main exports
│   ├── relay.test.ts             # Relay tests
│   ├── message.test.ts           # Message tests
│   ├── port.test.ts              # Port tests
│   ├── utils.test.ts             # Utility tests
│   └── integration.test.ts        # Integration tests
├── examples/
│   └── wxt-demo/                 # Complete WXT example
│       ├── src/
│       │   ├── background.ts     # Background script
│       │   ├── content.ts        # Content script
│       │   └── popup/            # Popup UI
│       ├── manifest.json         # Extension manifest
│       ├── wxt.config.ts         # WXT config
│       └── package.json          # Example dependencies
├── package.json                  # Main package config
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite build config
├── jest.config.mjs              # Jest test config
└── README.md                     # Package documentation
```

## 🚀 Quick Start

### Install Dependencies

```bash
# Navigate to package directory
cd webext-message

# Install with npm
npm install

# Or with pnpm
pnpm install

# Or with yarn
yarn install
```

### Development

```bash
# Watch mode with tests
npm run dev

# Just compile with tsdown
npm run dev:compile

# Just run tests
npm run dev:test
```

### Building

```bash
# Build with Vite and tsdown
npm run build

# Creates dist/ with ESM and CommonJS outputs
```

### Testing

```bash
# Run all tests once
npm test

# Watch mode
npm run dev:test

# With coverage
npm test -- --coverage
```

## 📚 API Reference

### Core Functions

#### `sendToBackground(request)`
Send message to background service worker

```typescript
const response = await sendToBackground<Request, Response>({
  name: 'my-message',
  body: { data: 'test' }
})
```

#### `sendToContentScript(request)`
Send message to content script on active tab

```typescript
const response = await sendToContentScript({
  name: 'notify-content',
  tabId: 123,
  body: { message: 'hello' }
})
```

#### `onMessage(handler)`
Listen for messages in any context

```typescript
const unsubscribe = onMessage<RequestBody, ResponseBody>(
  async (request, response) => {
    response.send({ result: 'success' })
  }
)

// Cleanup
unsubscribe()
```

### Port Communication

#### `getPort(name)`
Get or create port connection

```typescript
import { getPort } from 'webext-message/port'

const port = getPort('my-port')
port.postMessage({ type: 'ping' })
```

#### `onPort(name, handler)`
Listen on port

```typescript
import { onPort } from 'webext-message/port'

const { port, disconnect } = onPort('my-port', (message) => {
  console.log('Port message:', message)
})

disconnect()
```

### Pub-Sub System

#### `startHub()`
Initialize pub-sub hub (background only)

```typescript
import { startHub } from 'webext-message/pub-sub'

startHub()
```

#### `broadcast(message)`
Broadcast to all subscribed tabs

```typescript
import { broadcast } from 'webext-message/pub-sub'

broadcast({
  payload: { type: 'notification', data: 'hello' }
})
```

#### `subscribe(callback)`
Subscribe to broadcasts

```typescript
import { subscribe } from 'webext-message/pub-sub'

const unsubscribe = subscribe((message) => {
  console.log('Received:', message)
})

unsubscribe()
```

### React Hooks

#### `useMessage(handler)`
Listen for messages in React components

```typescript
import { useMessage } from 'webext-message/hook'

function MyComponent() {
  const { data } = useMessage(async (request, response) => {
    response.send({ result: 'ok' })
  })

  return <div>{JSON.stringify(data)}</div>
}
```

#### `usePort(name)`
Port communication in React

```typescript
import { usePort } from 'webext-message/hook'

function PortComponent() {
  const { data, send, listen } = usePort('my-port')

  const handleSend = () => send({ type: 'test' })
  const handleListen = () => listen((msg) => console.log(msg))

  return (
    <>
      <button onClick={handleSend}>Send</button>
      <button onClick={handleListen}>Listen</button>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}
```

#### `useRelay(request, handler)`
Relay communication in React

```typescript
import { useRelay } from 'webext-message/hook'

function RelayComponent() {
  const cleanup = useRelay(
    { name: 'relay-message' },
    async (request) => ({ response: 'ok' })
  )

  return <div>Relay active</div>
}
```

## 🎯 Example Extension Setup

### 1. Install Example Dependencies

```bash
cd examples/wxt-demo
npm install
```

### 2. Development

```bash
npm run dev
```

Creates `dist/` directory with extension files.

### 3. Load in Browser

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist/` directory

### 4. Using the Extension

- Click extension icon to open popup
- Use buttons to send different message types
- Check popup console for activity log
- View background console for handler logs

## 📋 Build Configuration Details

### tsdown
- Converts TypeScript to JavaScript
- Generates type declarations (.d.ts)
- Source maps for debugging
- Entry: All source files except tests
- Output: `dist/` with ESM and CommonJS

### Vite
- Library mode for proper bundling
- Handles multiple entry points
- External dependencies (React, nanoid)
- Tree-shaking for smaller bundle
- Minification for production

### Jest
- jsdom environment for DOM APIs
- ts-jest for TypeScript support
- ESM module support
- Source maps enabled
- Mock implementations for Chrome API

## 🔒 Type Safety

Full TypeScript support with generics:

```typescript
// Messages
await sendToBackground<
  { count: number },
  { success: boolean }
>({ name: 'msg', body: { count: 42 } })

// Handlers
onMessage<{ query: string }, { results: any[] }>(
  async (req, res) => {
    res.send({ results: [] })
  }
)

// Ports
const { send } = usePort<{ type: string }, { response: string }>('port-name')
```

## 🧪 Testing

### Test Structure
- `relay.test.ts` - Relay messaging tests
- `message.test.ts` - Message handler tests
- `port.test.ts` - Port communication tests
- `utils.test.ts` - Utility function tests
- `integration.test.ts` - End-to-end tests

### Running Tests
```bash
npm test                    # Single run
npm run dev:test           # Watch mode
npm test -- --coverage     # With coverage
npm test -- relay.test     # Specific file
```

### Test Utilities
- MessagePortMock - Simulates Chrome port
- Mock handlers - Jest mocks for handlers
- Message events - Simulated MessageEvents

## 📦 Publishing

### Prepare for npm
```bash
npm run build
npm version patch  # or minor, major
npm publish
```

### Package Contents
- Minified ESM and CommonJS outputs
- Type definitions (.d.ts)
- Source maps
- License and README

### Entry Points
```json
{
  ".": "dist/index.js",
  "./hook": "dist/hook.js",
  "./relay": "dist/relay.js",
  "./port": "dist/port.js",
  "./pub-sub": "dist/pub-sub.js",
  "./message": "dist/message.js",
  "./background": "dist/background.js"
}
```

## 🐛 Debugging

### Enable Debug Logging
```typescript
import { sendToBackground } from 'webext-message'

// Add debug logging
const response = await sendToBackground({
  name: 'test',
  body: { debug: true }
})
console.log('Response:', response)
```

### Check Console
- Popup console: Right-click > Inspect
- Background console: Extensions page > Details > Background page
- Content script console: Page console

### View Network
- Chrome DevTools Network tab
- Message timing in console logs
- Port lifecycle in browser DevTools

## 🚨 Common Issues

### "Extension runtime is not available"
- Ensure code runs in extension context
- Check manifest permissions
- Verify `chrome.runtime` access

### Port connection errors
- Ensure port names match
- Check manifest `externally_connectable`
- Verify port is established before send

### Message handler not firing
- Check message name matches
- Ensure handler is registered
- Verify sender has permission
- Check console for errors

### TypeScript errors
- Run `npm run build` to validate
- Check type definitions match
- Ensure generic types are provided
- Review tsconfig.json settings

## 📖 Additional Resources

- [Chrome Extension API](https://developer.chrome.com/docs/extensions/)
- [WXT Framework](https://wxt.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## 📝 License

MIT

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📬 Support

For issues and questions:
1. Check documentation
2. Review examples
3. Check test files
4. File GitHub issue
