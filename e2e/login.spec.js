import { test, expect } from '@playwright/test'

/**
 * E2E тесты для проверки логина
 */
test.describe('Проверка логина', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу входа
    await page.goto('/login')
  })

  test('должен отображать форму входа', async ({ page }) => {
    // Проверяем наличие полей формы
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('должен валидировать email поле', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Пытаемся отправить форму с невалидным email
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    
    // Проверяем, что кнопка отправки заблокирована
    await expect(submitButton).toBeDisabled()
  })

  test('должен валидировать пароль поле', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Вводим валидный email
    await emailInput.fill('test@example.com')
    
    // Вводим невалидный пароль (слишком короткий)
    await passwordInput.fill('123')
    await passwordInput.blur()
    
    // Проверяем, что кнопка отправки заблокирована
    await expect(submitButton).toBeDisabled()
  })

  test('должен проверять требования к паролю', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('test@example.com')
    
    // Тестируем пароль без заглавной буквы
    await passwordInput.fill('password123')
    await passwordInput.blur()
    await expect(submitButton).toBeDisabled()
    
    // Тестируем пароль без строчной буквы
    await passwordInput.fill('PASSWORD123')
    await passwordInput.blur()
    await expect(submitButton).toBeDisabled()
    
    // Тестируем пароль без цифры
    await passwordInput.fill('Password')
    await passwordInput.blur()
    await expect(submitButton).toBeDisabled()
  })

  test('должен успешно войти с валидными данными', async ({ page }) => {
    // Мокаем успешный ответ от сервера
    await page.route('**/post', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })
    
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Вводим валидные данные
    await emailInput.fill('test@example.com')
    await passwordInput.fill('Password123')
    
    // Ждем, пока форма станет валидной
    await page.waitForTimeout(1000)
    
    // Проверяем, что кнопка не заблокирована
    const isDisabled = await submitButton.isDisabled()
    if (isDisabled) {
      // Если заблокирована, ждем еще
      await page.waitForTimeout(1000)
    }
    
    // Отправляем форму
    await submitButton.click()
    
    // Ждем перехода на страницу личного кабинета
    await page.waitForURL('**/account', { timeout: 15000 })
    
    // Проверяем, что мы на странице личного кабинета
    expect(page.url()).toContain('/account')
  })

  test('должен перенаправлять на страницу входа при попытке доступа к защищенной странице', async ({ page }) => {
    // Пытаемся перейти на защищенную страницу без авторизации
    await page.goto('/basket')
    
    // Должны быть перенаправлены на страницу входа
    await page.waitForURL('**/login**', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('должен показывать состояние загрузки при отправке формы', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('Password123')
    
    await page.waitForTimeout(500)
    
    // Отправляем форму
    await submitButton.click()
    
    // Проверяем, что кнопка показывает состояние загрузки
    await expect(submitButton).toContainText('Вход...')
  })
})

