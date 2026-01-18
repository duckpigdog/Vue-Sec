<template>
  <div class="page">
    <h1>路由守卫异步接口校验实验</h1>
    <p class="desc">
      beforeEach 中会请求
      <code>/api/user/info</code>
      校验当前用户权限。
    </p>

    <div class="status-box">
      <p>
        当前路由:
        <span class="pill">{{ $route.path }}</span>
      </p>
      <p>最近一次接口响应:</p>
      <pre class="code">{{ lastResponse }}</pre>
    </div>

    <div class="nav">
      <router-link to="/login" class="btn">前往登录页</router-link>
      <router-link to="/admin" class="btn btn-danger">直接访问 Admin (受保护)</router-link>
    </div>

    <div class="tip">
      <h3>练习目标</h3>
      <p>
        使用 Burp Suite 或 Whistle 拦截
        <code>/api/user/info</code>
        的响应, 将返回的 JSON 中
        <code>role</code>
        从
        <code>user</code>
        修改为
        <code>admin</code>
        , 或将
        <code>status</code>
        从
        <code>unauthorized</code>
        修改为
        <code>success</code>
        , 让路由守卫通过异步校验, 正常渲染 Admin 页面。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const lastResponse = ref('尚未请求 /api/user/info')

onMounted(async () => {
  try {
    const res = await fetch('/api/user/info', { credentials: 'include' })
    if (!res.ok) {
      lastResponse.value = 'HTTP ' + res.status
      return
    }
    const data = await res.json()
    lastResponse.value = JSON.stringify(data, null, 2)
  } catch (e) {
    lastResponse.value = '请求失败'
  }
})
</script>

<style scoped>
.page {
  padding: 2rem 1.5rem 3rem;
}

h1 {
  margin: 0 0 0.5rem;
}

.desc {
  margin: 0 0 1.5rem;
  color: #555;
}

.status-box {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
}

.code {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  background: #111;
  color: #fafafa;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow-x: auto;
}

.nav {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-danger {
  background: #dc3545;
}

.tip {
  border-top: 3px solid #111;
  padding-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>

