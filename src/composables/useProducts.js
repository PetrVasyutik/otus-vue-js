import { ref, reactive } from 'vue'

export function useProducts() {

  const products = ref([])

  const productsState = reactive({
    loading: true,
    error: null,
  })

  const fetchProducts = async (url = 'https://fakestoreapi.com/products') => {
    try {
      productsState.loading = true
      productsState.error = null

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      products.value = await response.json()

    } catch (err) {
      productsState.error = err.message
      console.error('Ошибка загрузки:', err)
    } finally {
      productsState.loading = false
    }
  }

  return {
    products,
    productsState,
    fetchProducts,
  }
}

