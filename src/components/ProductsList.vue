<template>
  <div class="products-list">
    <div class="products-list__header">
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
        <preview-product-card
        v-for="product in filteredAndSortedProducts" :key="product.id"
        :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRef } from 'vue';
import PreviewProductCard from '@/components/PreviewProductCard.vue';
import TitleSearch from '@/components/TitleSearch.vue';
import CategorySearch from '@/components/CategorySearch.vue';
import { useProductFilters } from '@/composables/useProductFilters';
import { useCategories } from '@/composables/useCategories';

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Преобразуем props.products в ref для composables
const products = toRef(props, 'products')

// Используем composables для работы с фильтрами и категориями
const { categories } = useCategories(products)
const {
  updateSearchFilters,
  updateCategories,
  filteredAndSortedProducts
} = useProductFilters(products)

const handleSearch = (filters) => {
  updateSearchFilters(filters)
}

const handleCategoryChange = (selectedCategories) => {
  updateCategories(selectedCategories)
}
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
