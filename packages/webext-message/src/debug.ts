/**
 * Debug utilities for webext-message
 * Use in development only, remove from production
 */

declare global {
  var __extMessagingDebug: MessageDebugger | undefined
}

interface DebugEvent {
  timestamp: number
  type: 'send' | 'receive' | 'port-connect' | 'port-disconnect' | 'error'
  name: string
  data?: any
  error?: string
  tabId?: number
}

export class MessageDebugger {
  private events: DebugEvent[] = []
  private maxEvents = 500
  private enabled = false

  enable() {
    this.enabled = true
    console.log('[webext-message] Debug enabled')
  }

  disable() {
    this.enabled = false
    console.log('[webext-message] Debug disabled')
  }

  logSend(name: string, body: any, tabId?: number) {
    if (!this.enabled) return

    this.addEvent({
      timestamp: Date.now(),
      type: 'send',
      name,
      data: body,
      tabId,
    })
  }

  logReceive(name: string, body: any, tabId?: number) {
    if (!this.enabled) return

    this.addEvent({
      timestamp: Date.now(),
      type: 'receive',
      name,
      data: body,
      tabId,
    })
  }

  logPortConnect(name: string) {
    if (!this.enabled) return

    this.addEvent({
      timestamp: Date.now(),
      type: 'port-connect',
      name,
    })
  }

  logPortDisconnect(name: string) {
    if (!this.enabled) return

    this.addEvent({
      timestamp: Date.now(),
      type: 'port-disconnect',
      name,
    })
  }

  logError(name: string, error: Error) {
    if (!this.enabled) return

    this.addEvent({
      timestamp: Date.now(),
      type: 'error',
      name,
      error: error.message,
    })
  }

  private addEvent(event: DebugEvent) {
    this.events.push(event)

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    console.debug('[webext-message]', event)
  }

  getEvents(): DebugEvent[] {
    return this.events
  }

  getStats() {
    const stats: Record<string, any> = {
      total: this.events.length,
      byType: {},
      byName: {},
    }

    for (const event of this.events) {
      // By type
      if (!stats.byType[event.type]) {
        stats.byType[event.type] = 0
      }
      stats.byType[event.type]++

      // By name
      if (!stats.byName[event.name]) {
        stats.byName[event.name] = { send: 0, receive: 0, errors: 0 }
      }
      if (event.type === 'send') stats.byName[event.name].send++
      if (event.type === 'receive') stats.byName[event.name].receive++
      if (event.type === 'error') stats.byName[event.name].errors++
    }

    return stats
  }

  clear() {
    this.events = []
    console.log('[webext-message] Debug events cleared')
  }

  printStats() {
    console.table(this.getStats())
  }

  printEvents() {
    console.table(this.getEvents())
  }
}

// Export singleton
export function getDebugger(): MessageDebugger {
  if (!globalThis.__extMessagingDebug) {
    globalThis.__extMessagingDebug = new MessageDebugger()
  }
  return globalThis.__extMessagingDebug
}

// Enable on window for console access
if (typeof window !== 'undefined') {
  ;(window as any).__extMessagingDebugger = getDebugger()
}
