<template>
  <div class="container">
    <h1>🛡️ Admin Dashboard</h1>
    <div class="secret-content">
      <p>🎉 Congratulations! You have accessed the protected area.</p>
      <p>This page is only visible if 'token' exists in localStorage.</p>
    </div>
    <br>
    <router-link to="/" class="btn">Back to Home</router-link>
  </div>
</template>

<style scoped>
.container { padding: 2rem; }
.secret-content {
  background: #d4edda;
  color: #155724;
  padding: 20px;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
}
.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
