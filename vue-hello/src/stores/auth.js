import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Vulnerable State: Purely client-side boolean
  const isAuthenticated = ref(false)

  function login() {
    isAuthenticated.value = true
  }

  function logout() {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
})