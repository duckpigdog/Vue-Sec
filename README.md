# Vue-Sec 靶场说明

一个围绕前端安全与 JS 逆向的练习靶场，包含 Vue 应用型关卡和纯原生 JavaScript 逆向关卡，重点演示：

- 路由守卫、组件级访问控制等前端逻辑缺陷
- 各类 JS 反调试手段：无限 debugger、窗口尺寸检测、F12/右键拦截、字符串拼接+eval+闭包等

---

## 1. 关卡一览

### 1.1 Vue 关卡

- `vue-hello`  
  基于 Vue 3 + Pinia + Vue Router 的简单应用，演示前端认证状态保存在状态管理中的逻辑缺陷，以及路由守卫如何被前端篡改绕过。

- `vue-localstorage`  
  使用 `localStorage.token` 作为登录标记的路由守卫示例。守卫只检查 token 是否存在，不检查有效性，便于练习通过直接写入 token 的方式绕过登录。

- `vue-component-bypass`  
  演示“组件级访问控制”被绕过的场景。路由层面不做限制，在 `Admin` 组件内部根据 `localStorage.role` 决定是否渲染敏感管理区域，适合练习通过前端变量篡改/本地存储修改绕过访问控制。

### 1.2 JS 逆向关卡

- `js-anti-debug`  
  无限 `debugger` 反调试关卡，使用 `setInterval` + `requestAnimationFrame` 不断触发 `debugger` 与 `Function("debu" + "gger")()`。

- `js-anti-resize`  
  窗口尺寸检测关卡，记录初始 `window.innerWidth/innerHeight`，周期性检测变化，一旦变化超过阈值即清空页面并显示反调试提示。

- `js-anti-f12-rclick`  
  通过监听 `keydown` 和 `contextmenu` 禁用 F12、Ctrl+Shift+I/J/C 与右键菜单的关卡，用于练习事件劫持绕过与脚本篡改。

- `js-anti-adv-debug`  
  进阶版 debugger 炸弹。通过字符串拆分拼接、闭包嵌套和 `eval`/`Function` 动态构造 `debugger` 语句，结合 `setInterval` 与 `requestAnimationFrame` 形成更隐蔽的无限调试中断。

- `js-anti-tostring`  
  基于 `Function.prototype.toString` 的环境检测关卡。通过比较函数源码字符串形态（空格、压缩形式、`[native code]`）判断当前是否处于调试/被篡改环境。

- `js-anti-timing-stack`  
  通过检测关键逻辑的执行耗时和 `Error().stack` 调用栈深度识别单步调试行为，并在命中时阻断执行，用于练习时间侧信道和栈深度检测的绕过。

- `shadow-dom`  
  Shadow DOM 相关练习关卡，用于体验 DOM 隔离环境下的信息隐藏与还原。

- `qhp-lab`  
  其他 HTML/JS 小实验关卡，作为补充练习使用。

---

## 2. 运行 Vue 关卡

每个 Vue 子目录（`vue-hello`、`vue-localstorage`、`vue-component-bypass`）都是一个独立的 Vite 项目，需要分别安装依赖并启动开发服务器。

### 2.1 通用步骤

以 `vue-hello` 为例：

```bash
cd vue-hello
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

然后在浏览器访问：

- `http://localhost:5173/`

其他 Vue 关卡类似：

- `vue-localstorage`

  ```bash
  cd vue-localstorage
  npm install
  npm run dev -- --host 0.0.0.0 --port 5172
  ```

- `vue-component-bypass`

  ```bash
  cd vue-component-bypass
  npm install
  npm run dev -- --host 0.0.0.0 --port 5174
  ```

端口可以根据需要调整，只要与本机其他服务不冲突即可。

---

## 3. 运行 JS 逆向关卡

JS 逆向关卡都是单页静态 HTML 文件，直接在浏览器中打开即可：

- `js-anti-debug/index.html`
- `js-anti-resize/index.html`
- `js-anti-f12-rclick/index.html`
- `js-anti-adv-debug/index.html`
- `js-anti-tostring/index.html`
- `js-anti-timing-stack/index.html`
- `shadow-dom/index.html`
- `qhp-lab/index.html`

推荐使用任意静态服务器（如 VS Code Live Server、`npx serve` 等）以避免某些环境下的本地文件限制。

