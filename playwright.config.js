import { defineConfig, devices } from '@playwright/test'

/**
 * Конфигурация Playwright для E2E тестов
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  // Максимальное время выполнения одного теста
  timeout: 30 * 1000,
  
  // Ожидание между тестами
  expect: {
    timeout: 5000
  },
  
  // Запускать тесты полностью параллельно
  fullyParallel: true,
  
  // Запретить запуск тестов в CI, если вы случайно оставили test.only
  forbidOnly: !!process.env.CI,
  
  // Повторные попытки только в CI
  retries: process.env.CI ? 2 : 0,
  
  // Оптимальное количество воркеров для вашей системы
  workers: process.env.CI ? 1 : undefined,
  
  // Общие настройки для всех проектов
  use: {
    // Базовый URL для тестов (должен совпадать с портом в vite.config.js)
    baseURL: 'http://localhost:8080',
    
    // Собирать трейс при повторной попытке неудачного теста
    trace: 'on-first-retry',
    
    // Скриншоты при ошибках
    screenshot: 'only-on-failure',
  },

  // Настройка проектов для разных браузеров
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Можно добавить другие браузеры при необходимости
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Запускать локальный dev сервер перед тестами
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})

