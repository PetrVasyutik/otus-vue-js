<template>
  <div class="title-search">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="Поиск по названию или цене"
      class="title-search__input"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')

const handleSearch = () => {
  const query = searchQuery.value.trim()

  // Проверяем, является ли запрос числом (может быть целым или с точкой)
  // Важно: проверяем, что вся строка - это число, а не содержит число
  const numericValue = parseFloat(query)
  const isNumeric = !isNaN(numericValue) &&
                     isFinite(numericValue) &&
                     query !== '' &&
                     query === String(numericValue) // Вся строка должна быть числом

  emit('search', {
    query: isNumeric ? '' : query.toLowerCase(), // Если число - не ищем по названию
    maxPrice: isNumeric ? numericValue : null,
    isNumeric
  })
}
</script>

<style scoped lang="css">
.title-search {
  display: flex;
  align-items: center;
}

.title-search__input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 250px;
}

.title-search__input:focus {
  outline: none;
  border-color: chocolate;
  box-shadow: 0 0 0 2px rgba(210, 105, 30, 0.2);
}
</style>
