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
import { useSearchQuery } from '@/composables/useSearchQuery'

const emit = defineEmits(['search'])

const { searchQuery, processSearchQuery } = useSearchQuery()

const handleSearch = () => {
  const searchFilters = processSearchQuery()
  emit('search', searchFilters)
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
