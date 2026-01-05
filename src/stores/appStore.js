import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/graphql/client'
import { GET_PRODUCTS, GET_PRODUCT } from '@/graphql/queries/products'

/**
 * Главный store приложения
 * Использует Composition API синтаксис (setup stores)
 */
export const useAppStore = defineStore('app', () => {

  // State - реактивные данные
  const products = ref([]) // массив товаров
  const productsLoading = ref(false) // состояние загрузки
  const productsError = ref(null) // ошибка загрузки

  // WebSocket состояние
  const wsConnected = ref(false) // статус WebSocket соединения
  const notifications = ref([]) // массив уведомлений

  // Actions - методы для работы с товарами
  // GraphQL версия загрузки товаров
  const fetchProducts = async (options = {}) => {
    try {
      productsLoading.value = true
      productsError.value = null

      const { limit, offset } = options
      const variables = {}
      if (limit !== undefined) variables.limit = limit
      if (offset !== undefined) variables.offset = offset

      const data = await request(GET_PRODUCTS, variables)
      products.value = data.products || []
    } catch (err) {
      productsError.value = err.message || 'Ошибка загрузки товаров'
      console.error('Ошибка загрузки товаров:', err)
    } finally {
      productsLoading.value = false
    }
  }

  // Загрузка одного товара по ID через GraphQL
  const fetchProduct = async (productId) => {
    try {
      productsLoading.value = true
      productsError.value = null

      const data = await request(GET_PRODUCT, { id: parseInt(productId) })
      return data.product
    } catch (err) {
      productsError.value = err.message || 'Ошибка загрузки товара'
      console.error('Ошибка загрузки товара:', err)
      throw err
    } finally {
      productsLoading.value = false
    }
  }

  // Обновление цены товара через WebSocket
  const updateProductPrice = (productId, newPrice) => {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      const oldPrice = product.price
      product.price = newPrice

      // Добавляем уведомление об изменении цены
      addNotification({
        type: 'price_update',
        message: `Цена товара "${product.title}" изменилась: $${oldPrice} → $${newPrice}`,
        productId,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Добавление уведомления
  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      ...notification,
    })

    // Ограничиваем количество уведомлений (последние 10)
    if (notifications.value.length > 10) {
      notifications.value = notifications.value.slice(0, 10)
    }
  }

  // Удаление уведомления
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Очистка всех уведомлений
  const clearNotifications = () => {
    notifications.value = []
  }

  // Getters - вычисляемые свойства для товаров
  // productsState для обратной совместимости со старым composable
  const productsState = computed(() => ({
    loading: productsLoading.value,
    error: productsError.value
  }))

  // State - товары в корзине
  const cartItems = ref([]) // массив объектов { product, quantity }

  // Actions - методы для работы с корзиной
  const addToCart = (product) => {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)

    if (existingItem) {
      // Если товар уже есть, увеличиваем количество
      existingItem.quantity += 1
    } else {
      // Если товара нет, добавляем новый
      cartItems.value.push({
        product,
        quantity: 1
      })
    }

    // Сохраняем корзину в localStorage
    saveCartToStorage()
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCartToStorage()
  }

  // Getters - вычисляемые свойства для корзины
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  // Функция сохранения корзины в localStorage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (err) {
      console.error('Ошибка сохранения корзины:', err)
    }
  }

  // Функция загрузки корзины из localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart)
      }
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err)
    }
  }

  // State - данные пользователя
  const user = ref({
    isAuthenticated: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: ''
  })

  // Actions - методы для работы с пользователем
  const login = (userData = {}) => {

    user.value = {
      ...user.value,
      ...userData,
      isAuthenticated: true
    }

    // Сохраняем данные пользователя в localStorage
    saveUserToStorage()
  }

  const logout = () => {
    user.value = {
      isAuthenticated: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      birthDate: ''
    }

    // Очищаем данные из localStorage
    localStorage.removeItem('user')
  }

  // Getters - вычисляемые свойства для пользователя
  const fullName = computed(() => {
    if (user.value.firstName && user.value.lastName) {
      return `${user.value.firstName} ${user.value.lastName}`
    }
    return ''
  })

  // Функция сохранения данных пользователя в localStorage
  const saveUserToStorage = () => {
    try {
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      console.error('Ошибка сохранения данных пользователя:', err)
    }
  }

  // Функция загрузки данных пользователя из localStorage
  const loadUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        user.value = parsedUser
      }
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err)
    }
  }

  // Инициализация: загружаем данные из localStorage при создании store
  loadCartFromStorage()
  loadUserFromStorage()

  return {
    // Products
    products,
    productsLoading,
    productsError,
    productsState,
    fetchProducts,
    fetchProduct,
    updateProductPrice,

    // WebSocket
    wsConnected,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,

    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,

    // User
    user,
    login,
    logout,
    fullName
  }
})

