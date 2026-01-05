// Кеш для товаров
let productsCache = null

/**
 * Загружает товары с fakestoreapi.com
 */
async function fetchProductsFromAPI() {
  if (productsCache) {
    return productsCache
  }

  try {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    productsCache = await response.json()
    return productsCache
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
    throw error
  }
}

/**
 * Парсит GraphQL запрос и извлекает имя операции и переменные
 */
function parseGraphQLQuery(query, variables = {}) {

  const operationMatch = query.match(/(query|mutation)\s+(\w+)/)
  const operationName = operationMatch ? operationMatch[2] : null

  return {
    operationName,
    variables,
  }
}

/**
 * Обрабатывает GraphQL запрос
 */
async function handleGraphQLRequest(query, variables = {}) {
  const { operationName, variables: parsedVars } = parseGraphQLQuery(query, variables)
  const allProducts = await fetchProductsFromAPI()

  // Обработка разных операций
  switch (operationName) {
    case 'GetProducts': {
      const limit = parsedVars.limit || allProducts.length
      const offset = parsedVars.offset || 0
      const products = allProducts.slice(offset, offset + limit)
      return { products }
    }

    case 'GetProduct': {
      const product = allProducts.find(p => p.id === parsedVars.id)
      if (!product) {
        throw new Error(`Товар с ID ${parsedVars.id} не найден`)
      }
      return { product }
    }

    case 'GetProductsByCategory': {
      const products = allProducts.filter(p =>
        p.category.toLowerCase() === parsedVars.category.toLowerCase()
      )
      return { productsByCategory: products }
    }

    case 'GetCategories': {
      const categories = [...new Set(allProducts.map(p => p.category))].sort()
      return { categories }
    }

    default:
      throw new Error(`Неизвестная операция: ${operationName}`)
  }
}

export function setupMockGraphQLServer() {

  const originalFetch = window.fetch

  window.fetch = async function(url, options = {}) {

    let isGraphQLRequest = false
    let urlString = ''

    if (typeof url === 'string') {
      urlString = url
      isGraphQLRequest = url.includes('/graphql')
    } else if (url instanceof Request) {
      urlString = url.url
      isGraphQLRequest = urlString.includes('/graphql')
    } else if (url && url.href) {
      urlString = url.href
      isGraphQLRequest = urlString.includes('/graphql')
    } else if (url && typeof url.toString === 'function') {
      // Обработка URL объектов
      urlString = url.toString()
      isGraphQLRequest = urlString.includes('/graphql')
    }

    // Если это не GraphQL запрос, используем оригинальный fetch
    if (!isGraphQLRequest) {
      return originalFetch.apply(this, arguments)
    }

    // Если это GraphQL запрос
    if ((options.method === 'POST' || !options.method) && options.body) {
      try {

        let body
        if (typeof options.body === 'string') {
          body = JSON.parse(options.body)
        } else {
          body = options.body
        }

        const { query, variables = {} } = body

        if (!query) {
          throw new Error('GraphQL запрос должен содержать поле query')
        }

        // Обрабатываем запрос
        const data = await handleGraphQLRequest(query, variables)

        // Возвращаем ответ в формате GraphQL
        return new Response(JSON.stringify({ data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        // Возвращаем ошибку в формате GraphQL
        return new Response(
          JSON.stringify({
            errors: [
              {
                message: error.message || 'Ошибка выполнения запроса',
              },
            ],
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }

    // Для других случаев используем оригинальный fetch
    return originalFetch.apply(this, arguments)
  }
}

