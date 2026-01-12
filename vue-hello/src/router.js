import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Admin from './views/Admin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { 
      path: '/admin', 
      component: Admin,
      meta: { requiresAuth: true }
    }
  ]
})

// Vulnerable Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    console.warn('⛔ Access Denied: User not authenticated.')
    next('/login')
  } else {
    // Allow access
    next()
  }
})

export default router