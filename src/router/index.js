import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import CatalogView from '@/views/CatalogView.vue';
import NotFound from '@/views/NotFound.vue';
import LoginView from '@/views/LoginView.vue';
import UserAccountView from '@/views/UserAccountView.vue';
import ProductCardView from '@/views/ProductCardView.vue';
import BasketView from '@/views/BasketView.vue';
import { useAppStore } from '@/stores/appStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/catalog',
      name: 'Catalog',
      component: CatalogView,
    },
    {
      path: '/account',
      name: 'UserAccount',
      component: UserAccountView,
      meta: { requiresAuth: true },
    },
    {
      path: '/basket',
      name: 'Basket',
      component: BasketView,
      meta: { requiresAuth: true },
    },
    {
      path: '/product/:id',
      name: 'Product',
      component: ProductCardView,
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

// Navigation guard для защиты страниц, требующих авторизации
router.beforeEach((to, from, next) => {
  const store = useAppStore()

  // Проверяем, требует ли маршрут авторизации
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!store.user.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    // Если авторизация не требуется, разрешаем переход
    next()
  }
})

export default router
