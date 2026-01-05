import { GraphQLClient } from 'graphql-request'

// Используем полный URL для graphql-request
const GRAPHQL_ENDPOINT = typeof window !== 'undefined'
  ? `${window.location.origin}/graphql`
  : '/graphql'

// Создаем клиент
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function request(query, variables = {}) {
  try {
    const data = await graphqlClient.request(query, variables)
    return data
  } catch (error) {
    console.error('GraphQL ошибка:', error)

    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка выполнения запроса'
    if (error.response) {
      // Ошибка от graphql-request
      const errors = error.response.errors || []
      if (errors.length > 0) {
        errorMessage = errors[0].message || errorMessage
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    const graphqlError = new Error(errorMessage)
    graphqlError.originalError = error
    throw graphqlError
  }
}

