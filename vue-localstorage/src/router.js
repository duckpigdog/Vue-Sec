import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Admin from './views/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { 
    path: '/admin', 
    component: Admin,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Vulnerable Navigation Guard: Checks ONLY for token existence
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    
    // VULNERABILITY: No validity check, just existence check
    if (!token) {
      console.warn('⛔ Access Denied: No token found.')
      next('/login')
    } else {
      console.log('✅ Access Granted: Token found.')
      next()
    }
  } else {
    next()
  }
})

export default router
