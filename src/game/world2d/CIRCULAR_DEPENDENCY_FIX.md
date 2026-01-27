# 循环依赖问题修复

## 问题描述

在实施 World2D 统一接口时，遇到了循环依赖问题：

```
Uncaught ReferenceError: Cannot access 'world2d' before initialization
```

## 根本原因

在模块顶层直接调用 `world2d` 的方法会导致循环依赖：

```javascript
// ❌ 错误：模块顶层调用
import { world2d } from '@world2d'
const world = world2d.getWorld()  // 此时 world2d 可能还未完全初始化
```

**循环依赖链：**
```
GameUI.vue 
  → 导入 world2d
    → world2d/index.js
      → World2DFacade.js
        → 导入 GameManager
          → 可能导入其他模块
            → 这些模块又导入 GameUI.vue（直接或间接）
              → 循环！
```

## 解决方案

### 方案 1: 延迟获取（推荐）

在**使用时**才获取，而不是在模块顶层：

```javascript
// ✅ 正确：延迟获取
import { world2d } from '@world2d'

const someFunction = () => {
  const world = world2d.getWorld()  // 在函数内获取
  // 使用 world
}
```

### 方案 2: 使用 Getter 函数

创建 getter 函数，避免立即执行：

```javascript
// ✅ 正确：使用 getter
import { world2d } from '@world2d'

const getWorld = () => world2d.getWorld()
const getRegistry = () => world2d.getEntityTemplateRegistry()

// 使用时
const world = getWorld()
const registry = getRegistry()
```

### 方案 3: 使用 Computed（Vue 组件）

在 Vue 组件中使用 computed：

```javascript
// ✅ 正确：使用 computed
import { computed } from 'vue'
import { world2d } from '@world2d'

const allTemplates = computed(() => {
  const registry = world2d.getEntityTemplateRegistry()
  return registry.getAll()
})
```

## 已修复的文件

### 1. `EntitySpawner.js`
**问题：**
```javascript
// ❌ 模块顶层调用
const entityTemplateRegistry = world2d.getEntityTemplateRegistry()
const world = world2d.getWorld()
```

**修复：**
```javascript
// ✅ 在 computed 中获取
this.allTemplates = computed(() => {
  const registry = world2d.getEntityTemplateRegistry()
  return registry.getAll()
})

// ✅ 在方法中获取
createEntity(template) {
  const world = world2d.getWorld()
  const entityTemplateRegistry = world2d.getEntityTemplateRegistry()
  // ...
}
```

### 2. `GameUI.vue`
**问题：**
```javascript
// ❌ 模块顶层调用
const world = world2d.getWorld()
const entityTemplateRegistry = world2d.getEntityTemplateRegistry()

// ❌ 使用了未导入的 getSystem
const editorInteraction = getSystem('editor-interaction')
```

**修复：**
```javascript
// ✅ 导入 getSystem
import { getSystem } from '@world2d'

// ✅ 在函数中获取
const handleEmptyRightClick = (mouseInfo) => {
  const entityTemplateRegistry = world2d.getEntityTemplateRegistry()
  // ...
}

const createEntityAtPosition = (templateId, x, y) => {
  const world = world2d.getWorld()
  const entityTemplateRegistry = world2d.getEntityTemplateRegistry()
  // ...
}
```

### 3. `CommandConsole.vue`
**问题：**
```javascript
// ❌ 模块顶层调用
const world = world2d.getWorld()
const entityTemplateRegistry = world2d.getEntityTemplateRegistry()
```

**修复：**
```javascript
// ✅ 使用 getter 函数
const getWorld = () => world2d.getWorld()
const getEntityTemplateRegistry = () => world2d.getEntityTemplateRegistry()

// 所有使用处改为调用 getter
const player = getWorld().with('player').first
const templates = getEntityTemplateRegistry().getAll()
```

### 4. `HierarchyPanel.vue`
**问题：**
```javascript
// ❌ 模块顶层调用
const world = world2d.getWorld()
```

**修复：**
```javascript
// ✅ 使用 getter 函数
const getWorld = () => world2d.getWorld()

// 所有使用处改为调用 getter
const syncData = () => {
  for (const entity of getWorld()) {
    // ...
  }
}
```

