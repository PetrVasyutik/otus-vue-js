<template>
  <div class="products-list">
    <div class="products-list__header">
      <h3 class="product-list__title">Каталог товаров</h3>
      <title-search @search="handleSearch" />
    </div>
    <div class="products-list__container">
      <product-card
        v-for="product in filteredAndSortedProducts" :key="product.id"
        :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import TitleSearch from '@/components/TitleSearch.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
});

const searchFilters = ref({
  query: '',
  maxPrice: null,
  isNumeric: false
})

const handleSearch = (filters) => {
  searchFilters.value = filters
}

const filteredAndSortedProducts = computed(() => {
  let filtered = [...props.products]

  const { query, maxPrice, isNumeric } = searchFilters.value

  if (isNumeric && maxPrice !== null && maxPrice > 0) {
    filtered = filtered.filter(product =>
      product?.price <= maxPrice
    )
  }

  else if (query) {
    filtered = filtered.filter(product =>
      product?.title?.toLowerCase().includes(query) ?? false
    )
  }

  return filtered.sort((a, b) => {
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

.products-list__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  padding: 0 20px;
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
  color:chocolate
}
</style>
