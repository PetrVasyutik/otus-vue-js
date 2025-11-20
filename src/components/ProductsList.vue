<template>
  <div class="products-list">
    <h3 class="product-list__title">Каталог товаров</h3>
    <div class="products-list__container">
      <product-card
        v-for="product in sortedProducts" :key="product.id"
        :product="product" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProductCard from './ProductCard.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
});

const sortedProducts = computed(() => {
  return [...props.products].sort((a, b) => {
    const rateA = a?.rating?.rate ?? 0
    const rateB = b?.rating?.rate ?? 0
    return rateB - rateA
  })
})
</script>

<style scoped lang="css">
.products-list {
  width: 100%;
}

.products-list__container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.product-list__title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color:chocolate
}
</style>
