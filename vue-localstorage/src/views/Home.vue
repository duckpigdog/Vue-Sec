<template>
  <div class="container">
    <h1>🏠 Home</h1>
    <p>Welcome to the LocalStorage Auth Lab (Level 2)</p>
    <div class="status-box">
      <p>Current Token Status: 
        <span :class="hasToken ? 'safe' : 'danger'">
          {{ hasToken ? 'Token Found in LocalStorage' : 'No Token Found' }}
        </span>
      </p>
    </div>
    <div class="nav">
      <router-link to="/login" class="btn">Go Login</router-link>
      <router-link to="/admin" class="btn btn-danger">Go Admin (Protected)</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const hasToken = ref(false)

onMounted(() => {
  hasToken.value = !!localStorage.getItem('token')
})
</script>

<style scoped>
.container {
  padding: 2rem;
}
.status-box {
  margin: 20px 0;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.safe { color: green; font-weight: bold; }
.danger { color: red; font-weight: bold; }
.nav { display: flex; gap: 10px; justify-content: center; }
.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
.btn-danger { background: #dc3545; }
</style>
