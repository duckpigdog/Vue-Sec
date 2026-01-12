<template>
  <div class="page-container admin-theme">
    <h1>⚠️ RESTRICTED AREA ⚠️</h1>
    <h2>Admin Dashboard</h2>
    
    <div class="success-banner">
      <h3>🎉 CONGRATULATIONS!</h3>
      <p>You have successfully accessed the protected route.</p>
    </div>

    <div class="content">
      <p>Current Auth State: <strong>{{ authStore.isAuthenticated }}</strong></p>
      <p>If you see this without clicking "Login", you've successfully bypassed the guard logic by manipulating the client-side state!</p>
    </div>

    <div class="actions">
      <button @click="logout">Logout</button>
      <button @click="$router.push('/')">Back Home</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.page-container { max-width: 600px; margin: 40px auto; font-family: 'JetBrains Mono', monospace; text-align: center; }
.admin-theme { border: 4px solid #000; padding: 2rem; background-image: repeating-linear-gradient(45deg, #fff, #fff 10px, #f0f0f0 10px, #f0f0f0 20px); }
h1 { color: #000; letter-spacing: -2px; margin-bottom: 0.5rem; }
h2 { font-family: 'Playfair Display', serif; margin-bottom: 2rem; }
.success-banner { background: #000; color: #fff; padding: 1.5rem; margin-bottom: 2rem; transform: rotate(-2deg); box-shadow: 4px 4px 0 rgba(0,0,0,0.2); }
.success-banner h3 { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
.content { background: #fff; border: 1px solid #000; padding: 1rem; margin-bottom: 2rem; text-align: left; }
.actions { display: flex; gap: 1rem; justify-content: center; }
button { padding: 10px 20px; border: 2px solid #000; background: #fff; cursor: pointer; font-weight: bold; text-transform: uppercase; }
button:hover { background: #000; color: #fff; }
</style>