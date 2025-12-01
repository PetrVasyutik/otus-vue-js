<template>
  <div class="basket">
    <div class="basket__header">
      <h1 class="basket__title">Корзина</h1>
      <div class="basket__buttons-container">
        <button class="form-btn basket__clear-btn" @click="handleClearCart">Очистить корзину</button>
        <button class="form-btn basket__logout-btn" @click="handleLogout">Выйти</button>
      </div>
    </div>

    <div class="basket__body">
      <div v-if="cartItems.length === 0" class="basket__empty">
        <p>Корзина пуста</p>
      </div>
      <div v-else class="basket__items">
        <div
          v-for="item in cartItems"
          :key="item.product.id"
          class="basket__item"
        >
          <div class="basket__item-image">
            <img
              :src="item.product.image"
              :alt="item.product.title"
              width="100"
              height="100"
            />
          </div>
          <div class="basket__item-info">
            <h3 class="basket__item-title">{{ item.product.title }}</h3>
            <p class="basket__item-price">${{ item.product.price }}</p>
          </div>
          <div class="basket__item-quantity">
            <span class="basket__quantity-label">Количество:</span>
            <span class="basket__quantity-value">{{ item.quantity }}</span>
          </div>
        </div>
        <div class="basket__order-section">
          <button class="form-btn basket__order-btn" @click="showOrderForm = true">
            Оформить заказ
          </button>
        </div>
        <div v-if="showOrderForm" class="basket__order-form">
          <order-form />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLogout } from '@/composables/useLogout';
import { useAppStore } from '@/stores/appStore';
import OrderForm from '@/components/OrderForm.vue';

const { handleLogout } = useLogout();
// Используем Pinia store вместо composable
const store = useAppStore();
const cartItems = store.cartItems;

const showOrderForm = ref(false);

const handleClearCart = () => {
  store.clearCart();
};
</script>
<style scoped>
.basket {
  padding: 20px;
}

.basket__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.basket__title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.basket__buttons-container {
  display: flex;
  gap: 10px;
}

.basket__clear-btn {
  width: auto;
}

.basket__logout-btn {
  width: auto;
}

.basket__body {
  max-width: 1200px;
  margin: 0 auto;
}

.basket__empty {
  text-align: center;
  padding: 40px 20px;
  font-size: 18px;
  color: #666;
}

.basket__items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.basket__item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.basket__item-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
}

.basket__item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.basket__item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.basket__item-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.basket__item-price {
  font-size: 16px;
  font-weight: 700;
  color: chocolate;
  margin: 0;
}

.basket__item-quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.basket__quantity-label {
  font-size: 12px;
  color: #666;
}

.basket__quantity-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.basket__order-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.basket__order-btn {
  width: auto;
  min-width: 200px;
  padding: 15px 30px;
  font-size: 18px;
}

.basket__order-form {
  margin-top: 30px;
  width: 100%;
}

.basket__order-form :deep(.form-container) {
  max-width: 100%;
}
</style>
