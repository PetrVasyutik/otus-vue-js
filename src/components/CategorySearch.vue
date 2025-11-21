<template>
  <div class="category-search">
    <div class="category-search__title">Выберите категорию товаров:</div>
    <label
      v-for="category in categories"
      :key="category"
      class="category-search__label"
    >
      <input
        type="checkbox"
        :value="category"
        :checked="selectedCategories.includes(category)"
        @change="handleCategoryToggle"
        class="category-search__checkbox"
      />
      {{ category }}
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['category-change'])

const selectedCategories = ref([])

const handleCategoryToggle = (event) => {
  const category = event.target.value
  const isChecked = event.target.checked

  if (isChecked) {
    if (!selectedCategories.value.includes(category)) {
      selectedCategories.value.push(category)
    }
  } else {
    selectedCategories.value = selectedCategories.value.filter(
      cat => cat !== category
    )
  }

  emit('category-change', [...selectedCategories.value])
}

// Сбрасываем выбранные категории при изменении списка категорий
watch(() => props.categories, () => {
  selectedCategories.value = []
  emit('category-change', [])
})
</script>

<style scoped lang="css">
.category-search {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.category-search__label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.category-search__label:hover {
  color: chocolate;
}

.category-search__checkbox {
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.category-search__checkbox:checked {
  accent-color: chocolate;
}

.category-search__title {
  color: chocolate;
}

</style>
