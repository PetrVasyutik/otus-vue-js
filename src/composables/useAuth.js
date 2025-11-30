import { ref } from 'vue'

// Проверяю, авторизован ли пользователь на уровне модуля (singleton pattern)
const isAuthenticated = ref(false)

// Проверяем localStorage при инициализации
const AUTH_KEY = 'isAuthenticated'
if (localStorage.getItem(AUTH_KEY) === 'true') {
  isAuthenticated.value = true
}

export function useAuth() {

  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem(AUTH_KEY, 'true')
  }


  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem(AUTH_KEY)
  }

  const checkAuth = () => {
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}

