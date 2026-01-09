import type { WebSocketMessage } from '@/types/websocket'

let ws: WebSocket | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

export interface WebSocketCallbacks {
  onOpen?: (event: Event) => void
  onMessage?: (data: WebSocketMessage) => void
  onError?: (error: Event) => void
  onClose?: (event: CloseEvent) => void
}

/**
 * Создает WebSocket соединение
 * @param url - URL WebSocket сервера
 * @param callbacks - Объект с колбэками для обработки событий
 * @returns WebSocket соединение
 */
export function createWebSocketConnection(
  url: string,
  callbacks: WebSocketCallbacks = {}
): WebSocket {
  const {
    onOpen = () => {},
    onMessage = () => {},
    onError = () => {},
    onClose = () => {},
  } = callbacks

  try {
    ws = new WebSocket(url)

    ws.onopen = (event: Event) => {
      console.log('WebSocket соединение установлено')
      reconnectAttempts = 0
      onOpen(event)
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as WebSocketMessage
        onMessage(data)
      } catch (error) {
        console.error('Ошибка парсинга WebSocket сообщения:', error)
        onMessage(event.data as unknown as WebSocketMessage)
      }
    }

    ws.onerror = (error: Event) => {
      console.error('WebSocket ошибка:', error)
      onError(error)
    }

    ws.onclose = (event: CloseEvent) => {
      console.log('WebSocket соединение закрыто')
      onClose(event)

      // Автоматическое переподключение
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++
        console.log(`Попытка переподключения ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`)
        setTimeout(() => {
          createWebSocketConnection(url, callbacks)
        }, RECONNECT_DELAY)
      }
    }

    return ws
  } catch (error) {
    console.error('Ошибка создания WebSocket соединения:', error)
    throw error
  }
}

/**
 * Отправляет сообщение через WebSocket
 * @param data - Данные для отправки
 */
export function sendWebSocketMessage(data: unknown): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data))
  } else {
    console.warn('WebSocket не подключен')
  }
}

/**
 * Закрывает WebSocket соединение
 */
export function closeWebSocketConnection(): void {
  if (ws) {
    ws.close()
    ws = null
  }
}

/**
 * Проверяет, подключен ли WebSocket
 * @returns true если подключен
 */
export function isWebSocketConnected(): boolean {
  return ws !== null && ws.readyState === WebSocket.OPEN
}
