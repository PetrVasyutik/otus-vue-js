import { GraphQLClient } from 'graphql-request'
import type { GetProductsResponse, GetProductResponse } from '@/types/graphql'

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

/**
 * Выполняет GraphQL запрос
 * @param query - GraphQL запрос
 * @param variables - Переменные для запроса
 * @returns Результат запроса
 */
export async function request<TData = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<TData> {
  try {
    const data = await graphqlClient.request<TData>(query, variables)
    return data
  } catch (error: unknown) {
    console.error('GraphQL ошибка:', error)

    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка выполнения запроса'

    if (error && typeof error === 'object' && 'response' in error) {
      const graphqlError = error as { response?: { errors?: Array<{ message?: string }> } }
      const errors = graphqlError.response?.errors || []
      if (errors.length > 0) {
        errorMessage = errors[0].message || errorMessage
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    const graphqlError = new Error(errorMessage)
    ;(graphqlError as Error & { originalError: unknown }).originalError = error
    throw graphqlError
  }
}

// Экспортируем типы для удобства
export type { GetProductsResponse, GetProductResponse }
