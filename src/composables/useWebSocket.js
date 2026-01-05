import { ref, onUnmounted } from 'vue'
import { createWebSocketConnection, closeWebSocketConnection, sendWebSocketMessage, isWebSocketConnected } from '@/websocket/client'

/**
 * Composable для работы с WebSocket
 */
export function useWebSocket(url = 'ws://mock') {
  const connected = ref(false)
  const messages = ref([])
  const lastMessage = ref(null)

  let ws = null

  /**
   * Подключается к WebSocket серверу
   */
  const connect = (callbacks = {}) => {
    const {
      onProductUpdate = () => {},
      onPriceUpdate = () => {},
      onNotification = () => {},
      onCustomMessage = () => {},
    } = callbacks

    ws = createWebSocketConnection(url, {
      onOpen: () => {
        connected.value = true
      },
      onMessage: (data) => {
        // Сохраняем сообщение
        messages.value.push(data)
        lastMessage.value = data

        // Обрабатываем разные типы сообщений
        switch (data.type) {
          case 'price_update':
            onPriceUpdate(data)
            break
          case 'new_product':
            onProductUpdate(data)
            break
          case 'notification':
            onNotification(data)
            break
          default:
            onCustomMessage(data)
        }
      },
      onError: (error) => {
        console.error('WebSocket ошибка:', error)
        connected.value = false
      },
      onClose: () => {
        connected.value = false
      },
    })
  }

  /**
   * Отключается от WebSocket сервера
   */
  const disconnect = () => {
    if (ws) {
      closeWebSocketConnection()
      ws = null
      connected.value = false
    }
  }

  /**
   * Отправляет сообщение через WebSocket
   */
  const send = (data) => {
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

