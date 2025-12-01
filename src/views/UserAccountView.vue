<template>
  <div class="user-account">
    <div class="user-account__header">
      <h1 class="user-account__title">Личный кабинет</h1>
      <div class="user-account__buttons-container">
        <button class="form-btn user-account__basket-btn" @click="handleBasketClick">
          Корзина
        </button>
        <button
          @click="handleLogout"
          class="form-btn user-account__logout-btn"
          aria-label="Выйти из личного кабинета"
        >
          Выйти
        </button>
      </div>
    </div>
    <div class="user-account__container">
      <div class="user-account__info">

      </div>
      <div class="user-account__new-product">
        <new-product-form :products="products" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import NewProductForm from '@/components/NewProductForm.vue';
import { useAppStore } from '@/stores/appStore';
import { useLogout } from '@/composables/useLogout';

const router = useRouter();
// Используем Pinia store вместо composable
const store = useAppStore();
const products = store.products;
const { handleLogout } = useLogout();

const handleBasketClick = () => {
  router.push({ name: 'Basket' });
}
</script>
<style scoped>
.user-account {
  padding: 20px;
}

.user-account :deep(.form-container) {
  width: 700px;
  max-width: 700px;
}

.user-account__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-account__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: #333;
}

.user-account__logout-btn {
  width: auto;
}

.user-account__logout-btn:hover:not(:disabled),
.user-account__logout-btn:focus {
  border-color: #dc3545;
  outline: none;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.user-account__container {
  display: flex;
  gap: 30px;
}

.user-account__basket-btn {
  width: auto;
  margin-right: 10px;
}
</style>
