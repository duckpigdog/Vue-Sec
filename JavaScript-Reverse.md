# JS 逆向反调试绕过技巧

配套练习靶场地址：https://github.com/duckpigdog/Vue-Sec/

推荐渗透测试浏览器插件：https://github.com/duckpigdog/XMCVE-WebRecon

## 无限 Debugger 绕过

### 反调试原理

定时执行`debugger`语句，打开 F12 强制触发断点，卡死调试流程

### 方法一：一律不在此处暂停

在 `debugger` 代码处行号右键选择一律不在此处暂停

![](https://pic1.imgdb.cn/item/6966880d363e238a1ffd1e2b.png)

### 方法二：添加条件断点

在 `debugger` 代码处行号右键选择添加条件断点

![](https://pic1.imgdb.cn/item/6966880d363e238a1ffd1e2b.png)

将条件设置为 `false`

![](https://pic1.imgdb.cn/item/696688ed363e238a1ffd2215.png)

### 方法三：本地替换法

右键选择替换内容

![](https://pic1.imgdb.cn/item/696707950e6bc0c5db99a376.png)

添加一个用于存放代码的文件夹后，根据上方的提示选择允许

![](https://pic1.imgdb.cn/item/696707ae0e6bc0c5db99a394.png)

此后，我们直接将存在 `debugger` 的语句注释掉，然后保存

![](https://pic1.imgdb.cn/item/696707ce0e6bc0c5db99a3b4.png)

### 方法四：Firefox 浏览器特性

"在调试器语句上暂停" 默认是勾选上的，我们取消掉就行

![](https://pic1.imgdb.cn/item/6967065b363e238a1ffd2cda.png)

## 禁用 F12 绕过

### 反调试原理

监听 `oncontextmenu、onkeydown、onselectstart` 等事件，返回`false`阻断操作

### 方法一：新标签页绕过

在别的网页先打开 F12，再把 URL 替换成禁用的网址就可以了

![](https://pic1.imgdb.cn/item/69674d9c99f37a647f5804a6.png)

### 方法二：浏览器设置绕过

Chrome：设置 → 更多工具 → 开发者工具 → 快捷键设置，自定义一个 F12 之外的快捷键（比如 Alt+D）打开调试器，直接绕过监听

## 窗口尺寸检测绕过

### 反调试原理

记录初始窗口尺寸，定时检测尺寸变化，异常则刷新 / 清空页面 / 卡死

### 方法一：新标签页绕过

在别的网页先打开 F12，再把 URL 替换成禁用的网址就可以了

![](https://pic1.imgdb.cn/item/69693a4a3fd74b78f8ae12c9.png)

### 方法二：Hook 脚本

1. 在脚本加载的一瞬间，记录下浏览器当前的 `innerWidth`、`outerWidth` 等尺寸。这被视为页面处于“正常状态”时的标准答案
2.  利用 `Object.defineProperty` 重新定义 `window` 的尺寸属性。通过劫持 `getter`，无论后续用户如何拖拽窗口或打开控制台，当网站试图读取这些值时，返回的永远是第一步记录的“标准答案
3. 重写 `window.addEventListener`，一旦发现网站想监听 `resize` 事件，直接拦截不予注册
4. 手动将 `window.onresize` 置空

```javascript
/**
 * 【反调试干扰屏蔽脚本】
 * 功能：锁定视口尺寸，防止网站通过监测窗口大小变化来探测开发者工具（DevTools）的开启
 */
(function () {
  // 1) 采样阶段：记录当前“清白”的视口尺寸
  // 在脚本运行初期（通常是控制台未打开时），记录下真实的视口和浏览器外框尺寸作为“模板”
  var fixedInnerWidth = window.innerWidth;
  var fixedInnerHeight = window.innerHeight;
  var fixedOuterWidth = window.outerWidth;
  var fixedOuterHeight = window.outerHeight;

  /**
   * 核心劫持函数：利用 Object.defineProperty 修改对象属性描述符
   * @param {Object} obj - 目标对象 (window 或 visualViewport)
   * @param {string} prop - 要锁定的属性名
   * @param {any} value - 锁定的固定值
   */
  function defineConst(obj, prop, value) {
    if (!obj) return;
    try {
      Object.defineProperty(obj, prop, {
        configurable: true, // 允许后续重新定义（方便我们在逆向过程中再次修改）
        enumerable: true,   // 保持可枚举，确保检测脚本遍历属性时不会发现异常
        get: function () { 
          // 劫持 Getter：无论窗口如何缩放，始终返回最初记录的固定值
          return value; 
        },
        set: function () {
          // 劫持 Setter：屏蔽任何尝试手动修改这些尺寸的行为，使其“静默失败”
        },
      });
    } catch (e) {
      // 某些严苛环境或 iframe 可能会抛出错误，此处静默处理防止崩溃
    }
  }

  // 2) 实施属性冻结
  // 针对 window 对象上的核心尺寸属性进行伪造
  defineConst(window, 'innerWidth', fixedInnerWidth);
  defineConst(window, 'innerHeight', fixedInnerHeight);
  defineConst(window, 'outerWidth', fixedOuterWidth);
  defineConst(window, 'outerHeight', fixedOuterHeight);

  // 兼容性补丁：针对现代浏览器中的 visualViewport（视觉视口）进行同步伪造
  // 很多高级检测脚本（如瑞数、Akamai）会交叉校验 visualViewport 的尺寸
  if (window.visualViewport) {
    defineConst(window.visualViewport, 'width', window.visualViewport.width);
    defineConst(window.visualViewport, 'height', window.visualViewport.height);
  }

  // 3) 事件屏蔽阶段：堵截报警通道
  try {
    // 备份原生的 addEventListener 函数，防止逻辑死循环
    var _addEventListener = window.addEventListener;
    
    // 劫持事件监听注册：猴子补丁（Monkey Patch）
    window.addEventListener = function (type, listener, options) {
      // 如果网站尝试监听 'resize' 事件，直接拦截并丢弃
      if (type === 'resize') {
        // 输出警告，方便逆向人员观察有哪些脚本在尝试探测环境
        console.warn('[anti-resize] 成功拦截并屏蔽了一个 resize 监听器:', listener && listener.name);
        return; // 直接返回，不执行注册
      }
      // 非 resize 事件则正常放行，使用 call 确保 this 指向正确
      return _addEventListener.call(this, type, listener, options);
    };
  } catch (e) {}

  // 4) 补漏：处理老旧的 DOM0 级事件绑定
  try {
    // 强制将 window.onresize 置为空，防止通过 window.onresize = function... 方式注册的检测
    window.onresize = null;
  } catch (e) {}

  // 5) 注入成功反馈
  console.log(
    '[anti-resize] 视口防探测补丁已安装：',
    '锁定视口:', fixedInnerWidth + 'x' + fixedInnerHeight,
    '锁定外框:', fixedOuterWidth + 'x' + fixedOuterHeight
  );
})();
```

**缺点：**无法防御 `Media Queries` 检测。某些高级检测通过 CSS 媒体查询（如 `@media (max-width: 500px)`）修改某个隐藏元素的样式，再用 JS 判断该样式，这段脚本拦截不到

## 字符串拼接无限 Debugger 绕过

### 反调试原理

debugger 不写死，通过`de+'bugger'`字符串拼接、eval 动态执行、闭包嵌套生成，浏览器无法静态识别，Disable breakpoints 失效，打开 F12 必卡

（其余绕过方法与上面的无限 Debugger 相同）

### 方法一：Hook 脚本

1. 脚本启动瞬间，通过循环 `clearTimeout` 清空当前浏览器内存中所有的定时器。这是为了干掉那些已经在后台运行的、每隔几秒就弹一次 `debugger` 的检测逻辑
2. 建立一套“违禁词”过滤机制。它会将任何传入的函数或字符串转化成文本，检查其中是否包含类似 `debugger` 的非法关键字
3. 任何新产生的代码段在执行前都必须经过审计，一旦发现“debugger”，直接就地销毁（返回空或不执行），从而保证逆向分析时的执行流不被打断

```javascript
(function () {
  // =============== 1. 暴力清理阶段：清理历史遗留干扰 ===============
  // 很多反调试脚本在页面一加载就启动了定时器，此处采用“宁可错杀一千”的策略
  try {
    // 获取当前最高 ID，尝试停止之前所有可能存在的定时检测逻辑
    var maxId = window.setTimeout(function () {}, 0);
    for (var i = 0; i <= maxId; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
  } catch (e) {}

  try {
    // 针对 requestAnimationFrame（高频动画帧检测）进行清理
    // 某些高级检测会利用 RAF 的高频率来检测执行耗时，以此判断是否开启了调试
    if (window.requestAnimationFrame && window.cancelAnimationFrame) {
      var rafId = window.requestAnimationFrame(function () {});
      for (var j = 0; j <= rafId; j++) {
        window.cancelAnimationFrame(j);
      }
    }
  } catch (e) {}

  // =============== 2. 核心检测算法：特征码扫描 ===============
  /**
   * 审计执行代码：判断代码字符串中是否包含 debugger 关键字
   * 采用正则清理空白 + 拼接判断，防止网站使用 "de" + "bugger" 的简单绕过
   */
  function looksLikeDebuggerPayload(code) {
    if (!code) return false;
    var src = String(code);
    src = src.replace(/\s+/g, '').toLowerCase(); // 标准化处理
    if (src.indexOf('debugger') !== -1) return true;
    if (src.indexOf('debu' + 'gger') !== -1) return true; // 识别常见的字符串拼接对抗
    return false;
  }

  function looksLikeDebuggerFn(fn) {
    if (!fn) return false;
    if (typeof fn === 'function') {
      return looksLikeDebuggerPayload(fn.toString()); // 提取函数体源码进行审计
    }
    if (typeof fn === 'string') {
      return looksLikeDebuggerPayload(fn);
    }
    return false;
  }

  // =============== 3. 拦截网关 A：Hook 动态执行引擎 ===============
  // 很多混淆代码（如 OB 混淆）会通过 eval("debugger") 产生断点
  try {
    var _eval = window.eval;
    window.eval = function (code) {
      if (looksLikeDebuggerPayload(code)) {
        console.warn('[anti-adv-debug] 拦截了 eval 注入的 debugger 负载');
        return; // 直接拦截，拒绝执行
      }
      return _eval.apply(this, arguments);
    };

    // 劫持 Function 构造函数：new Function("debugger")() 是最常用的反调试手段
    var _Function = window.Function;
    window.Function = function () {
      var args = Array.prototype.slice.call(arguments);
      var body = args.length ? args[args.length - 1] : ''; // 函数体通常是最后一个参数
      if (looksLikeDebuggerPayload(body)) {
        console.warn('[anti-adv-debug] 拦截了 Function 构造器注入的 debugger');
        return function () {}; // 返回空函数，防止外部调用报错导致的执行流中断
      }
      return _Function.apply(this, args);
    };
  } catch (e) {}

  // =============== 4. 拦截网关 B：Hook 异步调度任务 ===============
  // 锁定定时器入口，确保后续动态生成的定时检测任务也无法进入执行队列
  try {
    var _setInterval = window.setInterval;
    var _setTimeout = window.setTimeout;
    var _raf = window.requestAnimationFrame;

    window.setInterval = function (handler, timeout) {
      if (looksLikeDebuggerFn(handler)) {
        console.warn('[anti-adv-debug] 拦截了带有 debugger 的定时任务(Interval)');
        return 0;
      }
      return _setInterval.apply(this, arguments);
    };

    window.setTimeout = function (handler, timeout) {
      if (looksLikeDebuggerFn(handler)) {
        console.warn('[anti-adv-debug] 拦截了带有 debugger 的延时任务(Timeout)');
        return 0;
      }
      return _setTimeout.apply(this, arguments);
    };

    if (typeof _raf === 'function') {
      window.requestAnimationFrame = function (callback) {
        if (looksLikeDebuggerFn(callback)) {
          console.warn('[anti-adv-debug] 拦截了带有 debugger 的动画帧请求');
          return 0;
        }
        return _raf.apply(this, arguments);
      };
    }
  } catch (e) {}

  console.log('[anti-adv-debug] 高级反调试审计系统已就绪');
})();
```

## Function.prototype.toString () 环境检测

### 反调试原理

正常模式下，函数 toString 返回**带空格的完整源码**；调试模式下，返回**无空格的压缩版 /native code**，通过这个差异判断是否打开 F12

### 方法一：Hook 脚本

1. 在当前页面创建一个全新的、不受干扰的 `iframe`。由于这个 `iframe` 是刚生成的，它内部的所有内置对象（如 `Object`, `Function`）及其原型链都是浏览器默认的
2. 从这个沙箱中把最原始的 `Function.prototype.toString` 方法“偷”出来
3. 用这个偷出来的原始方法替换掉当前页面的方法
4. 移除这个 `iframe`，让 DOM 树恢复原样

```javascript
(function () {
  // =============== 1. 借尸还魂：创建一个干净的沙箱环境 ===============
  // 创建一个隐藏的 iframe，它的目的是为了获取一个完全未被污染的执行环境（Clean Room）
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'about:blank'; // 空白页面保证了最原始的 JS 环境
  document.documentElement.appendChild(iframe);

  // 获取这个干净 iframe 的 window 对象
  var cleanWin = iframe.contentWindow || iframe.contentDocument.defaultView;
  if (!cleanWin) {
    console.warn('[anti-tostring] 无法获取干净的 window 对象');
    return;
  }

  try {
    // =============== 2. 核心窃取：提取原生的 toString 方法 ===============
    // 重点：我们要的是浏览器最原始、最纯净的 Function.prototype.toString
    // 因为当前页面的这个方法可能已经被网站的反爬脚本给篡改（Hook）过了
    var cleanToString = cleanWin.Function.prototype.toString;

    // =============== 3. 覆盖恢复：重写当前页面的原型方法 ===============
    // 将当前页面的 toString 替换为我们从干净沙箱里偷出来的那个
    Function.prototype.toString = function () {
      try {
        // 使用 call 调用最纯净的方法，确保返回的结果是真实的“native code”字符串
        return cleanToString.call(this);
      } catch (e) {
        // 万一报错，返回一个符合规范的占位符，避免检测逻辑报错崩溃
        return 'function () { /* toString restored */ }';
      }
    };

    console.log('[anti-tostring] 已利用干净 iframe 成功修复 Function.prototype.toString');
  } catch (e) {
    console.warn('[anti-tostring] 修复过程中出现错误:', e);
  }

  // =============== 4. 毁尸灭迹：移除临时沙箱 ===============
  // 任务完成，从 DOM 中删除 iframe，减少被网站脚本探测到这种“补环境”行为的概率
  document.documentElement.removeChild(iframe);
})();
```
