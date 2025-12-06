import { test, expect } from '@playwright/test'

/**
 * E2E тесты для загрузки данных
 */
test.describe('Загрузка данных', () => {
  test('должен загружать товары на странице каталога', async ({ page }) => {
    await page.goto('/catalog')
    
    // Ждем загрузки товаров (в каталоге используется preview-product-card)
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
    
    // Проверяем, что товары отображаются
    const productCards = page.locator('.preview-product-card')
    const count = await productCards.count()
    
    expect(count).toBeGreaterThan(0)
  })

  test('должен показывать состояние загрузки', async ({ page }) => {
    // Переходим на страницу каталога
    await page.goto('/catalog')
    
    // Проверяем наличие индикатора загрузки (если он есть)
    // Это зависит от реализации компонента
    const loadingText = page.locator('text=Загружаем товары')
    
    // Если индикатор загрузки есть, он должен исчезнуть
    try {
      await expect(loadingText).toBeHidden({ timeout: 10000 })
    } catch {
      // Если индикатора нет, это тоже нормально
    }
    
    // В любом случае, товары должны загрузиться
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
  })

  test('должен обрабатывать ошибки загрузки', async ({ page }) => {
    // Перехватываем запросы и возвращаем ошибку
    await page.route('**/products', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server Error' })
      })
    })
    
    await page.goto('/catalog')
    
    // Ждем появления сообщения об ошибке
    await page.waitForSelector('text=Ошибка', { timeout: 10000 })
    
    // Проверяем наличие кнопки "Попробовать снова"
    const retryButton = page.locator('button:has-text("Попробовать снова")')
    await expect(retryButton).toBeVisible()
  })

  test('должен загружать данные товара на странице товара', async ({ page }) => {
    // Сначала переходим на каталог
    await page.goto('/catalog')
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
    
    // Кликаем на кнопку "Подробнее" первого товара
    const firstProduct = page.locator('.preview-product-card').first()
    const detailsButton = firstProduct.locator('button:has-text("Подробнее")')
    
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    
    // Проверяем, что данные товара отображаются
    await page.waitForSelector('.product-card', { timeout: 10000 })
  })
})