---

## 4. JS 逆向关卡环境恢复

在练习反调试绕过时，通常会通过本地存储开关、Monkey Patch 等方式暂时关闭反调试逻辑。为了重复做题或回到“初始状态”，可以使用以下环境恢复代码。

所有示例均在浏览器 DevTools 的 Console 中执行。

### 4.1 恢复各关卡的本地开关

部分关卡通过 `localStorage` 记录“反调试已关闭”的状态：

- `js-anti-debug` 使用 `__LAB_DISABLE_DEBUG`
- `js-anti-resize` 使用 `__LAB_DISABLE_RESIZE_GUARD`
- `js-anti-adv-debug` 使用 `__LAB_DISABLE_ADV_DEBUG`
- `js-anti-tostring` 使用 `__LAB_DISABLE_TOSTRING_GUARD`
- `js-anti-timing-stack` 使用 `__LAB_DISABLE_TIMING_STACK_GUARD`

如果之前通过关卡自带的 `window.__labHelp.*` 方法（如 `disableDebugFlag`、`disableGuard`、`disableFlag`）或手动方式写入了这些键，可以用下面的代码清理并恢复原始反调试行为：

```js
localStorage.removeItem('__LAB_DISABLE_DEBUG');
localStorage.removeItem('__LAB_DISABLE_RESIZE_GUARD');
localStorage.removeItem('__LAB_DISABLE_ADV_DEBUG');
localStorage.removeItem('__LAB_DISABLE_TOSTRING_GUARD');
localStorage.removeItem('__LAB_DISABLE_TIMING_STACK_GUARD');
location.reload();
```

刷新后，各关卡会重新启用对应的反调试逻辑。

### 4.2 恢复被通杀脚本 Hook 的内置函数

在尝试通用绕过时，可能会对以下 API 做 Monkey Patch：

- `eval`
- `Function`
- `setTimeout` / `setInterval`
- `requestAnimationFrame` / `cancelAnimationFrame`

为了恢复原始环境，可以借助一个临时 `iframe` 获取“干净”的 `window`，并覆盖当前页面的被 Hook 实现：

```js
(function () {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'about:blank';
  document.documentElement.appendChild(iframe);

  var cleanWin = iframe.contentWindow || iframe.contentDocument.defaultView;
  if (!cleanWin) {
    console.warn('[restore-env] failed to get clean window');
    return;
  }

  try {
    window.eval = cleanWin.eval;
    window.Function = cleanWin.Function;

    window.setTimeout = cleanWin.setTimeout.bind(window);
    window.setInterval = cleanWin.setInterval.bind(window);
    window.clearTimeout = cleanWin.clearTimeout.bind(window);
    window.clearInterval = cleanWin.clearInterval.bind(window);

    if (cleanWin.requestAnimationFrame) {
      window.requestAnimationFrame = cleanWin.requestAnimationFrame.bind(window);
    }
    if (cleanWin.cancelAnimationFrame) {
      window.cancelAnimationFrame = cleanWin.cancelAnimationFrame.bind(window);
    }

    if (cleanWin.addEventListener) {
      window.addEventListener = cleanWin.addEventListener.bind(window);
      window.removeEventListener = cleanWin.removeEventListener.bind(window);
    }

    console.log('[restore-env] core APIs restored from clean iframe window');
  } catch (e) {
    console.warn('[restore-env] error while restoring environment:', e);
  }

  document.documentElement.removeChild(iframe);
})();
```

执行后，核心内置 API 会回到接近原始的状态，方便继续调试或重新体验反调试逻辑。

### 4.3 Function.prototype.toString 检测的通用绕过

针对依赖 `Function.prototype.toString()` 形态差异（完整源码 / 压缩版 / 伪 `[native code]`）进行环境检测的关卡，可以使用“基线冻结”方式来绕过：为每个函数只记录一次 `toString()` 结果，之后无论环境如何变化都始终返回这份基线。

示例通杀脚本（在目标页面 Console 执行）：

```js
(function () {
  try {
    var origToString = Function.prototype.toString;
    var cache = new WeakMap();

    Function.prototype.toString = function () {
      if (cache.has(this)) return cache.get(this);
      var src;
      try {
        src = origToString.call(this);
      } catch (e) {
        src = 'function () { /* toString patched */ }';
      }
      cache.set(this, src);
      return src;
    };

    console.log('[anti-tostring] baseline Function.prototype.toString hook installed');
  } catch (e) {
    console.warn('[anti-tostring] failed to patch Function.prototype.toString:', e);
  }
})();
```

