/**
 * Mock WebSocket сервер для разработки
 * Имитирует WebSocket соединение и отправляет обновления
 */

let mockWebSocket = null
let intervalId = null

// Константы WebSocket для совместимости
const WS_CONNECTING = 0
const WS_OPEN = 1
const WS_CLOSING = 2
const WS_CLOSED = 3

/**
 * Создает mock WebSocket сервер
 * Имитирует обновления каталога товаров
 */
export function setupMockWebSocketServer() {
  // Перехватываем создание WebSocket
  const OriginalWebSocket = window.WebSocket

  window.WebSocket = class MockWebSocket {
    constructor(url, protocols) {
      // Если это наш mock URL, создаем mock соединение
      if (url.includes('ws://localhost:3001') || url.includes('ws://mock')) {
        // Сохраняем URL
        this.url = url
        this.readyState = WS_CONNECTING
        this.protocol = protocols || ''
        this.onopen = null
        this.onmessage = null
        this.onerror = null
        this.onclose = null

        // Имитируем асинхронное подключение
        setTimeout(() => {
          this.readyState = WS_OPEN
          if (this.onopen) {
            this.onopen(new Event('open'))
          }
        }, 100)

        // Начинаем отправлять mock обновления
        this.startMockUpdates()
      } else {
        // Для других URL используем оригинальный WebSocket
        return new OriginalWebSocket(url, protocols)
      }
    }

    send(data) {
      // В mock режиме просто логируем отправку
      console.log('WebSocket отправка:', data)
    }

    close() {
      this.readyState = WS_CLOSING
      setTimeout(() => {
        this.readyState = WS_CLOSED
        if (this.onclose) {
          this.onclose(new CloseEvent('close'))
        }
        this.stopMockUpdates()
      }, 100)
    }

    startMockUpdates() {
      // Останавливаем предыдущие обновления, если есть
      this.stopMockUpdates()

      // Отправляем обновления каждые 10-30 секунд (случайно)
      const sendUpdate = () => {
        if (this.readyState !== WS_OPEN) return

        const updateType = Math.random()
        let message = {}

        if (updateType < 0.4) {
          // 40% - новое уведомление
          message = {
            type: 'notification',
            title: 'Новое уведомление',
            message: 'В каталоге появились новые товары!',
            timestamp: new Date().toISOString(),
          }
        } else if (updateType < 0.7) {
          // 30% - обновление цены товара
          const productId = Math.floor(Math.random() * 20) + 1
          const newPrice = (Math.random() * 100 + 10).toFixed(2)
          message = {
            type: 'price_update',
            productId,
            newPrice: parseFloat(newPrice),
            timestamp: new Date().toISOString(),
          }
        } else {
          // 30% - новый товар
          message = {
            type: 'new_product',
            message: 'В каталоге появился новый товар',
            timestamp: new Date().toISOString(),
          }
        }

        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', {
            data: JSON.stringify(message),
          }))
        }

        // Следующее обновление через случайное время
        const nextUpdate = Math.random() * 20000 + 10000 // 10-30 секунд
        intervalId = setTimeout(sendUpdate, nextUpdate)
      }

      // Первое обновление через 5 секунд
      intervalId = setTimeout(sendUpdate, 5000)
    }

    stopMockUpdates() {
      if (intervalId) {
        clearTimeout(intervalId)
        intervalId = null
      }
    }
  }
}

