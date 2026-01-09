import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/graphql/client'
import { GET_PRODUCTS, GET_PRODUCT } from '@/graphql/queries/products'
import type { Product, GetProductsResponse, GetProductResponse } from '@/types/graphql'

interface CartItem {
  product: Product
  quantity: number
}

interface User {
  isAuthenticated: boolean
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  birthDate: string
}

interface Notification {
  id: number
  type: string
  message: string
  productId?: number
  timestamp: string
}

interface FetchProductsOptions {
  limit?: number
  offset?: number
}

/**
 * Главный store приложения
 * Использует Composition API синтаксис (setup stores)
 */
export const useAppStore = defineStore('app', () => {
  // State - реактивные данные
  const products: Ref<Product[]> = ref([])
  const productsLoading: Ref<boolean> = ref(false)
  const productsError: Ref<string | null> = ref(null)

  // WebSocket состояние
  const wsConnected: Ref<boolean> = ref(false)
  const notifications: Ref<Notification[]> = ref([])

  /**
   * Загрузка списка товаров через GraphQL
   */
  const fetchProducts = async (options: FetchProductsOptions = {}): Promise<void> => {
    try {
      productsLoading.value = true
      productsError.value = null

      const { limit, offset } = options
      const variables: Record<string, unknown> = {}
      if (limit !== undefined) variables.limit = limit
      if (offset !== undefined) variables.offset = offset

      const data = await request<GetProductsResponse>(GET_PRODUCTS, variables)
      products.value = data.products || []
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Неизвестная ошибка')
      productsError.value = error.message || 'Ошибка загрузки товаров'
      console.error('Ошибка загрузки товаров:', err)
    } finally {
      productsLoading.value = false
    }
  }

  /**
   * Загрузка одного товара по ID через GraphQL
   */
  const fetchProduct = async (productId: number | string): Promise<Product> => {
    try {
      productsLoading.value = true
      productsError.value = null

      const data = await request<GetProductResponse>(GET_PRODUCT, { id: parseInt(String(productId)) })
      return data.product
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Неизвестная ошибка')
      productsError.value = error.message || 'Ошибка загрузки товара'
      console.error('Ошибка загрузки товара:', err)
      throw err
    } finally {
      productsLoading.value = false
    }
  }

  /**
   * Обновление цены товара через WebSocket
   */
  const updateProductPrice = (productId: number, newPrice: number): void => {
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

  /**
   * Добавление уведомления
   */
  const addNotification = (notification: Omit<Notification, 'id'>): void => {
    notifications.value.unshift({
      id: Date.now(),
      ...notification,
    })

    // Ограничиваем количество уведомлений (последние 10)
    if (notifications.value.length > 10) {
      notifications.value = notifications.value.slice(0, 10)
    }
  }

  /**
   * Удаление уведомления
   */
  const removeNotification = (notificationId: number): void => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Очистка всех уведомлений
   */
  const clearNotifications = (): void => {
    notifications.value = []
  }

  // Getters - вычисляемые свойства для товаров
  const productsState: ComputedRef<{ loading: boolean; error: string | null }> = computed(() => ({
    loading: productsLoading.value,
    error: productsError.value,
  }))

  // State - товары в корзине
  const cartItems: Ref<CartItem[]> = ref([])

  /**
   * Добавление товара в корзину
   */
  const addToCart = (product: Product): void => {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)

    if (existingItem) {
      // Если товар уже есть, увеличиваем количество
      existingItem.quantity += 1
    } else {
      // Если товара нет, добавляем новый
      cartItems.value.push({
        product,
        quantity: 1,
      })
    }

    // Сохраняем корзину в localStorage
    saveCartToStorage()
  }

  /**
   * Удаление товара из корзины
   */
  const removeFromCart = (productId: number): void => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  /**
   * Очистка корзины
   */
  const clearCart = (): void => {
    cartItems.value = []
    saveCartToStorage()
  }

  // Getters - вычисляемые свойства для корзины
  const totalItems: ComputedRef<number> = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice: ComputedRef<number> = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  /**
   * Функция сохранения корзины в localStorage
   */
  const saveCartToStorage = (): void => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (err) {
      console.error('Ошибка сохранения корзины:', err)
    }
  }

  /**
   * Функция загрузки корзины из localStorage
   */
  const loadCartFromStorage = (): void => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart) as CartItem[]
      }
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err)
    }
  }

  // State - данные пользователя
  const user: Ref<User> = ref({
    isAuthenticated: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
  })

  /**
   * Вход пользователя
   */
  const login = (userData: Partial<User> = {}): void => {
    user.value = {
      ...user.value,
      ...userData,
      isAuthenticated: true,
    }

    // Сохраняем данные пользователя в localStorage
    saveUserToStorage()
  }

  /**
   * Выход пользователя
   */
  const logout = (): void => {
    user.value = {
      isAuthenticated: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
    }

    // Очищаем данные из localStorage
    localStorage.removeItem('user')
  }

  // Getters - вычисляемые свойства для пользователя
  const fullName: ComputedRef<string> = computed(() => {
    if (user.value.firstName && user.value.lastName) {
      return `${user.value.firstName} ${user.value.lastName}`
    }
    return ''
  })

  /**
   * Функция сохранения данных пользователя в localStorage
   */
  const saveUserToStorage = (): void => {
    try {
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      console.error('Ошибка сохранения данных пользователя:', err)
    }
  }

  /**
   * Функция загрузки данных пользователя из localStorage
   */
  const loadUserFromStorage = (): void => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User
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
    fullName,
  }
})
