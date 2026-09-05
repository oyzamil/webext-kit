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
- Sends a message to the content script (relayed through the background)

### 8. Options Page
- Opened programmatically via `browser.runtime.openOptionsPage()`
- Fetches/receives a message that originated in the content script

### 9. Cross-Context Relay Patterns
- Popup → background → content script (`relay-to-content`)
- Content script → background → options page + popup (`open-and-notify`),
  which also opens those pages using `browser.runtime.openOptionsPage()`
  and (best-effort) `browser.action.openPopup()`
- A floating button panel injected into the page (Shadow DOM) triggers both
  content-script-initiated flows

## Project Structure

```
src/
├── background.ts          # Background service worker
├── content.ts            # Content script (also injects a demo button panel)
├── popup/
│   ├── index.html        # Popup HTML
│   └── index.tsx         # React popup component
└── options/
    ├── index.html        # Options page HTML
    └── index.tsx         # React options page component
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
6. Use buttons to test different messaging patterns, including "📨 Send to
   Content Script" (open a matching page first, e.g. `example.com`)
7. Visit a page matching the content script's `matches` pattern
   (`*://*.example.com/*`) to see the injected button panel in the
   bottom-right corner; use "📤 Send to Background" and
   "🔔 Notify Options + Popup"
8. Check console logs (Inspect popup/background/content script)

## Opening Extension Pages Programmatically

Content scripts and the background can't message an options page or popup
that isn't open yet — there's nothing listening on the other end. To reach
them, open the page first with the real WebExtension APIs, then let the page
pull (or push) the message once it mounts:

```typescript
// Correct — there is no browser.openOptionsPage() or browser.openAction()
await browser.runtime.openOptionsPage();
await browser.action.openPopup(); // MV3; browser support varies, so wrap in try/catch
```

Both of these must be called from a privileged context (background or an
existing extension page) — not from a content script directly. See the
`open-and-notify` handler in `background.ts` for the full pattern.

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
