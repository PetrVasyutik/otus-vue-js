/**
 * GraphQL запросы для работы с товарами
 */

export const PRODUCT_FIELDS = `
  id
  title
  price
  description
  category
  image
  rating {
    rate
    count
  }
`

// Запрос всех товаров
export const GET_PRODUCTS = `
  query GetProducts($limit: Int, $offset: Int) {
    products(limit: $limit, offset: $offset) {
      ${PRODUCT_FIELDS}
    }
  }
`

// Запрос одного товара по ID
export const GET_PRODUCT = `
  query GetProduct($id: Int!) {
    product(id: $id) {
      ${PRODUCT_FIELDS}
    }
  }
`

// Запрос товаров по категории
export const GET_PRODUCTS_BY_CATEGORY = `
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      ${PRODUCT_FIELDS}
    }
  }
`

// Запрос всех категорий
export const GET_CATEGORIES = `
  query GetCategories {
    categories
  }
`

