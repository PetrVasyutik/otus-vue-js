<template>
  <div class="products-list">
    <div class="products-list__header">
      <h3 class="product-list__title">Каталог товаров</h3>
      <title-search @search="handleSearch" />
    </div>
    <div class="products-list__body">
      <div class="products-list__search-category">
        <category-search
          :categories="categories"
          @category-change="handleCategoryChange"
        />
      </div>
      <div class="products-list__catalog">
        <product-card
        v-for="product in filteredAndSortedProducts" :key="product.id"
        :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import TitleSearch from '@/components/TitleSearch.vue';
import CategorySearch from '@/components/CategorySearch.vue';

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
  isNumeric: false,
  selectedCategories: []
})


const categories = computed(() => {
  const uniqueCategories = new Set()
  props.products.forEach(product => {
    if (product?.category) {
      uniqueCategories.add(product.category)
    }
  })
  return Array.from(uniqueCategories).sort()
})

const handleSearch = (filters) => {
  searchFilters.value = { ...searchFilters.value, ...filters }
}

const handleCategoryChange = (selectedCategories) => {
  searchFilters.value.selectedCategories = selectedCategories
}

const filteredAndSortedProducts = computed(() => {
  let filtered = [...props.products]

  const { query, maxPrice, isNumeric, selectedCategories } = searchFilters.value

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

  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product =>
      selectedCategories.includes(product?.category)
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

.products-list__catalog {
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

.products-list__search-category {
  margin-bottom: 20px;
}
</style>