### 5. `InspectorPanel.vue`
**问题和修复同 HierarchyPanel.vue**

## 最佳实践

### ✅ 推荐做法

1. **永远不要在模块顶层调用 `world2d` 的方法**
   ```javascript
   // ❌ 不要这样
   import { world2d } from '@world2d'
   const world = world2d.getWorld()
   
   // ✅ 应该这样
   import { world2d } from '@world2d'
   const getWorld = () => world2d.getWorld()
   ```

2. **在函数/方法中获取**
   ```javascript
   function doSomething() {
     const world = world2d.getWorld()
     // 使用 world
   }
   ```

3. **Vue computed 中获取**
   ```javascript
   const data = computed(() => {
     const world = world2d.getWorld()
     return world.with('player').first
   })
   ```

### ❌ 避免的做法

1. **模块顶层立即调用**
   ```javascript
   // ❌ 会导致循环依赖
   const world = world2d.getWorld()
   ```

2. **在 class 构造函数外赋值**
   ```javascript
   // ❌ 可能导致问题
   class MyClass {
     world = world2d.getWorld()  // 在类字段初始化时调用
   }
   
   // ✅ 应该在构造函数或方法中
   class MyClass {
     constructor() {
       // 这样可以，但最好还是延迟获取
     }
     
     doSomething() {
       const world = world2d.getWorld()  // 最佳
     }
   }
   ```

## 为什么会有循环依赖？

### JavaScript 模块加载顺序

1. **解析阶段**：扫描所有 import/export，建立模块图
2. **实例化阶段**：创建模块的绑定（但不执行代码）
3. **执行阶段**：按依赖顺序执行模块代码

**循环依赖时的问题：**
- 模块 A 导入模块 B
- 模块 B 导入模块 A
- 当 A 执行时尝试访问 B 的导出
- 但 B 还在等待 A 完成初始化
- 导致访问未初始化的值

### World2D 的特殊情况

```
world2d/index.js
  ↓
World2DFacade.js (创建 world2d 单例)
  ↓
GameManager.js
  ↓
其他模块...
  ↓
GameUI.vue (尝试立即调用 world2d.getWorld())
  ↓ 
world2d 还未完全初始化！
```

## 解决思路

### 核心原则：延迟求值

通过**函数**或**computed**将获取操作延迟到真正需要时：

```javascript
// 立即求值（会立即执行）
const value = expensive()

// 延迟求值（返回函数，使用时才执行）
const getValue = () => expensive()
const value = getValue()  // 现在才执行
```

### 为什么 Getter 函数有效？

```javascript
// ❌ 立即执行
const world = world2d.getWorld()
// ↑ import 时就调用，world2d 可能还未初始化

// ✅ 延迟执行
const getWorld = () => world2d.getWorld()
// ↑ 只是定义函数，不执行
// ↓ 使用时才执行，此时 world2d 已初始化
const world = getWorld()
```

## 性能考虑

### Q: 每次都调用 getWorld() 会不会有性能问题？

A: **不会**，原因：
1. `getWorld()` 只是返回一个已存在的对象引用
2. 没有任何计算或创建操作
3. 相当于：`return this._world`

### Q: 是否应该缓存？

A: **不需要**，在函数内部获取即可：

```javascript
// ✅ 简单直接
function doSomething() {
  const world = world2d.getWorld()
  // 在这个函数作用域内可以反复使用 world
  const a = world.with('a').first
  const b = world.with('b').first
}
```

## 检测循环依赖

### 使用工具

```bash
# 安装 madge
npm install -g madge

# 检测循环依赖
madge --circular src/

# 生成依赖图
madge --image graph.png src/
```

### 手动检测

浏览器控制台错误信息：
- `Cannot access 'X' before initialization`
- `X is not defined` (但确实导入了)
- `Uncaught ReferenceError`

## 总结

**关键点：**
1. ✅ 永远不要在模块顶层调用 `world2d` 的方法
2. ✅ 使用 getter 函数或在使用时才获取
3. ✅ Vue 组件中使用 computed
4. ✅ 性能不是问题，getter 调用开销极小

**记住：**
> 延迟求值是解决循环依赖的黄金法则！
