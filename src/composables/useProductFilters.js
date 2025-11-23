import { ref, computed } from 'vue'

export function useProductFilters(products) {
  // Состояние фильтров
  const filters = ref({
    query: '',
    maxPrice: null,
    isNumeric: false,
    selectedCategories: []
  })

  const updateSearchFilters = (searchFilters) => {
    filters.value = { ...filters.value, ...searchFilters }
  }

  const updateCategories = (selectedCategories) => {
    filters.value.selectedCategories = selectedCategories
  }

  /**
   * Отфильтрованные и отсортированные продукты
   */
  const filteredAndSortedProducts = computed(() => {
    let filtered = [...products.value]

    const { query, maxPrice, isNumeric, selectedCategories } = filters.value

    // Фильтрация по цене (если введено число)
    if (isNumeric && maxPrice !== null && maxPrice > 0) {
      filtered = filtered.filter(product =>
        product?.price <= maxPrice
      )
    }
    // Фильтрация по названию (если введён текст)
    else if (query) {
      filtered = filtered.filter(product =>
        product?.title?.toLowerCase().includes(query) ?? false
      )
    }

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product?.category)
      )
    }

    // Сортировка по рейтингу (от большего к меньшему)
    return filtered.sort((a, b) => {
      const rateA = a?.rating?.rate ?? 0
      const rateB = b?.rating?.rate ?? 0
      return rateB - rateA
    })
  })

  return {
    filters,
    updateSearchFilters,
    updateCategories,
    filteredAndSortedProducts
  }
}

