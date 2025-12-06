import { test, expect } from '@playwright/test'
import { loginUser } from './helpers/auth.js'

/**
 * E2E тесты для добавления товара в корзину
 */
test.describe('Добавление в корзину', () => {
  test.beforeEach(async ({ page }) => {
    // Авторизуемся перед тестами, так как корзина требует авторизации
    await loginUser(page)
    
    // Переходим на страницу каталога перед каждым тестом
    await page.goto('/catalog')
    
    // Ждем загрузки товаров (используем preview-product-card, так как в каталоге используется PreviewProductCard)
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
  })

  test('должен добавить товар в корзину при клике на кнопку', async ({ page }) => {
    // Находим первую карточку товара в каталоге
    const firstProductCard = page.locator('.preview-product-card').first()
    
    // Кликаем на кнопку "Подробнее" чтобы перейти на страницу товара
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // На странице товара находим кнопку "Добавить в корзину"
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    await addButton.click()
    
    // Проверяем, что товар добавился в корзину
    // Ищем бейдж с количеством товаров в хедере
    const cartBadge = page.locator('.user-nav__badge')
    await expect(cartBadge).toBeVisible()
    await expect(cartBadge).toHaveText('1')
  })

  test('должен увеличивать количество при повторном добавлении', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    
    // Добавляем товар первый раз
    await addButton.click()
    
    // Ждем обновления бейджа в хедере
    await page.waitForTimeout(1000)
    const cartBadge = page.locator('.user-nav__badge')
    await expect(cartBadge).toBeVisible({ timeout: 5000 })
    await expect(cartBadge).toHaveText('1', { timeout: 5000 })
    
    // Добавляем товар второй раз
    await addButton.click()
    
    // Ждем обновления
    await page.waitForTimeout(1000)
    
    // Проверяем, что количество увеличилось в бейдже
    await expect(cartBadge).toHaveText('2', { timeout: 5000 })
    
    // Проверяем, что в карточке товара отображается количество
    const productCard = page.locator('.product-card')
    // Ждем появления элемента с количеством
    await page.waitForSelector('.product-card__quantity', { timeout: 5000 })
    await expect(productCard.locator('.product-card__quantity')).toBeVisible()
    await expect(productCard.locator('.product-card__quantity')).toContainText('В корзине: 2')
  })

  test('должен добавить несколько разных товаров', async ({ page }) => {
    const productCards = page.locator('.preview-product-card')
    const count = await productCards.count()
    
    // Добавляем первые 3 товара, переходя на страницу каждого
    for (let i = 0; i < Math.min(3, count); i++) {
      const productCard = productCards.nth(i)
      const detailsButton = productCard.locator('button:has-text("Подробнее")')
      await detailsButton.click()
      
      // Ждем загрузки страницы товара
      await page.waitForURL('**/product/**', { timeout: 5000 })
      await page.waitForSelector('.product-card', { timeout: 10000 })
      
      // Добавляем в корзину
      const addButton = page.locator('button:has-text("Добавить в корзину")')
      await addButton.click()
      await page.waitForTimeout(300)
      
      // Возвращаемся в каталог
      await page.goto('/catalog')
      await page.waitForSelector('.preview-product-card', { timeout: 10000 })
    }
    
    // Проверяем общее количество товаров в корзине
    const cartBadge = page.locator('.user-nav__badge')
    await expect(cartBadge).toHaveText('3')
  })

  test('должен сохранять корзину после перезагрузки страницы', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    
    // Добавляем товар
    await addButton.click()
    
    // Ждем обновления бейджа перед перезагрузкой
    await page.waitForTimeout(1000)
    const cartBadgeBefore = page.locator('.user-nav__badge')
    await expect(cartBadgeBefore).toBeVisible({ timeout: 5000 })
    await expect(cartBadgeBefore).toHaveText('1', { timeout: 5000 })
    
    // Проверяем, что данные сохранены в localStorage
    const cartInStorage = await page.evaluate(() => {
      return localStorage.getItem('cart')
    })
    expect(cartInStorage).toBeTruthy()
    const cartData = JSON.parse(cartInStorage)
    expect(cartData.length).toBeGreaterThan(0)
    
    // Перезагружаем страницу
    await page.reload()
    
    // Ждем загрузки страницы и восстановления состояния из localStorage
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // Ждем, пока приложение восстановит состояние из localStorage
    await page.waitForFunction(() => {
      const cart = localStorage.getItem('cart')
      if (!cart) return false
      const data = JSON.parse(cart)
      return data.length > 0
    }, { timeout: 5000 })
    
    // Ждем обновления UI
    await page.waitForTimeout(2000)
    
    // Проверяем, что товар все еще в корзине
    const cartBadge = page.locator('.user-nav__badge')
    await expect(cartBadge).toBeVisible({ timeout: 10000 })
    await expect(cartBadge).toHaveText('1', { timeout: 10000 })
  })
})

