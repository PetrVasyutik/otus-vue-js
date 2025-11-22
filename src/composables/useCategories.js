import { computed } from 'vue'

export function useCategories(products) {

  const categories = computed(() => {
    const uniqueCategories = new Set()
    products.value.forEach(product => {
      if (product?.category) {
        uniqueCategories.add(product.category)
      }
    })
    return Array.from(uniqueCategories).sort()
  })

  return {
    categories
  }
}

