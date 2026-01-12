<template>
  <div class="page-container">
    <h1>Router Guard Lab</h1>
    <p class="desc">Level 1: State Manipulation (Client-side)</p>
    
    <div class="status-panel">
      <div class="status-row">
        <span>Current Route:</span>
        <span class="chip route">{{ $route.path }}</span>
      </div>
      <div class="status-row">
        <span>Auth Status (Pinia):</span>
        <span :class="['chip', authStore.isAuthenticated ? 'success' : 'danger']">
          {{ authStore.isAuthenticated ? 'LOGGED IN' : 'GUEST' }}
        </span>
      </div>
    </div>

    <div class="nav-buttons">
      <button @click="$router.push('/')">Go Home</button>
      <button @click="$router.push('/login')">Go Login</button>
      <button @click="$router.push('/admin')" class="btn-admin">Go Admin (Protected)</button>
    </div>

    <div class="tip-box">
      <h3>🕵️ Mission Objective</h3>
      <p>The <strong>Admin</strong> route is protected by a global navigation guard. It checks <code>authStore.isAuthenticated</code>.</p>
      <p><strong>Your Goal:</strong> Access the Admin page without actually logging in.</p>
      <p><strong>Hint:</strong> Use Vue Devtools or console to modify the Pinia state directly.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'JetBrains Mono', monospace;
}
h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 0.5rem; }
.desc { color: #666; margin-bottom: 2rem; font-style: italic; }
.status-panel {
  border: 1px solid #000;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: #f9f9f9;
}
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.status-row:last-child { margin-bottom: 0; }
.chip {
  padding: 4px 8px;
  border: 1px solid #000;
  font-size: 0.8rem;
  font-weight: bold;
}
.chip.success { background: #000; color: #fff; }
.chip.danger { background: #fff; color: #000; border-style: dashed; }
.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
button {
  flex: 1;
  padding: 12px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  font-family: inherit;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.2s;
}
button:hover { background: #000; color: #fff; }
.btn-admin { border-width: 2px; }
.tip-box {
  border-top: 4px solid #000;
  padding-top: 1rem;
}
</style>