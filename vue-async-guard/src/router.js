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
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  fetch('/api/user/info', { credentials: 'include' })
    .then((res) => {
      if (!res.ok) {
        console.warn('⛔ Guard HTTP error', res.status)
        return null
      }
      return res.json()
    })
    .then((data) => {
      const isAdmin = data && data.role === 'admin'
      const isSuccess = data && data.status === 'success'
      if (isAdmin || isSuccess) {
        console.log('✅ Guard passed with server data', data)
        next()
      } else {
        console.warn('⛔ Guard rejected with server data', data)
        next('/login')
      }
    })
    .catch((err) => {
      console.error('⛔ Guard network error', err)
      next('/login')
    })
})

export default router
