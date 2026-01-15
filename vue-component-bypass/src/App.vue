<script setup>
</script>

<template>
  <div id="layout">
    <header class="top-nav">
      <h1 class="logo">Vue Component Bypass Lab</h1>
      <nav class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/admin">Admin</router-link>
      </nav>
    </header>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana,
    sans-serif;
}

#app {
  max-width: 960px;
  margin: 0 auto;
}

#layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #111;
  color: #fff;
}

.logo {
  margin: 0;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-links a.router-link-active {
  text-decoration: underline;
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem 3rem;
}
</style>

