# 实体创建系统文档

## 概述

实体创建系统提供了在编辑模式下通过 UI 创建游戏实体的完整解决方案。该系统包括：

- **实体模板注册表**：统一管理所有可创建的实体类型
- **编辑器面板组件**：提供可视化的实体创建界面
- **命令系统集成**：通过命令队列处理实体创建请求
- **自动选中新实体**：创建后自动选中，方便立即编辑

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户界面层                              │
│  EntityCreator.vue (编辑器面板)                             │
│    ↓ 点击模板                                                │
│  发送 CREATE_ENTITY 命令                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      命令系统层                              │
│  Commands Component (命令队列)                               │
│    ↓                                                         │
│  ExecuteSystem.dispatch()                                   │
│    ↓                                                         │
│  ExecuteSystem.handleCreateEntity()                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      创建逻辑层                              │
│  EntityTemplateRegistry.createEntity()                      │
│    ↓                                                         │
│  调用对应实体的工厂方法                                      │
│    ↓                                                         │
│  NPCEntity.create() / DecorationEntity.create() 等          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      ECS 世界层                              │
│  world.add(entity)                                          │
│  自动选中新实体 → gameManager.editor.selectedEntity         │
└─────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. EntityTemplateRegistry (`EntityTemplateRegistry.js`)

实体模板注册表，负责管理所有可创建的实体类型。

#### 模板结构

```javascript
{
    id: 'npc',                    // 模板唯一标识
    name: 'NPC',                  // 显示名称
    description: '可交互的非玩家角色', // 描述
    icon: '🧑',                   // 图标 emoji
    category: 'gameplay',         // 分类
    factory: NPCEntity.create,    // 工厂函数
    getDefaultData: (mousePos) => ({ ... }) // 默认数据生成器
}
```

#### 已注册的实体模板

**游戏玩法类 (gameplay)**
- `npc` - NPC 角色
- `portal` - 传送门
- `portal_destination` - 传送点

**环境装饰类 (environment)**
- `decoration` - 装饰物（精灵）
- `decoration_rect` - 矩形装饰
- `obstacle` - 障碍物（AABB）
- `obstacle_circle` - 圆形障碍

#### API 方法

```javascript
// 获取单个模板
const template = entityTemplateRegistry.get('npc')

// 获取所有模板
const all = entityTemplateRegistry.getAll()

// 按分类获取
const gameplayEntities = entityTemplateRegistry.getByCategory('gameplay')

// 创建实体
const entity = entityTemplateRegistry.createEntity('npc', customData, mousePos)
```

### 2. EntityCreator 面板 (`EntityCreator.vue`)

可视化的实体创建界面，显示在编辑器左侧栏。

#### 功能特性

- **分类筛选**：按类型（全部/游戏玩法/环境装饰）过滤模板
- **网格布局**：卡片式展示所有可用模板
- **一键创建**：点击模板即可在场景中心创建实体
- **自动选中**：创建后自动选中新实体，方便编辑

#### 使用方法

1. 进入编辑模式（在大地图系统下点击"开启编辑器"）
2. 在左侧栏找到"创建实体"面板
3. 选择分类或使用"全部"查看所有模板
4. 点击想要创建的实体模板
5. 实体将在场景中心创建，并自动选中

### 3. 命令系统扩展 (`ExecuteSystem.js`)

新增 `CREATE_ENTITY` 命令类型。

#### 命令格式

```javascript
{
    type: 'CREATE_ENTITY',
    payload: {
        templateId: 'npc',           // 必需：模板 ID
        position: { x: 960, y: 540 }, // 可选：生成位置
        customData: { ... }           // 可选：自定义数据
    }
}
```

#### 发送命令示例

```javascript
// 通过全局命令队列
const globalEntity = world.with('commands').first
globalEntity.commands.queue.push({
    type: 'CREATE_ENTITY',
    payload: {
        templateId: 'npc',
        position: { x: 500, y: 300 }
    }
})
```

## 如何添加新的实体模板

### 步骤 1：确保实体定义完整

实体定义需要包含：
- `create()` 工厂方法
- `serialize()` 序列化方法
- Zod Schema 验证
- Inspector 字段映射

示例：

```javascript
// MyEntity.js
export const MyEntity = {
    create(data) {
        // 验证数据
        const result = MyEntitySchema.safeParse(data)
        if (!result.success) return null
        
        // 创建实体
        return world.add({
            type: 'my_entity',
            position: { x: data.x, y: data.y },
            // ... 其他组件
            inspector: Inspector.create({ fields: INSPECTOR_FIELDS })
        })
    },
    
    serialize(entity) {
        return { ... }
    }
}
```

