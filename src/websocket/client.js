/**
 * WebSocket клиент для работы с real-time обновлениями
 */

let ws = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

/**
 * Создает WebSocket соединение
 * @param {string} url - URL WebSocket сервера
 * @param {object} callbacks - Объект с колбэками для обработки событий
 * @returns {WebSocket} WebSocket соединение
 */
export function createWebSocketConnection(url, callbacks = {}) {
  const {
    onOpen = () => {},
    onMessage = () => {},
    onError = () => {},
    onClose = () => {},
  } = callbacks

  try {
    ws = new WebSocket(url)

    ws.onopen = (event) => {
      console.log('WebSocket соединение установлено')
      reconnectAttempts = 0
      onOpen(event)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('Ошибка парсинга WebSocket сообщения:', error)
        onMessage(event.data)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket ошибка:', error)
      onError(error)
    }

    ws.onclose = (event) => {
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
 * @param {object} data - Данные для отправки
 */
export function sendWebSocketMessage(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data))
  } else {
    console.warn('WebSocket не подключен')
  }
}

/**
 * Закрывает WebSocket соединение
 */
export function closeWebSocketConnection() {
  if (ws) {
    ws.close()
    ws = null
  }
}

/**
 * Проверяет, подключен ли WebSocket
 * @returns {boolean}
 */
export function isWebSocketConnected() {
  return ws && ws.readyState === WebSocket.OPEN
}

