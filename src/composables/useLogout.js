import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

export function useLogout() {
  const router = useRouter();
  const store = useAppStore();

  const handleLogout = () => {
    // Выходим из системы через Pinia store
    store.logout();
    router.push({ name: 'home' });
  };

  return {
    handleLogout
  }
};
