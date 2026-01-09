import { ref, onUnmounted, type Ref } from 'vue'
import {
  createWebSocketConnection,
  closeWebSocketConnection,
  sendWebSocketMessage,
  isWebSocketConnected,
  type WebSocketCallbacks,
} from '@/websocket/client'
import type { WebSocketMessage, PriceUpdateMessage, NewProductMessage, NotificationMessage } from '@/types/websocket'

export interface UseWebSocketCallbacks {
  onProductUpdate?: (data: NewProductMessage) => void
  onPriceUpdate?: (data: PriceUpdateMessage) => void
  onNotification?: (data: NotificationMessage) => void
  onCustomMessage?: (data: WebSocketMessage) => void
}

/**
 * Composable для работы с WebSocket
 * Минимальная реализация для real-time обновлений
 */
export function useWebSocket(url = 'ws://mock') {
  const connected: Ref<boolean> = ref(false)
  const messages: Ref<WebSocketMessage[]> = ref([])
  const lastMessage: Ref<WebSocketMessage | null> = ref(null)

  let ws: WebSocket | null = null

  /**
   * Подключается к WebSocket серверу
   */
  const connect = (callbacks: UseWebSocketCallbacks = {}) => {
    const {
      onProductUpdate = () => {},
      onPriceUpdate = () => {},
      onNotification = () => {},
      onCustomMessage = () => {},
    } = callbacks

    const wsCallbacks: WebSocketCallbacks = {
      onOpen: () => {
        connected.value = true
      },
      onMessage: (data: WebSocketMessage) => {
        // Сохраняем сообщение
        messages.value.push(data)
        lastMessage.value = data

        // Обрабатываем разные типы сообщений
        switch (data.type) {
          case 'price_update':
            onPriceUpdate(data as PriceUpdateMessage)
            break
          case 'new_product':
            onProductUpdate(data as NewProductMessage)
            break
          case 'notification':
            onNotification(data as NotificationMessage)
            break
          default:
            onCustomMessage(data)
        }
      },
      onError: (error: Event) => {
        console.error('WebSocket ошибка:', error)
        connected.value = false
      },
      onClose: () => {
        connected.value = false
      },
    }

    ws = createWebSocketConnection(url, wsCallbacks)
  }

  /**
   * Отключается от WebSocket сервера
   */
  const disconnect = (): void => {
    if (ws) {
      closeWebSocketConnection()
      ws = null
      connected.value = false
    }
  }

  /**
   * Отправляет сообщение через WebSocket
   */
  const send = (data: unknown): void => {
    sendWebSocketMessage(data)
  }

  // Автоматически отключаемся при размонтировании компонента
  onUnmounted(() => {
    disconnect()
  })

  return {
    connected,
    messages,
    lastMessage,
    connect,
    disconnect,
    send,
    isConnected: isWebSocketConnected,
  }
}
