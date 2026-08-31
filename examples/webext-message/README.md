# webext-message WXT Demo

Complete demonstration of `webext-message` messaging library integrated with WXT framework.

## Features Demonstrated

### 1. Simple Messages
- Basic request/response pattern
- Type-safe message handlers
- Error handling

### 2. Echo Messages
- Message relay and echo
- Payload transformation
- Async handlers

### 3. Data Processing
- Complex data structures
- Multiple operation types (fetch, process, save)
- Error responses

### 4. Port Communication
- Long-lived connections
- Bidirectional messaging
- Connection lifecycle

### 5. Pub-Sub Broadcasting
- Multi-tab communication
- Event distribution
- Hub management

### 6. Content Script Integration
- Content script to background messaging
- Tab information retrieval
- Relay patterns

### 7. Popup UI
- React-based UI
- useMessage hook
- usePort hook
- Real-time activity logging

## Project Structure

```
src/
├── background.ts          # Background service worker
├── content.ts            # Content script
└── popup/
    ├── index.html        # Popup HTML
    └── index.tsx         # React popup component
wxt.config.ts            # WXT configuration
tsconfig.json            # TypeScript config
package.json             # Dependencies
```

## Running the Demo

### Development

```bash
npm install
npm run dev
```

This starts WXT in watch mode. The extension will rebuild on file changes.

### Building

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

## Examples in Code

### Background Script (`src/background.ts`)
- Message handler registration
- Port management
- Pub-sub hub initialization
- Error handling

### Content Script (`src/content.ts`)
- Sending messages to background
- Relay communication
- Exposing demo functions on window
- Data processing

### Popup Component (`src/popup/index.tsx`)
- useMessage hook usage
- usePort hook usage
- React state management
- Activity logging

## API Usage Examples

### Send Message

```typescript
const response = await sendToBackground({
  name: 'echo-message',
  body: { echo: 'test' }
})
```

### Listen for Messages

```typescript
onMessage(async (request, response) => {
  response.send({ result: 'success' })
})
```

### Port Communication

```typescript
const { send, listen } = usePort('my-port')

// Send data
send({ type: 'ping' })

// Listen for responses
listen((data) => {
  console.log('Received:', data)
})
```

### Broadcast to Tabs

```typescript
broadcast({
  payload: { type: 'notification', message: 'Hello all tabs' }
})
```

## Testing in Browser

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` directory
5. Click extension icon to open popup
6. Use buttons to test different messaging patterns
7. Check console logs (Inspect popup/background)

## Key Concepts

- **Messages**: One-way or request/response pattern
- **Ports**: Long-lived bidirectional connections
- **Relay**: Message routing through background
- **Pub-Sub**: Broadcasting to multiple subscribers

## Type Safety

Full TypeScript support with generic types:

```typescript
await sendToBackground<RequestBody, ResponseBody>({...})
onMessage<RequestBody, ResponseBody>((req, res) => {...})
```

## Performance

- Minimal bundle size
- Efficient message routing
- Port pooling and caching
- Memory leak prevention

## Next Steps

- Modify handlers in `background.ts`
- Add new message types
- Expand popup UI
- Add more content scripts
- Implement custom pub-sub patterns

## Documentation

See main `webext-message` package README for complete API reference.
