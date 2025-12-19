import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '../appStore'

describe('appStore', () => {
  beforeEach(() => {
    // Создаем новый экземпляр Pinia для каждого теста
    setActivePinia(createPinia())
    // Очищаем localStorage
    localStorage.clear()
  })

  describe('Корзина - addToCart', () => {
    it('должен добавлять товар в корзину', () => {
      const store = useAppStore()
      const product = {
        id: 1,
        title: 'Test Product',
        price: 10.99
      }

      store.addToCart(product)

      expect(store.cartItems.length).toBe(1)
      expect(store.cartItems[0].product).toEqual(product)
      expect(store.cartItems[0].quantity).toBe(1)
    })

    it('должен увеличивать количество при повторном добавлении того же товара', () => {
      const store = useAppStore()
      const product = {
        id: 1,
        title: 'Test Product',
        price: 10.99
      }

      store.addToCart(product)
      store.addToCart(product)
      store.addToCart(product)

      expect(store.cartItems.length).toBe(1)
      expect(store.cartItems[0].quantity).toBe(3)
    })

    it('должен добавлять разные товары как отдельные позиции', () => {
      const store = useAppStore()
      const product1 = { id: 1, title: 'Product 1', price: 10.99 }
      const product2 = { id: 2, title: 'Product 2', price: 20.99 }

      store.addToCart(product1)
      store.addToCart(product2)

      expect(store.cartItems.length).toBe(2)
      expect(store.cartItems[0].product.id).toBe(1)
      expect(store.cartItems[1].product.id).toBe(2)
    })

    it('должен сохранять корзину в localStorage', () => {
      const store = useAppStore()
      const product = { id: 1, title: 'Test Product', price: 10.99 }

      store.addToCart(product)

      const savedCart = JSON.parse(localStorage.getItem('cart'))
      expect(savedCart).toBeTruthy()
      expect(savedCart.length).toBe(1)
    })
  })

  describe('Корзина - removeFromCart', () => {
    it('должен удалять товар из корзины', () => {
      const store = useAppStore()
      const product = { id: 1, title: 'Test Product', price: 10.99 }

      store.addToCart(product)
      expect(store.cartItems.length).toBe(1)

      store.removeFromCart(1)
      expect(store.cartItems.length).toBe(0)
    })

    it('не должен удалять товар, если его нет в корзине', () => {
      const store = useAppStore()
      const product = { id: 1, title: 'Test Product', price: 10.99 }

      store.addToCart(product)
      store.removeFromCart(999)

      expect(store.cartItems.length).toBe(1)
    })
  })

  describe('Корзина - clearCart', () => {
    it('должен очищать корзину', () => {
      const store = useAppStore()
      const product1 = { id: 1, title: 'Product 1', price: 10.99 }
      const product2 = { id: 2, title: 'Product 2', price: 20.99 }

      store.addToCart(product1)
      store.addToCart(product2)
      expect(store.cartItems.length).toBe(2)

      store.clearCart()
      expect(store.cartItems.length).toBe(0)
    })
  })

  describe('Корзина - totalItems', () => {
    it('должен возвращать общее количество товаров в корзине', () => {
      const store = useAppStore()
      const product1 = { id: 1, title: 'Product 1', price: 10.99 }
      const product2 = { id: 2, title: 'Product 2', price: 20.99 }

      store.addToCart(product1)
      store.addToCart(product1) // 2 штуки первого товара
      store.addToCart(product2) // 1 штука второго товара

      expect(store.totalItems).toBe(3)
    })

    it('должен возвращать 0 для пустой корзины', () => {
      const store = useAppStore()
      expect(store.totalItems).toBe(0)
    })
  })

  describe('Корзина - totalPrice', () => {
    it('должен правильно рассчитывать общую сумму корзины', () => {
      const store = useAppStore()
      const product1 = { id: 1, title: 'Product 1', price: 10.50 }
      const product2 = { id: 2, title: 'Product 2', price: 20.75 }

      store.addToCart(product1)
      store.addToCart(product1) // 2 штуки по 10.50 = 21.00
      store.addToCart(product2) // 1 штука по 20.75 = 20.75

      expect(store.totalPrice).toBeCloseTo(41.75, 2)
    })

    it('должен обновлять сумму при изменении количества товара', () => {
      const store = useAppStore()
      const product = { id: 1, title: 'Product', price: 15.00 }

      store.addToCart(product)
      expect(store.totalPrice).toBe(15.00)

      store.addToCart(product)
      expect(store.totalPrice).toBe(30.00)

      store.addToCart(product)
      expect(store.totalPrice).toBe(45.00)
    })

    it('должен возвращать 0 для пустой корзины', () => {
      const store = useAppStore()
      expect(store.totalPrice).toBe(0)
    })

    it('должен правильно рассчитывать сумму с дробными ценами', () => {
      const store = useAppStore()
      const product = { id: 1, title: 'Product', price: 9.99 }

      store.addToCart(product)
      store.addToCart(product)
      store.addToCart(product)

      expect(store.totalPrice).toBeCloseTo(29.97, 2)
    })
  })

  describe('Пользователь - login', () => {
    it('должен устанавливать пользователя как авторизованного', () => {
      const store = useAppStore()
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }

      store.login(userData)

      expect(store.user.isAuthenticated).toBe(true)
      expect(store.user.email).toBe('test@example.com')
      expect(store.user.firstName).toBe('John')
      expect(store.user.lastName).toBe('Doe')
    })

    it('должен сохранять данные пользователя в localStorage', () => {
      const store = useAppStore()
      const userData = { email: 'test@example.com' }

      store.login(userData)

      const savedUser = JSON.parse(localStorage.getItem('user'))
      expect(savedUser.isAuthenticated).toBe(true)
      expect(savedUser.email).toBe('test@example.com')
    })

    it('должен обновлять fullName при наличии firstName и lastName', () => {
      const store = useAppStore()
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }

      store.login(userData)

      expect(store.fullName).toBe('John Doe')
    })

    it('должен возвращать пустую строку для fullName, если нет имени', () => {
      const store = useAppStore()
      const userData = { email: 'test@example.com' }

      store.login(userData)

      expect(store.fullName).toBe('')
    })
  })

  describe('Пользователь - logout', () => {
    it('должен разлогинивать пользователя', () => {
      const store = useAppStore()
      store.login({ email: 'test@example.com' })
      expect(store.user.isAuthenticated).toBe(true)

      store.logout()

      expect(store.user.isAuthenticated).toBe(false)
      expect(store.user.email).toBe('')
    })

    it('должен удалять данные пользователя из localStorage', () => {
      const store = useAppStore()
      store.login({ email: 'test@example.com' })
      expect(localStorage.getItem('user')).toBeTruthy()

      store.logout()

      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Товары - fetchProducts', () => {
    it('должен загружать товары успешно', async () => {
      const store = useAppStore()

      // Мокаем fetch
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, title: 'Product 1', price: 10.99 },
            { id: 2, title: 'Product 2', price: 20.99 }
          ])
        })
      )

      await store.fetchProducts()

      expect(store.products.length).toBe(2)
      expect(store.productsLoading).toBe(false)
      expect(store.productsError).toBeNull()
    })

    it('должен устанавливать состояние загрузки', async () => {
      const store = useAppStore()

      globalThis.fetch = vi.fn(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        })
      })

      const promise = store.fetchProducts()
      expect(store.productsLoading).toBe(true)

      await promise
      expect(store.productsLoading).toBe(false)
    })

    it('должен обрабатывать ошибки загрузки', async () => {
      const store = useAppStore()

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      )

      await store.fetchProducts()

      expect(store.productsError).toBe('Ошибка HTTP: 404')
      expect(store.productsLoading).toBe(false)
    })

    it('должен обрабатывать сетевые ошибки', async () => {
      const store = useAppStore()

      globalThis.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      await store.fetchProducts()

      expect(store.productsError).toBe('Network error')
      expect(store.productsLoading).toBe(false)
    })

    it('должен использовать кастомный URL', async () => {
      const store = useAppStore()
      const customUrl = 'https://custom-api.com/products'

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        })
      )

      await store.fetchProducts(customUrl)

      expect(globalThis.fetch).toHaveBeenCalledWith(customUrl)
    })
  })
})

