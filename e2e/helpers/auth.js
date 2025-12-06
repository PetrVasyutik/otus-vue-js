/**
 * Вспомогательные функции для авторизации в E2E тестах
 */
export async function loginUser(page, email = 'test@example.com', password = 'Password123') {
  // Мокаем успешный ответ от API для логина (httpbin.org/post)
  await page.route('**/httpbin.org/post', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, json: { email, password } })
    })
  })
  
  // Также мокаем общий паттерн для надежности
  await page.route('**/post**', route => {
    if (route.request().url().includes('httpbin')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, json: { email, password } })
      })
    } else {
      route.continue()
    }
  })
  
  await page.goto('/login')
  
  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')
  const submitButton = page.locator('button[type="submit"]')
  
  // Вводим данные
  await emailInput.fill(email)
  await passwordInput.fill(password)
  
  // Ждем валидации и обновления формы
  await page.waitForTimeout(1500)
  
  // Проверяем, что кнопка не заблокирована
  let attempts = 0
  while (await submitButton.isDisabled() && attempts < 5) {
    await page.waitForTimeout(500)
    attempts++
  }
  
  // Отправляем форму
  await submitButton.click()
  
  // Ждем перехода на страницу личного кабинета
  await page.waitForURL('**/account', { timeout: 20000 })
}

