import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import CatalogView from '@/views/CatalogView.vue';
import NotFound from '@/views/NotFound.vue';
import LoginView from '@/views/LoginView.vue';
import UserAccountView from '@/views/UserAccountView.vue';
import ProductCardView from '@/views/ProductCardView.vue';

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

export default router
