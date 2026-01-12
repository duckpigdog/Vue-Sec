# WriteUp: Vue 路由守卫绕过靶场

本篇 WriteUp 将带你深入分析 Vue 应用中的路由守卫机制，以及在仅依赖客户端状态（Client-side State）时可能面临的安全风险。我们将从零基础开始，逐步讲解 Vue 路由守卫的工作原理、代码审计过程以及具体的绕过手法。

## 1. 基础知识：什么是 Vue 路由守卫？

在 Vue.js 单页应用（SPA）中，页面跳转并不会刷新浏览器，而是由 `vue-router` 动态替换组件。为了控制用户访问权限（例如：未登录用户不能访问后台），开发者通常会使用 **全局前置守卫 (Global Before Guards)**。

简单来说，路由守卫就像是小区门口的保安：
- **`to`**: 你要去哪里？（目标路由）
- **`from`**: 你从哪里来？（来源路由）
- **`next`**: 是否放行？（控制跳转）

一个典型的守卫代码如下：

```javascript
router.beforeEach((to, from, next) => {
  // 如果目标路由需要权限，且用户未认证
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 拦截，踢回登录页
  } else {
    next(); // 放行
  }
});
```

---

## 2. 第一关：客户端状态直接篡改 (Level 1)

### 2.1 关卡介绍
- **场景**: 应用依赖前端内存中的状态（如 Pinia/Vuex）来判断用户是否登录。
- **靶场位置**: `vue-hello`
- **目标**: 不登录直接访问 Admin 页面。

### 2.2 代码审计 (Code Audit)

我们拿到了靶场的源码，重点关注两个文件：`src/router.js`（路由配置）和 `src/stores/auth.js`（状态管理）。

**审计 `src/router.js`:**

```javascript
// src/router.js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { 
      path: '/admin', 
      component: Admin,
      meta: { requiresAuth: true } // [1] 标记 Admin 路由需要认证
    }
  ]
})

// Vulnerable Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore() // [2] 获取 Pinia 状态仓库
  
  // Check if route requires auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) { // [3] 核心判断逻辑
    console.warn('⛔ Access Denied: User not authenticated.')
    next('/login')
  } else {
    next()
  }
})
```

**审计分析：**
- **[3]**: **关键漏洞点！** 守卫判断是否放行的依据完全是 `!authStore.isAuthenticated`。这是一个**前端内存变量**。

**审计 `src/stores/auth.js`:**

```javascript
// src/stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  // Vulnerable State: Purely client-side boolean
  const isAuthenticated = ref(false) // [4] 默认为 false
  // ...
  return { isAuthenticated, login, logout }
})
```

**审计分析：**
- **[4]**: `isAuthenticated` 只是一个普通的 Vue `ref`，存储在浏览器的内存中。整个认证逻辑完全运行在客户端。

### 2.3 漏洞利用 (Exploitation)

既然判断依据只是浏览器内存中的一个变量，作为客户端的控制者，我们可以随意修改这个变量的值。

**复现步骤：**
1.  **访问靶场首页**：浏览器打开 `http://127.0.0.1:5173/`。
2.  **尝试直接访问 Admin**：点击 "Go Admin (Protected)" 按钮，你会发现被重定向到了 `/login` 页面。
3.  **打开 Vue Devtools**：按 `F12` 打开开发者工具，切换到 **Vue** 标签页。
4.  **定位 Pinia Store**：找到 **Pinia** 图标，点击左侧的 `auth` store。
5.  **篡改状态**：在右侧面板中，将 `isAuthenticated` 的值从 `false` 改为 `true`，并保存。
6.  **再次尝试访问**：再次点击 "Go Admin (Protected)" 按钮。
    - **成功！** 你绕过了登录页，直接进入了 Admin Dashboard。

### 2.4 修复建议 (Remediation)

这种漏洞的核心原因在于**过度信任客户端状态**。

1.  **后端验证是必须的**：前端路由守卫放行后，页面加载数据时，必须向后端 API 发起请求。后端 API 必须校验 Session 或 JWT Token。
2.  **服务端渲染 (SSR)**：对于极度敏感的页面，可以使用 SSR（如 Nuxt.js）在服务端直接判断权限。

---

## 3. 第二关：本地存储伪造 (Level 2)

### 3.1 关卡介绍
- **场景**: 为了实现“保持登录状态”（Persistence），开发者通常会将 Token 存储在 `localStorage` 或 `sessionStorage` 中。
- **靶场位置**: `vue-localstorage`
- **目标**: 不登录直接访问 Admin 页面。

### 3.2 漏洞复现 (Exploitation)

很多开发者写出了类似这样的路由守卫代码：

```javascript
// 脆弱的守卫逻辑
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    // 仅仅检查 Token 是否存在 (Existence Check)
    if (token) {
      next(); // 放行
    } else {
      next('/login'); // 拦截
    }
  } else {
    next();
  }
});
```

**复现步骤：**
1.  **访问首页**: 打开 `http://127.0.0.1:5174/`，你会看到当前 Token 状态为 "No Token Found"。
2.  **尝试访问 Admin**: 点击 "Go Admin (Protected)"，会被拦截并跳转到登录页。
3.  **打开控制台**: 按 `F12` 打开浏览器控制台 (Console)。
4.  **注入伪造 Token**:
    输入以下命令并回车：
    ```javascript
    localStorage.setItem('token', 'i_am_a_hacker_token');
    ```
5.  **刷新或再次访问**:
    - 你可以手动刷新页面，或者点击 "Go Admin (Protected)" 按钮。
    - **成功！** 你再次绕过了验证，进入了 Admin 页面。

**原理**：前端代码只执行了 `if (token)`。在 JavaScript 中，非空字符串 `'i_am_a_hacker_token'` 被计算为 `true`。

### 3.3 修复建议 (Remediation)

**仅仅在前端做验证是永远不够的。**

1.  **后端即时校验 (Real-time Validation)**:
    每次路由跳转时（或定期），前端应该调用一个后端接口（如 `/api/auth/verify`）来验证 Token 的有效性。
    
    ```javascript
    // 更安全的做法
    router.beforeEach(async (to, from, next) => {
      if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) return next('/login');

        try {
          // 向后端验证 Token 有效性
          await verifyTokenWithBackend(token);
          next();
        } catch (error) {
          // Token 无效或过期
          localStorage.removeItem('token');
          next('/login');
        }
      } else {
        next();
      }
    });
    ```

2.  **JWT 签名校验 (JWT Signature)**:
    虽然前端无法验证 JWT 的签名，但前端至少可以解析 JWT 的 payload 检查过期时间 (`exp`)。**最终的防线始终在后端 API。**

---

## 总结

- **Level 1 (Memory)**: 攻击者利用 Devtools 修改内存中的 Vue/Pinia 状态。
- **Level 2 (Storage)**: 攻击者利用 Console 注入伪造的 LocalStorage Token。
- **核心教训**: **Never Trust the Client**（永远不要信任客户端）。前端的“安全”只是装饰，真正的安全必须由后端保障。
