<template>
  <div class="product-card-view">
    <div v-if="loading" class="loading">
      <p>Загружаем товар...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>Ошибка: {{ error }}</p>
      <button @click="fetchProduct" class="error__btn">Попробовать снова</button>
    </div>
    <product-card v-else-if="product" :product="product"/>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    const productId = route.params.id;
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    product.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error('Ошибка загрузки товара:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
<style scoped lang="css">
.product-card-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
}

.error {
  text-align: center;
}

.error p {
  font-size: 16px;
  font-weight: 700;
  color: red;
  margin-bottom: 20px;
}

.error__btn {
  background-color: rgb(245, 245, 245);
  color: black;
  border: 1px solid rgb(222, 222, 222);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.error__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
}
</style>
