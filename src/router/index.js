import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import CatalogView from '@/views/CatalogView.vue';
import NotFound from '@/views/NotFound.vue';

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
      path: '/catalog',
      name: 'Catalog',
      component: CatalogView,
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
