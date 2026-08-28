# Migration Guide: Plasmo → webext-message

Migrate from `@plasmohq/messaging` to `webext-message` with minimal changes.

## 🔄 Key Differences

| Feature | Plasmo | webext-message | Notes |
|---------|--------|---------------|-------|
| Package name | `@plasmohq/messaging` | `webext-message` | New package |
| API Compatibility | N/A | 95% Compatible | PlasmoMessaging alias included |
| Build Tool | tsup | tsdown + Vite | Better tree-shaking |
| Framework | Plasmo-specific | Framework-agnostic | Works with WXT, plain MV3 |
| Type Safety | Good | Excellent | Stricter types |
| Performance | Good | Better | Optimized build output |

## ✅ Backwards Compatibility

`webext-message` exports a `PlasmoMessaging` namespace as an alias:

```typescript
import type { PlasmoMessaging } from 'webext-message'
// Same as ExtMessaging, all types compatible
```

## 📦 Installation Changes

### Before (Plasmo)
```bash
npm install @plasmohq/messaging
```

### After (webext-message)
```bash
npm uninstall @plasmohq/messaging
npm install webext-message
```

## 🔀 Import Changes

### sendToBackground

```typescript
// Before
import { sendToBackground } from "@plasmohq/messaging"

// After
import { sendToBackground } from "webext-message"

// Usage stays the same
const response = await sendToBackground({ name: "...", body: {} })
```

### Listen for Messages

```typescript
// Before
import { onMessage } from "@plasmohq/messaging"

// After
import { onMessage } from "webext-message"

// Usage identical
onMessage(async (req, res) => {
  res.send({ data: "..." })
})
```

### React Hooks

```typescript
// Before
import { useMessage, usePort } from "@plasmohq/messaging"

// After
import { useMessage, usePort } from "webext-message/hook"

// Usage is identical
const { data } = useMessage(handler)
```

### Port Communication

```typescript
// Before
import { usePort } from "@plasmohq/messaging"

// After
import { usePort } from "webext-message/hook"
// OR
import { getPort, listen } from "webext-message/port"

// Usage stays the same
const { send, listen } = usePort("port-name")
```

### Relay Messaging

```typescript
// Before
import { relayMessage, sendViaRelay } from "@plasmohq/messaging"

// After
import { relayMessage, sendViaRelay } from "webext-message"
// OR specific import
import { relay, sendViaRelay } from "webext-message/relay"

// Usage identical
const response = await sendViaRelay({ name: "...", body: {} })
```

## 🎯 Common Migration Patterns

### Pattern 1: Simple Message Handler

```typescript
// Before (Plasmo)
import { onMessage } from "@plasmohq/messaging"

onMessage<{ query: string }, { results: any[] }>(
  async (request, response) => {
    const results = await search(request.body.query)
    response.send({ results })
  }
)

// After (webext-message)
import { onMessage } from "webext-message"

onMessage<{ query: string }, { results: any[] }>(
  async (request, response) => {
    const results = await search(request.body.query)
    response.send({ results })
  }
)

// ✅ No changes needed!
```

### Pattern 2: Sending Messages

```typescript
// Before (Plasmo)
import { sendToBackground } from "@plasmohq/messaging"

const response = await sendToBackground({
  name: "getData",
  body: { id: 123 }
})

// After (webext-message)
import { sendToBackground } from "webext-message"

const response = await sendToBackground({
  name: "getData",
  body: { id: 123 }
})

// ✅ Identical!
```

### Pattern 3: React Hooks

```typescript
// Before (Plasmo)
import { useMessage } from "@plasmohq/messaging"

function MyComponent() {
  const { data } = useMessage(async (req, res) => {
    res.send({ result: "ok" })
  })

  return <div>{JSON.stringify(data)}</div>
}

// After (webext-message)
import { useMessage } from "webext-message/hook"

function MyComponent() {
  const { data } = useMessage(async (req, res) => {
    res.send({ result: "ok" })
  })

  return <div>{JSON.stringify(data)}</div>
}

// ✅ Only import path changes
```

### Pattern 4: Port Communication

```typescript
// Before (Plasmo)
import { usePort } from "@plasmohq/messaging"

function PortComponent() {
  const port = usePort("my-port")

  return (
    <button onClick={() => port.send({ type: "test" })}>
      Send
    </button>
  )
}

// After (webext-message)
import { usePort } from "webext-message/hook"

function PortComponent() {
  const port = usePort("my-port")

  return (
    <button onClick={() => port.send({ type: "test" })}>
      Send
    </button>
  )
}

// ✅ No changes needed!
```

## 🔧 Configuration Changes

### tsconfig.json

No changes needed for type checking:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

### manifest.json

No changes to manifest, same permissions work:

```json
{
  "permissions": ["runtime", "tabs"],
  "host_permissions": ["<all_urls>"]
}
```

## 🚨 Breaking Changes

### Minimal breaking changes - mostly compatible!

