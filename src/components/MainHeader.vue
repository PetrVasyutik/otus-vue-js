<template>
  <div class="main-header">
    <div class="main-header__container">
      <nav class="main-nav">
        <router-link
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
          class="main-nav__link"
        >
          {{ route.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Получаем маршруты из роутера и фильтруем (исключаем catch-all маршрут)
const routes = computed(() => {
  return router.getRoutes().filter(route =>
    route.name &&
    route.path !== '/*' &&
    !route.path.includes('*')
  )
})
</script>

<style scoped lang="css">
.main-header {
  width: 100%;
  background-color: #f9f9f9;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
}

.main-header__container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-nav {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav__link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.main-nav__link:hover {
  background-color: rgba(210, 105, 30, 0.1);
  color: chocolate;
}

.main-nav__link.router-link-active {
  background-color: chocolate;
  color: white;
}
</style>
