import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../LoginView.vue'
import { useAppStore } from '@/stores/appStore'

// Создаем моковый роутер для тестов
const createMockRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/login', name: 'Login', component: LoginView },
      { path: '/account', name: 'UserAccount', component: { template: '<div>Account</div>' } }
    ]
  })
}

describe('LoginView', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    // Очищаем localStorage
    localStorage.clear()
    // Мокаем fetch для тестов
    globalThis.fetch = vi.fn()
  })

  it('должен отображать форму входа', () => {
    const router = createMockRouter()
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Проверяем наличие полей формы
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('должен валидировать email поле', async () => {
    const router = createMockRouter()
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Пытаемся отправить форму с пустым email
    await wrapper.find('form').trigger('submit.prevent')

    // Проверяем, что кнопка отправки заблокирована (если форма невалидна)
    const submitButton = wrapper.find('button[type="submit"]')
    // Кнопка должна быть disabled, если форма невалидна
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('должен валидировать пароль поле', async () => {
    const router = createMockRouter()
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Вводим валидный email, но невалидный пароль
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')

    // Вводим невалидный пароль (слишком короткий)
    await passwordInput.setValue('123')
    await passwordInput.trigger('blur')

    // Ждем обновления компонента и валидации
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Проверяем, что кнопка отправки заблокирована
    const submitButton = wrapper.find('button[type="submit"]')
    // В Vue 3 disabled может быть свойством элемента, а не атрибутом
    expect(submitButton.element.disabled || submitButton.attributes('disabled')).toBeTruthy()
  })

  it('должен проверять требования к паролю', async () => {
    const router = createMockRouter()
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Вводим валидный email
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')

    // Тестируем разные невалидные пароли
    const invalidPasswords = [
      '12345', // слишком короткий
      'password', // нет заглавной буквы и цифры
      'PASSWORD', // нет строчной буквы и цифры
      'Password', // нет цифры
    ]

    for (const password of invalidPasswords) {
      await passwordInput.setValue(password)
      await passwordInput.trigger('blur')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const submitButton = wrapper.find('button[type="submit"]')
      // Кнопка должна быть заблокирована для невалидных паролей
      // В Vue 3 disabled может быть свойством элемента, а не атрибутом
      expect(submitButton.element.disabled || submitButton.attributes('disabled')).toBeTruthy()
    }
  })

  it('должен принимать валидный пароль', async () => {
    const router = createMockRouter()
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Вводим валидные данные
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('Password123')

    await emailInput.trigger('blur')
    await passwordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // После валидации форма должна быть готова к отправке
    const submitButton = wrapper.find('button[type="submit"]')
    // Кнопка не должна быть заблокирована для валидных данных
    expect(submitButton.element.disabled || submitButton.attributes('disabled')).toBeFalsy()
  })

  it('должен вызывать login в store при успешной отправке формы', async () => {
    const router = createMockRouter()
    const store = useAppStore()

    // Мокаем успешный ответ от сервера
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Вводим валидные данные
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('Password123')

    // Ждем валидации
    await wrapper.vm.$nextTick()

    // Отправляем форму
    await wrapper.find('form').trigger('submit.prevent')

    // Ждем выполнения асинхронных операций
    await new Promise(resolve => setTimeout(resolve, 100))

    // Проверяем, что пользователь залогинен
    expect(store.user.isAuthenticated).toBe(true)
    expect(store.user.email).toBe('test@example.com')
  })

  it('должен обрабатывать ошибки при отправке формы', async () => {
    const router = createMockRouter()

    // Мокаем ошибку от сервера
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    )

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('Password123')

    await wrapper.vm.$nextTick()

    // Отправляем форму
    await wrapper.find('form').trigger('submit.prevent')

    // Ждем выполнения асинхронных операций
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Проверяем, что отображается сообщение об ошибке
    expect(wrapper.text()).toContain('Ошибка')
  })

  it('должен показывать состояние загрузки при отправке', async () => {
    const router = createMockRouter()

    // Мокаем медленный ответ
    globalThis.fetch = vi.fn(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          })
        }, 100)
      })
    )

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('Password123')

    await wrapper.vm.$nextTick()

    // Отправляем форму
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Проверяем, что кнопка показывает состояние загрузки
    const submitButton = wrapper.find('button[type="submit"]')
    // В процессе отправки кнопка должна быть disabled
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})

