<template>
  <div class="page-container">
    <h1>Login Page</h1>
    <div class="form-box">
      <div class="input-group">
        <label>Username</label>
        <input type="text" placeholder="admin" disabled />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" placeholder="••••••" disabled />
      </div>
      <button @click="login" class="login-btn">Login (Simulated)</button>
    </div>
    <p class="note">
      * This login button sets <code>isAuthenticated = true</code> normally.<br>
      * But try to bypass this page entirely!
    </p>
    <button @click="$router.push('/')" class="back-btn">&larr; Back to Home</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function login() {
  authStore.login()
  router.push('/admin')
}
</script>

<style scoped>
.page-container { max-width: 400px; margin: 40px auto; font-family: 'JetBrains Mono', monospace; }
h1 { font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 2rem; }
.form-box { border: 1px solid #000; padding: 2rem; background: #fff; }
.input-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.8rem; }
input { width: 100%; padding: 10px; border: 1px solid #ccc; background: #f0f0f0; cursor: not-allowed; }
.login-btn { width: 100%; padding: 12px; background: #000; color: #fff; border: none; cursor: pointer; margin-top: 1rem; text-transform: uppercase; font-weight: bold; }
.login-btn:hover { opacity: 0.8; }
.note { font-size: 0.8rem; color: #666; margin-top: 1.5rem; line-height: 1.4; }
.back-btn { background: none; border: none; cursor: pointer; margin-top: 2rem; text-decoration: underline; font-family: inherit; }
</style>