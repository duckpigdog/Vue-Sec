<script setup>
</script>

<template>
  <div class="page">
    <h2>Home</h2>
    <p>
      这是一个演示“组件级访问控制可以被绕过”的 Vue 关卡。
    </p>
    <p>
      正常流程下，登录只会给你一个普通用户角色，访问 Admin 页面时组件会根据角色决定是否渲染敏感内容。
    </p>
    <p>
      你的目标是想办法让 Admin 页面渲染出敏感组件，而不通过正常的管理员登录入口。
    </p>
    <router-link class="link" to="/login">前往登录页</router-link>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  margin-bottom: 1rem;
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

