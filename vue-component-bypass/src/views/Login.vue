<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function loginAsUser() {
  localStorage.setItem('role', 'user')
  alert('已以普通用户身份登录（role=user）。')
  router.push('/admin')
}

function clearRole() {
  localStorage.removeItem('role')
  alert('已清除本地角色信息。')
}
</script>

<template>
  <div class="container">
    <h2>Login</h2>
    <p>点击下方按钮，以普通用户身份登录。</p>
    <p>页面会在本地存储一个 role=user 的标记。</p>
    <button class="btn" @click="loginAsUser">普通用户登录</button>
    <button class="btn btn-secondary" @click="clearRole">清除本地角色</button>
    <p class="tip">
      注意：这里没有提供“管理员登录”按钮，但组件本身会根据本地 role 判断是否渲染敏感内容。
    </p>
    <router-link class="back" to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  margin-bottom: 1rem;
}

.btn {
  padding: 10px 20px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem 0.25rem 0.25rem 0;
}

.btn-secondary {
  background: #6c757d;
}

.tip {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.back {
  display: inline-block;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}
</style>

