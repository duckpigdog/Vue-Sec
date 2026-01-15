<template>
  <div class="page-container">
    <h1>Login Page</h1>
    <div class="form-box">
      <div class="input-group">
        <label>Username</label>
        <input type="text" v-model="username" placeholder="Enter username" />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter password" />
      </div>
      <button @click="login" class="login-btn">Login</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
    <p class="note">
      * This login form validates credentials client-side.<br>
      * Can you bypass it or find the correct credentials?
    </p>
    <button @click="$router.push('/')" class="back-btn">&larr; Back to Home</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

function login() {
  // Hardcoded credentials vulnerability
  if (username.value === 'admin' && password.value === 'vue-sec-rocks') {
    authStore.login()
    router.push('/admin')
  } else {
    errorMsg.value = 'Invalid credentials'
    password.value = ''
  }
}
</script>

<style scoped>
.page-container { max-width: 400px; margin: 40px auto; font-family: 'JetBrains Mono', monospace; }
h1 { font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 2rem; }
.form-box { border: 1px solid #000; padding: 2rem; background: #fff; }
.input-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.8rem; }
input { width: 100%; padding: 10px; border: 1px solid #ccc; background: #fff; }
.login-btn { width: 100%; padding: 12px; background: #000; color: #fff; border: none; cursor: pointer; margin-top: 1rem; text-transform: uppercase; font-weight: bold; }
.login-btn:hover { opacity: 0.8; }
.error { color: red; margin-top: 10px; font-size: 0.9rem; text-align: center; }
.note { font-size: 0.8rem; color: #666; margin-top: 1.5rem; line-height: 1.4; }
.back-btn { background: none; border: none; cursor: pointer; margin-top: 2rem; text-decoration: underline; font-family: inherit; }
</style>