import { nanoid } from 'nanoid'
import type { ExtMessaging } from './types'
import { isSameOrigin } from './utils'

/**
 * Raw relay abstracting window.postMessage
 */
export const relay: ExtMessaging.RelayFx = (req, onMessage, messagePort = globalThis.window) => {
  const relayHandler = async (evt: Event) => {
    const event = evt as MessageEvent<ExtMessaging.RelayMessage>

    if (isSameOrigin(event, req) && !event.data.relayed) {
      const relayPayload = {
        name: req.name,
        relayId: req.relayId,
        body: event.data.body,
      }

      const backgroundResponse = await onMessage?.(relayPayload)

      messagePort.postMessage(
        {
          name: req.name,
          relayId: req.relayId,
          instanceId: event.data.instanceId,
          body: backgroundResponse,
          relayed: true,
        },
        {
          targetOrigin: req.targetOrigin || '/',
        }
      )
    }
  }

  messagePort.addEventListener('message', relayHandler)
  return () => messagePort.removeEventListener('message', relayHandler)
}

export const sendViaRelay: ExtMessaging.SendFx = (req, messagePort = globalThis.window) =>
  new Promise((resolve, reject) => {
    const instanceId = nanoid()

    const handler = (evt: Event) => {
      const event = evt as MessageEvent<ExtMessaging.RelayMessage>

      if (isSameOrigin(event, req) && event.data.relayed && event.data.instanceId === instanceId) {
        messagePort.removeEventListener('message', handler)
        resolve(event.data.body)
      }
    }

    messagePort.addEventListener('message', handler)

    messagePort.postMessage(
      {
        name: req.name,
        body: req.body,
        relayId: req.relayId,
        instanceId,
        targetOrigin: req.targetOrigin || '/',
      },
      {
        targetOrigin: req.targetOrigin || '/',
      }
    )

    // Add timeout for relay
    setTimeout(() => {
      messagePort.removeEventListener('message', handler)
      reject(new Error(`Relay timeout for message: ${req.name}`))
    }, 30000)
  })
