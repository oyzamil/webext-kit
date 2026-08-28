import type { ExtMessaging } from './types'

type ExtensionGlobals = typeof globalThis & {
  browser?: {
    runtime: typeof chrome.runtime
    tabs: typeof chrome.tabs
  }
  chrome?: typeof chrome
}

const extGlobal = globalThis as ExtensionGlobals

export const getExtRuntime = () => {
  const extRuntime = extGlobal.browser?.runtime ?? extGlobal.chrome?.runtime

  if (!extRuntime) {
    throw new Error('Extension runtime is not available')
  }
  return extRuntime
}

export const getExtTabs = () => {
  const extTabs = extGlobal.browser?.tabs ?? extGlobal.chrome?.tabs

  if (!extTabs) {
    throw new Error('Extension tabs API is not available')
  }
  return extTabs
}

export const getActiveTab = async () => {
  const tabs = getExtTabs()
  const [tab] = await tabs.query({
    active: true,
    currentWindow: true,
  })
  return tab as chrome.tabs.Tab | undefined
}

export const isSameOrigin = (event: MessageEvent, req: any): req is ExtMessaging.Request =>
  !req.__internal &&
  event.source === globalThis.window &&
  event.data.name === req.name &&
  (req.relayId === undefined || event.data.relayId === req.relayId)

export const getRuntimeContext = (): string | undefined => {
  // Detect context by checking available APIs
  if (typeof globalThis.chrome !== 'undefined' && globalThis.chrome.runtime) {
    if (globalThis.chrome.tabs) {
      return 'background'
    }
    if (globalThis.chrome.scripting) {
      return 'background'
    }
  }

  if (typeof window !== 'undefined') {
    if (window === window.parent) {
      return 'content-script'
    }
    return 'window'
  }

  return undefined
}
