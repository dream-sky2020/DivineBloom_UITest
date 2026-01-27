# World2D 游戏引擎

基于 ECS (Entity Component System) 架构的 2D 游戏引擎，支持场景管理、物理系统、AI 行为、编辑器等功能。

## 快速开始

### 基础使用

```javascript
import { world2d } from '@world2d'

// 1. 初始化引擎
world2d.init(canvasElement)

// 2. 注册回调
world2d.registerCallbacks({
  onEncounter: (enemyGroup, enemyUuid) => {
    // 处理遭遇战
  },
  onInteract: (interaction) => {
    // 处理 NPC 交互
  }
})

// 3. 启动世界地图
await world2d.startWorldMap()

// 4. 加载地图
await world2d.loadMap('demo_plains', 'default')
```

### 状态查询

```javascript
// 获取玩家位置
const pos = world2d.getPlayerPosition()  // { x, y }

// 获取系统状态
const state = world2d.getSystemState()  // { system, isPaused, isInitialized }

// 获取调试信息
const debug = world2d.getDebugInfo()  // { playerX, playerY, mouseWorldX, ... }
```

### 场景管理

```javascript
// 切换地图
await world2d.loadMap('village', 'entrance')

// 导出场景数据
const bundle = world2d.exportCurrentScene()

// 序列化场景状态
const state = world2d.serializeCurrentScene()
```

### 实体操作

```javascript
// 生成实体
world2d.spawnEntity('enemy', { 
  x: 200, 
  y: 300, 
  enemyType: 'goblin' 
})

// 移除实体
world2d.removeEntity(entityId)
```

## 架构概览

```
外部接口 (world2d)
    ↓
┌──────────────────────┐
│  World2DFacade       │ ← 统一接口层
│  ────────────────    │
│  • 生命周期管理       │
│  • 场景管理           │
│  • 状态查询           │
│  • 命令执行           │
└──────────────────────┘
    ↓
┌──────────────────────┐
│  GameManager         │ ← 游戏管理器
│  ────────────────    │
│  • 循环控制           │
│  • 系统协调           │
└──────────────────────┘
    ↓
┌──────────────────────┐
│  WorldScene          │ ← 场景实例
│  ────────────────    │
│  • 系统管线           │
│  • 实体管理           │
└──────────────────────┘
    ↓
┌──────────────────────┐
│  ECS Systems         │ ← 各类系统
│  ────────────────    │
│  • 物理              │
│  • AI               │
│  • 渲染              │
│  • 输入              │
└──────────────────────┘
```

## 核心概念

### 1. ECS 架构
- **Entity**: 游戏对象（玩家、敌人、NPC 等）
- **Component**: 数据容器（位置、精灵、物理、AI 等）
- **System**: 逻辑处理器（移动、碰撞、渲染等）

### 2. 系统管线
游戏每帧按以下顺序执行系统：

```
Sense (感知)
  → Intent (意图)
    → Decision (决策)
      → Control (控制)
        → Physics (物理)
          → Execution (执行)
            → Render (渲染)
```

### 3. 场景管理
- **SceneManager**: 处理场景切换、资源加载
- **SceneLifecycle**: 管理场景生命周期
- **WorldScene**: 场景实例，包含系统和实体

### 4. 编辑器集成
- 支持实时编辑
- 实体检查器
- 场景层级视图
- 数据导入导出

## 目录结构

```
world2d/
├── World2DFacade.js      # 统一外部接口 ✨
├── index.js              # 导出入口 ✨
├── GameManager.js        # 游戏管理器
├── GameEngine.js         # 引擎核心
├── WorldScene.js         # 场景类
├── SceneManager.js       # 场景管理器
├── SystemRegistry.js     # 系统注册表
├── world.js              # ECS 世界实例
│
├── systems/              # 各类系统
│   ├── sense/           # 感知系统
│   ├── intent/          # 意图系统
│   ├── control/         # 控制系统
│   ├── physics/         # 物理系统
│   ├── execute/         # 执行系统
│   ├── render/          # 渲染系统
│   └── editor/          # 编辑器系统
│
├── entities/            # 实体定义
│   ├── components/      # 组件定义
│   ├── definitions/     # 实体模板
│   └── EntityManager.js # 实体管理器
│
├── resources/           # 资源管理
│   ├── AssetManager.js
│   └── SceneLifecycle.js
│
└── docs/                # 文档
    ├── MIGRATION_GUIDE.md
    └── REFACTORING_SUMMARY.md
```

