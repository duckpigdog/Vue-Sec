<template>
  <div class="container">
    <h1>🔐 Login Page</h1>
    <p>Click the button below to simulate a login.</p>
    <p>This will set a 'token' in localStorage.</p>
    <button @click="handleLogin" class="btn">Login (Set Token)</button>
    <button @click="handleLogout" class="btn btn-secondary">Logout (Clear Token)</button>
    <br><br>
    <router-link to="/">Back to Home</router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogin() {
  localStorage.setItem('token', 'valid_token_12345')
  alert('Login Successful! Token stored in localStorage.')
  router.push('/admin')
}

function handleLogout() {
  localStorage.removeItem('token')
  alert('Logged out! Token removed.')
}
</script>

<style scoped>
.container { padding: 2rem; }
.btn {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}
.btn-secondary { background: #6c757d; }
</style>
