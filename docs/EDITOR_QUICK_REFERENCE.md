# 编辑器快速参考指南

> 方便快速查找新的文件位置和导入路径

## 🔍 快速查找

### 我需要修改编辑器核心逻辑
📁 `src/game/editor/core/EditorCore.js`

### 我需要修改实体创建逻辑
📁 `src/game/editor/services/EntitySpawner.js`

### 我需要修改面板布局逻辑
📁 `src/game/editor/core/PanelLayoutService.js`

### 我需要修改面板配置
📁 `src/game/editor/config/PanelRegistry.js`
📁 `src/game/editor/config/WorkspacePresets.js`

### 我需要修改场景层级面板 UI
📁 `src/interface/editor/panels/HierarchyPanel.vue`

### 我需要修改属性检查器 UI
📁 `src/interface/editor/panels/InspectorPanel.vue`

### 我需要修改实体创建面板 UI
📁 `src/interface/editor/panels/EntityPalettePanel.vue`

### 我需要修改场景切换面板 UI
📁 `src/interface/editor/panels/SceneSwitcherPanel.vue`

## 📦 常用导入

```javascript
// 编辑器核心
import { editorManager } from '@/game/editor/core/EditorCore';

// 实体生成器
import { entitySpawner } from '@/game/editor/services/EntitySpawner';

// 能力定义
import { Capabilities } from '@/game/editor/core/EditorCapabilities';

// 面板基类
import EditorPanel from '@/interface/editor/components/EditorPanel.vue';

// 各个功能面板
import HierarchyPanel from '@/interface/editor/panels/HierarchyPanel.vue';
import InspectorPanel from '@/interface/editor/panels/InspectorPanel.vue';
import EntityPalettePanel from '@/interface/editor/panels/EntityPalettePanel.vue';
import SceneSwitcherPanel from '@/interface/editor/panels/SceneSwitcherPanel.vue';
import BattleLogPanel from '@/interface/editor/panels/BattleLogPanel.vue';
```

## 🎯 面板 ID 对照

配置中使用的面板 ID（保持不变）：
- `'scene-explorer'` → HierarchyPanel（场景层级）
- `'entity-properties'` → InspectorPanel（属性检查器）
- `'entity-creator'` → EntityPalettePanel（实体调色板）
- `'scene-manager'` → SceneSwitcherPanel（场景切换器）
- `'battle-log'` → BattleLogPanel（战斗日志）

## 📂 完整目录树

```
src/
├── game/
│   └── editor/                    # 编辑器业务逻辑层
│       ├── core/                  # 核心管理
│       │   ├── EditorCore.js
│       │   ├── PanelLayoutService.js
│       │   └── EditorCapabilities.js
│       ├── services/              # 业务服务
│       │   └── EntitySpawner.js
│       ├── config/                # 配置文件
│       │   ├── PanelRegistry.js
│       │   └── WorkspacePresets.js
│       └── README.md
│
└── interface/
    └── editor/                    # 编辑器 UI 组件层
        ├── components/            # 基础组件
        │   ├── EditorPanel.vue
        │   ├── TabbedPanelGroup.vue
        │   ├── PanelErrorBoundary.vue
        │   └── PanelNotFound.vue
        ├── panels/                # 功能面板
        │   ├── HierarchyPanel.vue
        │   ├── InspectorPanel.vue
        │   ├── EntityPalettePanel.vue
        │   ├── SceneSwitcherPanel.vue
        │   └── BattleLogPanel.vue
        └── README.md
```

## 🚀 开发工作流

### 添加新面板

1. **创建 Vue 组件**
   ```bash
   src/interface/editor/panels/MyNewPanel.vue
   ```

2. **在配置中注册**
   ```javascript
   // src/game/editor/config/PanelRegistry.js
   export const PANEL_TITLES = {
     'my-new-panel': '我的新面板'
   };
   
   export const PANEL_ICONS = {
     'my-new-panel': '🆕'
   };
   ```

3. **在 EditorCore 中导入**
   ```javascript
   // src/game/editor/core/EditorCore.js
   import MyNewPanel from '@/interface/editor/panels/MyNewPanel.vue';
   
   const PANEL_COMPONENTS = {
     'my-new-panel': markRaw(MyNewPanel)
   };
   ```

### 添加新业务服务

1. **创建服务类**
   ```bash
   src/game/editor/services/MyService.js
   ```

2. **导出单例或类**
   ```javascript
   export class MyService {
     // 实现
   }
   
   export const myService = new MyService();
   ```

3. **在需要的地方导入**
   ```javascript
   import { myService } from '@/game/editor/services/MyService';
   ```
