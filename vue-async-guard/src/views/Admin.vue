<template>
  <div class="page">
    <h2>Admin 控制台</h2>
    <p>
      只有当
      <code>/api/user/info</code>
      返回
      <code>status=success</code>
      且
      <code>role=admin</code>
      时, 路由守卫才会放行到达这里。
    </p>
    <p>默认情况下接口返回的是未授权用户, 可以通过代理工具篡改响应绕过。</p>
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
  margin: 0.5rem 0;
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

