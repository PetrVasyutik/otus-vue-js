<template>
  <article class="product-card">
    <div class="product-card__image">
      <img :src="props.product.image" :alt="props.product.title" width="120" height="100" />
    </div>
    <div class="product-card__info">
      <h4 class="product-card__title">{{ props.product.title }}</h4>
      <p class="product-card__category">{{ props.product.category }}</p>
      <p class="product-card__price">${{ props.product.price }}</p>
      <div class="product-card__rating">
        ⭐ {{ props.product.rating.rate }} ({{ props.product.rating.count }} оценок)
      </div>

    </div>
    <div class="product-card__cart-info">
      <div v-if="itemQuantity > 0" class="product-card__quantity">
        В корзине: {{ itemQuantity }}
      </div>
      <button class="product-card__btn" @click="handleAddToCart">Добавить в корзину</button>
    </div>
  </article>
</template>
<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Используем Pinia store вместо composable
const store = useAppStore()

const itemQuantity = computed(() => {
  const item = store.cartItems.find(item => item.product.id === props.product.id)
  return item ? item.quantity : 0
})

const handleAddToCart = () => {
  store.addToCart(props.product)
}
</script>
<style scoped lang="css">
.product-card {
  width: 570px;
  min-height: 400px;
  background-color: rgb(255, 255, 233);
  padding: 25px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.product-card__image {
  width: 100%;
  height: 130px;
  object-fit: cover;
  text-align: center;
}

.product-card__info {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.product-card__title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.product-card__category {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}

.product-card__price {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.product-card__rating {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}

.product-card__cart-info {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.product-card__quantity {
  font-size: 14px;
  font-weight: 600;
  color: chocolate;
  padding: 6px 12px;
  background-color: rgba(210, 105, 30, 0.1);
  border-radius: 4px;
}

.product-card__btn {
  width: 100%;
  background-color: rgb(245, 245, 245);
  color: black;
  border: 1px solid rgb(222, 222, 222);
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
}
.product-card__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
}
</style>