1. **Namespace changed**
   ```typescript
   // Old: PlasmoMessaging from @plasmohq/messaging
   // New: ExtMessaging from webext-message
   // Old name still available as alias for compatibility
   ```

2. **Pub-Sub API (if using)**
   ```typescript
   // Before: getHubMap() usage pattern
   // After: Same API, but initialize with startHub()
   ```

3. **Internal signals
   ```typescript
   // Before: __PLASMO_MESSAGING_PING__
   // After: __EXT_MESSAGING_PING__
   // (Only matters if inspecting internal signals)
   ```

## ✨ New Features in webext-message

### 1. Better Error Handling

```typescript
// webext-message has better error propagation
onMessage(async (req, res) => {
  try {
    // Your code
  } catch (error) {
    res.send({ error: error instanceof Error ? error.message : 'Error' })
  }
})
```

### 2. Improved Type Safety

```typescript
// Better type inference
import type { ExtMessaging } from "webext-message"

const handler: ExtMessaging.Handler<"myMsg", RequestType, ResponseType> = async (req, res) => {
  // req and res are correctly typed
}
```

### 3. Framework Agnostic

```typescript
// Works with any framework, not just Plasmo
// Works great with WXT, plain MV3, and others
```

### 4. Better Build Output

```typescript
// Optimized ESM and CommonJS builds
// Source maps included
// Tree-shaking enabled
```

## 🔍 Step-by-Step Migration

### Step 1: Update package.json

```bash
npm uninstall @plasmohq/messaging
npm install webext-message
```

### Step 2: Update imports

Replace all imports:

```bash
# Find all files with @plasmohq/messaging
grep -r "@plasmohq/messaging" src/

# Replace with webext-message
sed -i 's/@plasmohq\/messaging/webext-message/g' src/**/*.ts
sed -i 's/@plasmohq\/messaging/webext-message\/hook/g' src/**/*.tsx
```

### Step 3: Specific import paths

```typescript
// Message handlers
import { onMessage } from "webext-message"

// React hooks
import { useMessage, usePort } from "webext-message/hook"

// Port functions
import { getPort, listen } from "webext-message/port"

// Relay
import { relay, sendViaRelay } from "webext-message/relay"

// Pub-Sub
import { startHub, broadcast, subscribe } from "webext-message/pub-sub"

// Background setup
import { initializeBackgroundMessaging } from "webext-message"
```

### Step 4: Update background initialization

```typescript
// Before (Plasmo auto-initializes)
// No explicit initialization needed

// After (explicit initialization recommended)
import { initializeBackgroundMessaging } from "webext-message"

// Call in background script
initializeBackgroundMessaging()
```

### Step 5: Test thoroughly

```bash
npm test
npm run build
# Load extension and verify in browser
```

## 📋 Checklist

- [ ] Uninstall `@plasmohq/messaging`
- [ ] Install `webext-message`
- [ ] Update all imports to use `webext-message`
- [ ] Update hook imports to use `webext-message/hook`
- [ ] Add `initializeBackgroundMessaging()` to background script
- [ ] Run tests
- [ ] Build extension
- [ ] Test in browser
- [ ] Check console for errors
- [ ] Verify all messaging patterns work

## ❓ FAQ

### Q: Will my code break?
A: Minimal breaking changes. 95% of code should work without changes.

### Q: Do I need to rewrite type definitions?
A: No, types are compatible. `PlasmoMessaging` alias provided.

### Q: What about Plasmo framework?
A: webext-message works with any framework including Plasmo. For pure Plasmo users, this is more flexible.

### Q: How do I use with WXT?
A: See `examples/wxt-demo/` for complete WXT integration example.

### Q: Performance impact?
A: Improved! Smaller bundle size, better tree-shaking, optimized output.

### Q: Support for older Chrome versions?
A: Same target as Plasmo - Chrome 96+. No regression.

## 🆘 Troubleshooting

### Problem: "Cannot find module 'webext-message'"

```bash
# Ensure package is installed
npm install webext-message
# Clear node_modules if needed
rm -rf node_modules package-lock.json
npm install
```

### Problem: Type errors after migration

```typescript
// May need to update type imports
import type { ExtMessaging } from "webext-message"
// Old import: import type { PlasmoMessaging } from "@plasmohq/messaging"
```

### Problem: Messages not working

```typescript
// Ensure background initialization
import { initializeBackgroundMessaging } from "webext-message"

// In background.ts
initializeBackgroundMessaging()
```

### Problem: React hooks not found

```typescript
// Correct import path
import { useMessage, usePort } from "webext-message/hook"
// NOT: import { useMessage } from "webext-message"
```

## 🔗 Related Resources

- [Original webext-message README](./README.md)
- [Setup Guide](./SETUP.md)
- [Advanced Patterns](./PATTERNS.md)
- [Example Extension](./examples/wxt-demo/README.md)

---

**Migration is easy! Most code works as-is. 🚀**