## API 文档

### 生命周期

| 方法 | 说明 | 参数 |
|------|------|------|
| `init(canvas)` | 初始化引擎 | canvas: HTMLCanvasElement |
| `startWorldMap()` | 启动世界地图模式 | - |
| `startBattle()` | 启动战斗模式 | - |
| `pause()` | 暂停游戏 | - |
| `resume()` | 恢复游戏 | - |
| `destroy()` | 销毁引擎 | - |

### 场景管理

| 方法 | 说明 | 参数 |
|------|------|------|
| `loadMap(mapId, entryId)` | 加载地图 | mapId: string, entryId?: string |
| `getCurrentSceneInfo()` | 获取场景信息 | - |
| `serializeCurrentScene()` | 序列化场景 | - |
| `exportCurrentScene()` | 导出场景 Bundle | - |

### 状态查询

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getSystemState()` | 获取系统状态 | { system, isPaused, isInitialized } |
| `getPlayerPosition()` | 获取玩家位置 | { x, y } |
| `getDebugInfo()` | 获取调试信息 | { playerX, playerY, mouseWorldX, ... } |
| `getSceneEntities()` | 获取场景实体列表 | Entity[] |

### 命令执行

| 方法 | 说明 | 参数 |
|------|------|------|
| `spawnEntity(templateId, options)` | 生成实体 | templateId: string, options: object |
| `removeEntity(entityId)` | 移除实体 | entityId: number |
| `toggleEditMode()` | 切换编辑模式 | - |

### 回调注册

```javascript
world2d.registerCallbacks({
  onEncounter: (enemyGroup, enemyUuid) => void,
  onInteract: (interaction) => void,
  onSwitchMap: (mapId) => void,
  onOpenMenu: () => void,
  onOpenShop: () => void
})
```

## 编辑器高级用法

对于需要深度集成的编辑器功能，可以使用兼容性接口：

```javascript
import { world2d } from '@world2d'

// 获取 ECS World（编辑器专用）
const world = world2d.getWorld()

// 获取实体模板注册表
const registry = world2d.getEntityTemplateRegistry()

// 直接操作 ECS
for (const entity of world) {
  // ...
}
```

⚠️ **注意**：普通业务代码不应该使用这些接口，只有编辑器和调试工具才需要。

## 迁移指南

如果你的代码还在使用旧的导入方式，请参考：
- [📖 迁移指南](./MIGRATION_GUIDE.md)
- [📊 重构总结](./REFACTORING_SUMMARY.md)

### 快速迁移

```javascript
// ❌ 旧代码
import { gameManager } from '@world2d/GameManager'
import { world } from '@world2d/world'

gameManager.init(canvas)
const player = world.with('player').first

// ✅ 新代码
import { world2d } from '@world2d'

world2d.init(canvas)
const pos = world2d.getPlayerPosition()
```

## 最佳实践

### ✅ 推荐

```javascript
// 使用统一接口
import { world2d } from '@world2d'

// 使用 API 方法而不是直接访问内部状态
const pos = world2d.getPlayerPosition()

// 使用回调注册机制
world2d.registerCallbacks({ onEncounter, onInteract })
```

### ❌ 不推荐

```javascript
// 直接导入内部模块（除非是编辑器）
import { world } from '@world2d/world'
import { getSystem } from '@world2d/SystemRegistry'

// 直接操作 ECS（除非是编辑器）
const player = world.with('player').first
player.position.x = 100
```

## 性能优化

- **帧率控制**：引擎自动限制 dt 避免物理穿透
- **相机裁剪**：只渲染视口内的对象
- **实体池**：复用实体对象减少 GC
- **系统优化**：使用 Query 缓存减少遍历

## 常见问题

### Q: 如何访问 ECS World？
A: 使用 `world2d.getWorld()`，但仅限编辑器和调试场景。

### Q: 如何创建自定义实体？
A: 在 `entities/definitions/` 中定义，并注册到 `EntityTemplateRegistry`。

### Q: 如何添加新的系统？
A: 在 `systems/` 中创建，并在 `SystemRegistry` 中注册。

### Q: 为什么要使用 Facade？
A: 为了隔离内外部接口，提供更清晰的 API 和更好的可维护性。

## 贡献指南

欢迎贡献！请遵循以下原则：
1. 外部组件只使用 `world2d` 接口
2. 内部系统可以直接导入
3. 新增 API 需要更新文档
4. 重构需要保持向后兼容

## 许可证

MIT License