### 步骤 2：在 EntityTemplateRegistry 中注册

在 `EntityTemplateRegistry.js` 的 `_initializeTemplates()` 方法中添加：

```javascript
import { MyEntity } from '../definitions/MyEntity'

// 在 _initializeTemplates() 中
this.register({
    id: 'my_entity',
    name: '我的实体',
    description: '这是一个自定义实体',
    icon: '⭐',
    category: 'gameplay', // 或 'environment'
    factory: MyEntity.create.bind(MyEntity),
    getDefaultData: (mousePos) => ({
        x: mousePos?.x || 400,
        y: mousePos?.y || 300,
        // ... 其他默认值
    })
})
```

### 步骤 3：测试

1. 重启开发服务器
2. 进入编辑模式
3. 在"创建实体"面板中查找新模板
4. 点击创建并测试

## 编辑器布局配置

实体创建器面板默认位于左侧栏。可以在 `GameManager.js` 中修改布局：

```javascript
this.editor = reactive({
    layout: {
        left: ['scene-manager', 'entity-creator', 'scene-explorer'],
        right: ['entity-properties']
    }
})
```

## 最佳实践

### 1. 合理的默认值

为模板提供合理的默认值，让用户创建后能够直接使用：

```javascript
getDefaultData: (mousePos) => ({
    x: mousePos?.x || 400,
    y: mousePos?.y || 300,
    name: 'NPC',
    config: {
        dialogueId: 'welcome',    // 确保对话 ID 存在
        spriteId: 'npc_guide',    // 确保资源 ID 存在
        range: 60,                 // 合理的交互范围
        scale: 0.8                 // 合适的缩放比例
    }
})
```

### 2. 清晰的分类

根据实体的用途选择合适的分类：
- `gameplay` - 影响游戏玩法的实体（NPC、敌人、传送门等）
- `environment` - 装饰和环境元素（装饰物、障碍物等）
- `system` - 系统级实体（全局管理器等，通常不需要模板）

### 3. 有意义的图标和描述

选择直观的 emoji 图标和清晰的描述：

```javascript
icon: '🧑',  // NPC 用人物图标
description: '可交互的非玩家角色，支持对话和任务'  // 说明功能
```

### 4. Inspector 字段映射

确保实体有完整的 Inspector 配置，方便编辑：

```javascript
const INSPECTOR_FIELDS = [
    { path: 'name', label: '显示名称', type: 'text' },
    { path: 'position.x', label: '坐标 X', type: 'number', props: { step: 1 } },
    { path: 'position.y', label: '坐标 Y', type: 'number', props: { step: 1 } },
    // ... 更多字段
]
```

## 故障排除

### 问题：点击模板没有反应

**可能原因**：
1. 命令队列未初始化
2. ExecuteSystem 未处理 CREATE_ENTITY 命令

**解决方案**：
- 检查 GlobalEntity 是否已创建
- 查看控制台是否有错误信息

### 问题：实体创建失败

**可能原因**：
1. 工厂方法验证失败
2. 默认数据不符合 Schema

**解决方案**：
- 检查控制台的验证错误信息
- 确保 `getDefaultData()` 返回的数据符合实体的 Schema

### 问题：创建的实体不可见

**可能原因**：
1. 位置超出地图范围
2. 缺少 visual 组件

**解决方案**：
- 使用场景中心作为默认位置
- 确保实体有正确的 visual 组件

## 未来扩展

### 计划功能

- [ ] 拖放创建：从面板拖动到画布创建
- [ ] 批量创建：一次创建多个实体
- [ ] 模板收藏：收藏常用模板
- [ ] 自定义模板：保存自定义配置为新模板
- [ ] 模板预览：显示实体的可视化预览
- [ ] 快捷键创建：使用快捷键快速创建

## 相关文件

- `src/game/ecs/entities/internal/EntityTemplateRegistry.js` - 模板注册表
- `src/interface/pages/editor/EntityCreator.vue` - 编辑器面板
- `src/game/ecs/systems/execute/ExecuteSystem.js` - 命令处理
- `src/game/ecs/GameManager.js` - 编辑器配置
- `src/interface/pages/GameUI.vue` - 面板集成

## 更新日志

### 2026-01-21
- ✅ 创建实体模板注册表系统
- ✅ 实现可视化创建面板
- ✅ 集成命令系统支持
- ✅ 添加 7 个预设实体模板
- ✅ 自动选中新创建的实体
- ✅ 完善文档和最佳实践
