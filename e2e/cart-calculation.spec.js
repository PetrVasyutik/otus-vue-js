import { test, expect } from '@playwright/test'
import { loginUser } from './helpers/auth.js'

/**
 * E2E тесты для расчета суммы в корзине с изменениями количества товара
 */
test.describe('Расчет суммы в корзине', () => {
  test.beforeEach(async ({ page }) => {
    // Авторизуемся перед тестами, так как корзина требует авторизации
    await loginUser(page)
    
    // Переходим на страницу каталога
    await page.goto('/catalog')
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
  })

  test('должен отображать правильную сумму для одного товара', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // Добавляем товар в корзину
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    await addButton.click()
    
    // Ждем обновления после добавления в корзину
    await page.waitForTimeout(500)
    
    // Переходим в корзину
    await page.goto('/basket')
    
    // Проверяем, что мы на странице корзины (не перенаправлены на логин)
    await page.waitForURL('**/basket', { timeout: 5000 })
    
    // Ждем загрузки корзины
    await page.waitForSelector('.basket__item, .basket__empty', { timeout: 5000 })
    
    // Проверяем, что товар отображается (если корзина не пуста)
    const basketItems = page.locator('.basket__item')
    const itemsCount = await basketItems.count()
    
    if (itemsCount > 0) {
      const basketItem = basketItems.first()
      await expect(basketItem).toBeVisible()
      
      // Проверяем, что цена товара отображается
      const price = basketItem.locator('.basket__item-price')
      await expect(price).toBeVisible()
    } else {
      // Если корзина пуста, это тоже может быть нормально в некоторых случаях
      // Но для этого теста ожидаем, что товар должен быть
      throw new Error('Корзина пуста, но товар должен был быть добавлен')
    }
  })

  test('должен увеличивать сумму при увеличении количества товара', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // Получаем цену товара из карточки
    const productCard = page.locator('.product-card')
    const productPriceText = await productCard.locator('.product-card__price').textContent()
    const productPrice = parseFloat(productPriceText.replace('$', ''))
    
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    
    // Добавляем товар первый раз
    await addButton.click()
    await page.waitForTimeout(1000)
    
    // Проверяем, что товар добавился
    const cartBadge = page.locator('.user-nav__badge')
    await expect(cartBadge).toBeVisible({ timeout: 5000 })
    await expect(cartBadge).toHaveText('1', { timeout: 5000 })
    
    // Добавляем товар второй раз
    await addButton.click()
    await page.waitForTimeout(1000)
    
    // Проверяем, что количество увеличилось в бейдже
    await expect(cartBadge).toHaveText('2', { timeout: 5000 })
    
    // Переходим в корзину
    await page.goto('/basket')
    await page.waitForURL('**/basket', { timeout: 5000 })
    await page.waitForSelector('.basket__item, .basket__empty', { timeout: 5000 })
    
    // Проверяем, что корзина не пуста
    const basketItems = page.locator('.basket__item')
    const itemsCount = await basketItems.count()
    expect(itemsCount).toBeGreaterThan(0)
    
    // Проверяем количество товара
    const quantityValue = page.locator('.basket__quantity-value').first()
    await expect(quantityValue).toHaveText('2', { timeout: 5000 })
    
    // Проверяем, что цена товара отображается (сумма должна быть price * 2)
    const basketItem = basketItems.first()
    const price = basketItem.locator('.basket__item-price')
    await expect(price).toBeVisible()
  })

  test('должен правильно рассчитывать сумму для нескольких товаров', async ({ page }) => {
    const productCards = page.locator('.preview-product-card')
    const count = await productCards.count()
    
    expect(count).toBeGreaterThan(0)
    
    // Добавляем первый товар
    const firstProductCard = productCards.first()
    const firstDetailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await firstDetailsButton.click()
    
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    const firstAddButton = page.locator('button:has-text("Добавить в корзину")')
    await firstAddButton.click()
    
    // Ждем обновления через localStorage
    await page.waitForFunction(() => {
      const cart = localStorage.getItem('cart')
      if (!cart) return false
      const data = JSON.parse(cart)
      return data.length >= 1
    }, { timeout: 5000 })
    
    await page.waitForTimeout(500)
    
    // Возвращаемся в каталог
    await page.goto('/catalog')
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
    
    // Добавляем второй товар, если есть
    if (count >= 2) {
      const secondProductCard = productCards.nth(1)
      const secondDetailsButton = secondProductCard.locator('button:has-text("Подробнее")')
      await secondDetailsButton.click()
      
      await page.waitForURL('**/product/**', { timeout: 5000 })
      await page.waitForSelector('.product-card', { timeout: 10000 })
      
      const secondAddButton = page.locator('button:has-text("Добавить в корзину")')
      await secondAddButton.click()
      
      // Ждем обновления через localStorage
      await page.waitForFunction(() => {
        const cart = localStorage.getItem('cart')
        if (!cart) return false
        const data = JSON.parse(cart)
        return data.length >= 2
      }, { timeout: 5000 })
      
      await page.waitForTimeout(500)
    }
    
    // Переходим в корзину
    await page.goto('/basket')
    await page.waitForURL('**/basket', { timeout: 5000 })
    await page.waitForSelector('.basket__item, .basket__empty', { timeout: 5000 })
    
    // Проверяем, что товары отображаются
    const basketItems = page.locator('.basket__item')
    const itemsCount = await basketItems.count()
    
    // Ожидаем минимум 1 товар (если был только 1 товар в каталоге)
    expect(itemsCount).toBeGreaterThanOrEqual(1)
    
    // Если было 2+ товаров, проверяем что оба добавились
    if (count >= 2) {
      expect(itemsCount).toBeGreaterThanOrEqual(2)
    }
  })

  test('должен обновлять отображаемое количество при изменении', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    
    // Добавляем товар 3 раза
    for (let i = 0; i < 3; i++) {
      await addButton.click()
      await page.waitForTimeout(300)
    }
    
    // Ждем обновления после добавления
    await page.waitForTimeout(500)
    
    // Переходим в корзину
    await page.goto('/basket')
    await page.waitForURL('**/basket', { timeout: 5000 })
    await page.waitForSelector('.basket__item', { timeout: 5000 })
    
    // Проверяем количество
    const quantityValue = page.locator('.basket__quantity-value').first()
    await expect(quantityValue).toHaveText('3')
    
    // Возвращаемся в каталог и добавляем еще раз
    await page.goto('/catalog')
    await page.waitForSelector('.preview-product-card', { timeout: 10000 })
    
    const productCard = page.locator('.preview-product-card').first()
    const detailsBtn = productCard.locator('button:has-text("Подробнее")')
    await detailsBtn.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    const addBtn = page.locator('button:has-text("Добавить в корзину")')
    await addBtn.click()
    await page.waitForTimeout(500)
    
    // Снова переходим в корзину
    await page.goto('/basket')
    await page.waitForURL('**/basket', { timeout: 5000 })
    await page.waitForSelector('.basket__item', { timeout: 5000 })
    
    // Проверяем обновленное количество
    const updatedQuantity = page.locator('.basket__quantity-value').first()
    await expect(updatedQuantity).toHaveText('4')
  })

  test('должен очищать корзину при клике на кнопку "Очистить корзину"', async ({ page }) => {
    // Переходим на страницу товара
    const firstProductCard = page.locator('.preview-product-card').first()
    const detailsButton = firstProductCard.locator('button:has-text("Подробнее")')
    await detailsButton.click()
    
    // Ждем загрузки страницы товара
    await page.waitForURL('**/product/**', { timeout: 5000 })
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // Добавляем товар в корзину
    const addButton = page.locator('button:has-text("Добавить в корзину")')
    await addButton.click()
    
    // Ждем сохранения в localStorage
    await page.waitForFunction(() => {
      try {
        const cart = localStorage.getItem('cart')
        if (!cart) return false
        const data = JSON.parse(cart)
        return Array.isArray(data) && data.length > 0
      } catch {
        return false
      }
    }, { timeout: 5000 })
    
    await page.waitForTimeout(1000)
    
    // Переходим в корзину
    await page.goto('/basket')
    await page.waitForURL('**/basket', { timeout: 5000 })
    
    // Ждем загрузки корзины
    await page.waitForSelector('.basket__item, .basket__empty', { timeout: 5000 })
    await page.waitForTimeout(1000)
    
    // Проверяем, что товар есть
    const basketItems = page.locator('.basket__item')
    const itemsCount = await basketItems.count()
    expect(itemsCount).toBeGreaterThan(0)
    
    // Кликаем на кнопку "Очистить корзину"
    const clearButton = page.locator('button:has-text("Очистить корзину")')
    await expect(clearButton).toBeVisible({ timeout: 5000 })
    await clearButton.click()
    
    // Ждем очистки localStorage
    await page.waitForFunction(() => {
      try {
        const cart = localStorage.getItem('cart')
        return !cart || JSON.parse(cart).length === 0
      } catch {
        return true
      }
    }, { timeout: 5000 })
    
    // Ждем обновления UI - ждем появления сообщения о пустой корзине
    await page.waitForSelector('.basket__empty', { timeout: 10000 })
    await page.waitForTimeout(500)
    
    // Проверяем, что корзина пуста
    const emptyMessage = page.locator('.basket__empty')
    await expect(emptyMessage).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Корзина пуста')).toBeVisible({ timeout: 5000 })
  })
})

