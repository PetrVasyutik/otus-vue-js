import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import BasketView from '../BasketView.vue'
import { useAppStore } from '@/stores/appStore'

// Создаем моковый роутер для тестов
const createMockRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/basket', name: 'Basket', component: BasketView }
    ]
  })
}

describe('BasketView', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  it('должен отображать сообщение о пустой корзине', () => {
    const router = createMockRouter()
    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    expect(wrapper.text()).toContain('Корзина пуста')
    expect(wrapper.find('.basket__empty').exists()).toBe(true)
  })

  it('должен отображать товары в корзине', () => {
    const router = createMockRouter()
    const store = useAppStore()

    // Добавляем товары в корзину
    const product1 = {
      id: 1,
      title: 'Product 1',
      price: 10.99,
      image: 'https://example.com/image1.jpg'
    }
    const product2 = {
      id: 2,
      title: 'Product 2',
      price: 20.50,
      image: 'https://example.com/image2.jpg'
    }

    store.addToCart(product1)
    store.addToCart(product2)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Проверяем, что товары отображаются
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
    expect(wrapper.text()).toContain('$10.99')
    // JavaScript может отображать 20.50 как 20.5, проверяем оба варианта
    expect(wrapper.text()).toMatch(/\$20\.5/)

    // Проверяем наличие элементов товаров
    const items = wrapper.findAll('.basket__item')
    expect(items.length).toBe(2)
  })

  it('должен отображать количество каждого товара', () => {
    const router = createMockRouter()
    const store = useAppStore()

    const product = {
      id: 1,
      title: 'Product',
      price: 15.99,
      image: 'https://example.com/image.jpg'
    }

    // Добавляем товар несколько раз
    store.addToCart(product)
    store.addToCart(product)
    store.addToCart(product)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Проверяем, что количество отображается
    expect(wrapper.text()).toContain('Количество:')
    const quantityValue = wrapper.find('.basket__quantity-value')
    expect(quantityValue.exists()).toBe(true)
    expect(quantityValue.text()).toBe('3')
  })

  it('должен очищать корзину при клике на кнопку "Очистить корзину"', async () => {
    const router = createMockRouter()
    const store = useAppStore()

    const product = {
      id: 1,
      title: 'Product',
      price: 10.99,
      image: 'https://example.com/image.jpg'
    }

    store.addToCart(product)
    expect(store.cartItems.length).toBe(1)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Находим и кликаем на кнопку очистки
    const clearButton = wrapper.find('.basket__clear-btn')
    await clearButton.trigger('click')

    // Проверяем, что корзина очищена
    expect(store.cartItems.length).toBe(0)

    // Ждем обновления компонента
    await wrapper.vm.$nextTick()

    // Проверяем, что отображается сообщение о пустой корзине
    expect(wrapper.text()).toContain('Корзина пуста')
  })

  it('должен правильно рассчитывать сумму при изменении количества товара', () => {
    const store = useAppStore()

    const product1 = {
      id: 1,
      title: 'Product 1',
      price: 10.00,
      image: 'https://example.com/image1.jpg'
    }
    const product2 = {
      id: 2,
      title: 'Product 2',
      price: 20.00,
      image: 'https://example.com/image2.jpg'
    }

    // Добавляем первый товар
    store.addToCart(product1)
    expect(store.totalPrice).toBe(10.00)

    // Добавляем второй товар
    store.addToCart(product2)
    expect(store.totalPrice).toBe(30.00) // 10 + 20

    // Увеличиваем количество первого товара
    store.addToCart(product1)
    expect(store.totalPrice).toBe(40.00) // 20 + 20

    // Увеличиваем количество второго товара
    store.addToCart(product2)
    store.addToCart(product2)
    expect(store.totalPrice).toBe(80.00) // 20 + 60
  })

  it('должен обновлять отображаемое количество при изменении в store', async () => {
    const router = createMockRouter()
    // Используем глобальный экземпляр Pinia из beforeEach
    const store = useAppStore()

    const product = {
      id: 1,
      title: 'Product',
      price: 15.99,
      image: 'https://example.com/image.jpg'
    }

    store.addToCart(product)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Ждем первого рендера
    await wrapper.vm.$nextTick()

    // Проверяем начальное количество
    let quantityValue = wrapper.find('.basket__quantity-value')
    expect(quantityValue.text()).toBe('1')

    // Увеличиваем количество через store
    store.addToCart(product)
    store.addToCart(product)

    // Ждем обновления компонента (может потребоваться несколько тиков)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Проверяем обновленное количество
    quantityValue = wrapper.find('.basket__quantity-value')
    expect(quantityValue.text()).toBe('3')
  })

  it('должен правильно рассчитывать сумму для нескольких товаров с разным количеством', () => {
    const store = useAppStore()

    const product1 = {
      id: 1,
      title: 'Product 1',
      price: 9.99,
      image: 'https://example.com/image1.jpg'
    }
    const product2 = {
      id: 2,
      title: 'Product 2',
      price: 19.99,
      image: 'https://example.com/image2.jpg'
    }

    // Добавляем первый товар 3 раза
    store.addToCart(product1)
    store.addToCart(product1)
    store.addToCart(product1)
    // 3 * 9.99 = 29.97

    // Добавляем второй товар 2 раза
    store.addToCart(product2)
    store.addToCart(product2)
    // 2 * 19.99 = 39.98

    // Общая сумма: 29.97 + 39.98 = 69.95
    expect(store.totalPrice).toBeCloseTo(69.95, 2)
  })

  it('должен отображать кнопку "Оформить заказ" когда корзина не пуста', () => {
    const router = createMockRouter()
    const store = useAppStore()

    const product = {
      id: 1,
      title: 'Product',
      price: 10.99,
      image: 'https://example.com/image.jpg'
    }

    store.addToCart(product)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const orderButton = wrapper.find('.basket__order-btn')
    expect(orderButton.exists()).toBe(true)
    expect(orderButton.text()).toBe('Оформить заказ')
  })

  it('не должен отображать кнопку "Оформить заказ" когда корзина пуста', () => {
    const router = createMockRouter()
    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const orderButton = wrapper.find('.basket__order-btn')
    expect(orderButton.exists()).toBe(false)
  })

  it('должен вызывать handleLogout при клике на кнопку "Выйти"', async () => {
    const router = createMockRouter()
    // Используем глобальный экземпляр Pinia из beforeEach
    const store = useAppStore()
    store.login({ email: 'test@example.com' })
    expect(store.user.isAuthenticated).toBe(true)

    const wrapper = mount(BasketView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const logoutButton = wrapper.find('.basket__logout-btn')
    await logoutButton.trigger('click')

    // Ждем выполнения асинхронных операций
    await wrapper.vm.$nextTick()

    // Проверяем, что пользователь разлогинен
    expect(store.user.isAuthenticated).toBe(false)
  })
})