效果：

- 首次调用某个函数的 `toString()` 时，记录一份当前返回值；
- 后续再次调用时始终返回这份基线，不再反映环境变化；
- 对于依赖“`toString` 在调试/非调试模式下返回不同字符串”的检测逻辑，会因为看不到差异而失效。

如果需要恢复原始环境，可以使用 4.2 小节中的“恢复被通杀脚本 Hook 的内置函数”脚本。

### 4.4 执行时间与调用栈检测的通用绕过

针对依赖执行耗时与 `Error().stack` 调用栈深度判断是否单步调试的关卡，可以通过构造“虚拟时间”和“截断调用栈”的方式来削弱检测能力。

示例通杀脚本（在目标页面 Console 执行）：

```js
(function () {
  try {
    if (window.__antiTimingStackBackup) return;
    var backup = {};
    if (window.performance && typeof performance.now === 'function') {
      backup.performanceNow = performance.now;
      var origNow = performance.now.bind(performance);
      var baseReal = origNow();
      var virtualNow = 0;
      var maxStep = 5;
      performance.now = function () {
        var real = origNow();
        var delta = real - baseReal;
        if (delta < 0) delta = 0;
        var step = delta;
        if (step > maxStep) step = maxStep;
        virtualNow += step;
        return virtualNow;
      };
    }
    if (typeof Date.now === 'function') {
      backup.dateNow = Date.now;
      if (backup.performanceNow) {
        var startDate = Date.now();
        var startPerf = performance.now();
        Date.now = function () {
          return Math.floor(startDate + (performance.now() - startPerf));
        };
      }
    }
    var desc = null;
    try {
      desc = Object.getOwnPropertyDescriptor(Error.prototype, 'stack');
    } catch (e) {
      desc = null;
    }
    if (desc && typeof desc.get === 'function') {
      backup.errorStackDescriptor = desc;
      Object.defineProperty(Error.prototype, 'stack', {
        configurable: true,
        enumerable: desc.enumerable,
        get: function () {
          var value = desc.get.call(this);
          if (!value) return value;
          var lines = String(value).split('\n');
          var maxLines = 10;
          if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
          }
          return lines.join('\n');
        }
      });
    }
    window.__antiTimingStackBackup = backup;
    console.log('[anti-timing-stack] patch installed');
  } catch (e) {
    console.warn('[anti-timing-stack] failed to install patch:', e);
  }
})();
```

示例恢复脚本：

```js
(function () {
  try {
    var backup = window.__antiTimingStackBackup;
    if (!backup) return;
    if (backup.performanceNow && window.performance && typeof backup.performanceNow === 'function') {
      window.performance.now = backup.performanceNow;
    }
    if (backup.dateNow && typeof backup.dateNow === 'function') {
      Date.now = backup.dateNow;
    }
    if (backup.errorStackDescriptor) {
      Object.defineProperty(Error.prototype, 'stack', backup.errorStackDescriptor);
    }
    window.__antiTimingStackBackup = null;
    console.log('[anti-timing-stack] patch restored');
  } catch (e) {
    console.warn('[anti-timing-stack] failed to restore patch:', e);
  }
})();
```

---

## 5. 建议的练习顺序

1. 从 `vue-hello` 和 `vue-localstorage` 入手，熟悉前端路由守卫与本地存储认证的绕过思路。
2. 进入 `vue-component-bypass`，体验组件级访问控制的绕过。
3. 再依次挑战 JS 逆向关卡：
   - `js-anti-debug`：基础无限 debugger 绕过
   - `js-anti-resize`：窗口尺寸检测绕过与环境伪造
   - `js-anti-f12-rclick`：事件拦截绕过
   - `js-anti-adv-debug`：字符串拼接 + eval + 闭包嵌套的高级 debugger 炸弹
   - `js-anti-tostring`：基于 Function.prototype.toString 的环境检测与绕过

在此基础上，可以结合 `JavaScript-Reverse.md` 与 `WriteUP.md` 查看更详细的分析与解题思路。
