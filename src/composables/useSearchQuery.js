import { ref } from 'vue'

export function useSearchQuery() {
  const searchQuery = ref('')

  const processSearchQuery = () => {
    const query = searchQuery.value.trim()

    // Проверяем, является ли запрос числом (может быть целым или с точкой)
    // Важно: проверяем, что вся строка - это число, а не содержит число
    const numericValue = parseFloat(query)
    const isNumeric = !isNaN(numericValue) &&
                       isFinite(numericValue) &&
                       query !== '' &&
                       query === String(numericValue) // Вся строка должна быть числом

    return {
      query: isNumeric ? '' : query.toLowerCase(), // Если число - не ищем по названию
      maxPrice: isNumeric ? numericValue : null,
      isNumeric
    }
  }

  return {
    searchQuery,
    processSearchQuery
  }
}

