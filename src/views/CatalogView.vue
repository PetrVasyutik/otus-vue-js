<template>
  <h1>Каталог товаров</h1>
  <section class="section">
      <div class="section__body">
        <div v-if="productsState.loading" class="loading">
          <p>Загружаем товары...</p>
        </div>
        <div v-else-if="productsState.error" class="error">
          <p>Ошибка: {{ productsState.error }}</p>
          <button @click="fetchProducts" class="error__btn">Попробовать снова</button>
        </div>
        <div v-else class="section__products">
          <products-list :products="products" />
        </div>
      <section class="section">
        <div class="order-form">
          <order-form />
        </div>
      </section>
      <section class="section">
        <div class="new-product-form">
          <new-product-form :products="products" />
        </div>
      </section>
      </div>
    </section>
</template>
<script setup>
import { onMounted } from 'vue';
import ProductsList from '@/components/ProductsList.vue';
import { useProducts } from '@/composables/useProducts';

const { products, productsState, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>
<style scoped></style>
