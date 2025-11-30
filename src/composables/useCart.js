import { reactive, computed } from 'vue'

// Проверяю состояние корзины на уровне модуля (singleton pattern)
const cart = reactive({
  items: [] // товары в корзине - это массив объектов { product, quantity }
})

export function useCart() {
  /**
   * Добавить товар в корзину
   * Если товар уже есть, увеличить количество
   */
  const addToCart = (product) => {
    const existingItem = cart.items.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({
        product,
        quantity: 1
      })
    }
  }

  const removeFromCart = (productId) => {
    const index = cart.items.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      cart.items.splice(index, 1)
    }
  }

  const clearCart = () => {
    cart.items = []
  }


  const totalItems = computed(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  })


  const totalPrice = computed(() => {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  return {
    cartItems: computed(() => cart.items),
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  }
}

