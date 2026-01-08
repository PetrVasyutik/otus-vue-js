import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '../ProductCard.vue'
import { useAppStore } from '@/stores/appStore'

describe('ProductCard', () => {
  let pinia
  
  // Создаем Pinia перед каждым тестом
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear()
    pinia = createPinia()
    setActivePinia(pinia)
    // Очищаем корзину в store после создания
    const store = useAppStore()
    store.clearCart()
    // Убеждаемся, что корзина действительно пуста
    expect(store.cartItems.length).toBe(0)
  })

  // Моковые данные товара для тестов
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    category: 'electronics',
    price: 99.99,
    image: 'https://example.com/image.jpg',
    rating: {
      rate: 4.5,
      count: 100
    }
  }

  it('должен отображать данные товара', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    // Проверяем, что название товара отображается
    expect(wrapper.text()).toContain('Test Product')
    
    // Проверяем, что цена отображается
    expect(wrapper.text()).toContain('$99.99')
    
    // Проверяем, что категория отображается
    expect(wrapper.text()).toContain('electronics')
    
    // Проверяем, что рейтинг отображается
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('100')
  })

  it('должен отображать кнопку "Добавить в корзину"', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    const button = wrapper.find('.product-card__btn')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Добавить в корзину')
  })

  it('должен вызывать addToCart при клике на кнопку', async () => {
    const store = useAppStore()
    
    // Создаем шпион для метода addToCart
    const addToCartSpy = vi.spyOn(store, 'addToCart')

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        // Настраиваем Pinia для компонента
        plugins: [pinia]
      }
    })

    // Находим кнопку и кликаем на неё
    const button = wrapper.find('.product-card__btn')
    await button.trigger('click')

    // Проверяем, что метод addToCart был вызван с правильным товаром
    expect(addToCartSpy).toHaveBeenCalledTimes(1)
    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct)
  })

  it('должен добавлять товар в корзину при клике', async () => {
    const store = useAppStore()
    // Убеждаемся, что корзина пуста
    store.clearCart()

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    // Ждем обновления компонента
    await wrapper.vm.$nextTick()

    // Проверяем, что корзина пуста
    expect(store.cartItems.length).toBe(0)

    // Кликаем на кнопку
    const button = wrapper.find('.product-card__btn')
    await button.trigger('click')

    // Проверяем, что товар добавился в корзину
    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].product.id).toBe(mockProduct.id)
  })

  it('должен отображать количество товара в корзине, если товар уже добавлен', async () => {
    const store = useAppStore()

    // Сначала добавляем товар в корзину
    store.addToCart(mockProduct)
    store.addToCart(mockProduct) // Добавляем второй раз

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    // Ждем обновления компонента
    await wrapper.vm.$nextTick()

    // Проверяем, что отображается количество
    expect(wrapper.text()).toContain('В корзине: 2')
    
    // Проверяем наличие элемента с количеством
    const quantityElement = wrapper.find('.product-card__quantity')
    expect(quantityElement.exists()).toBe(true)
    expect(quantityElement.text()).toContain('В корзине: 2')
  })

  it('не должен отображать количество, если товар не в корзине', async () => {
    const store = useAppStore()
    // Убеждаемся, что корзина пуста
    store.clearCart()

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    // Ждем обновления компонента
    await wrapper.vm.$nextTick()

    // Проверяем, что элемент с количеством не отображается
    const quantityElement = wrapper.find('.product-card__quantity')
    expect(quantityElement.exists()).toBe(false)
  })

  it('должен увеличивать количество при повторном добавлении', async () => {
    const store = useAppStore()
    // Убеждаемся, что корзина пуста
    store.clearCart()

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia]
      }
    })

    // Ждем первого рендера
    await wrapper.vm.$nextTick()

    // Первый клик
    const button = wrapper.find('.product-card__btn')
    await button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].quantity).toBe(1)

    // Второй клик
    await button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.cartItems[0].quantity).toBe(2)

    // Обновляем компонент, чтобы увидеть новое количество
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('В корзине: 2')
  })
})

