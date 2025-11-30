import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push({ name: 'home' });
  };

  return {
    handleLogout
  }
};
