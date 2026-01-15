<script setup>
import { computed, ref, onMounted } from 'vue'

const role = ref('guest')

onMounted(() => {
  const storedRole = localStorage.getItem('role')
  if (storedRole) {
    role.value = storedRole
  }
})

const hasAdminAccess = computed(() => role.value === 'admin')
</script>

<template>
  <div class="container">
    <h2>Admin</h2>
    <p>当前角色: <strong>{{ role }}</strong></p>

    <div v-if="hasAdminAccess" class="secret-box">
      <h3>敏感管理组件</h3>
      <p>你已经以管理员身份访问到了组件内部的敏感区域。</p>
      <p>在真实项目中，这类逻辑必须在后端校验，而不能只依赖前端组件条件渲染。</p>
    </div>

    <div v-else class="blocked">
      <p>你不是管理员，组件拒绝渲染敏感内容。</p>
      <p>思考：如果只能控制浏览器前端，你是否还能让这个组件渲染出来？</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 640px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  margin-bottom: 0.75rem;
}

.secret-box {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #28a745;
}

.blocked {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dc3545;
}
</style>

