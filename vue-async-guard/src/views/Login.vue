<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goAdmin() {
  router.push('/admin')
}
</script>

<template>
  <div class="page">
    <h2>登录页</h2>
    <p>这是一个演示用登录页, 不会真正改变后端返回的角色。</p>
    <p>点击下方按钮尝试跳转到 Admin, 路由守卫会在跳转前请求接口。</p>
    <button class="btn" @click="goAdmin">尝试进入 Admin</button>
    <router-link class="link" to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 2rem 1.5rem 3rem;
}

h2 {
  margin: 0 0 1rem;
}

p {
  margin: 0.25rem 0;
}

.btn {
  margin-top: 1.5rem;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 4px;
  background: #28a745;
  color: #fff;
  cursor: pointer;
}

.link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>

