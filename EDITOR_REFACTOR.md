# 编辑器面板重构说明

## 📋 重构概述

本次重构按照**方案二：按职责分层**对编辑器系统进行了完整的重组，实现了业务逻辑和 UI 组件的清晰分离。

## 🎯 重构目标

1. ✅ **清晰的职责分离**: 业务逻辑 vs UI 组件
2. ✅ **统一的命名规范**: 一眼就能看出文件功能
3. ✅ **易于维护**: 按功能分组，结构清晰
4. ✅ **更好的扩展性**: 模块化设计，便于添加新功能

## 📁 新旧目录对照

### 业务逻辑层
```
旧路径: src/game/interface/editor/
新路径: src/game/editor/
```

| 旧文件名 | 新文件名 | 新路径 |
|---------|---------|--------|
| `EditorManager.js` | `EditorCore.js` | `src/game/editor/core/` |
| `EntityCreatorController.js` | `EntitySpawner.js` | `src/game/editor/services/` |
| `LayoutManager.js` | `PanelLayoutService.js` | `src/game/editor/core/` |
| `configs/Capabilities.js` | `EditorCapabilities.js` | `src/game/editor/core/` |
| `configs/PanelDefinitions.js` | `PanelRegistry.js` | `src/game/editor/config/` |
| `configs/SystemSpecs.js` | `WorkspacePresets.js` | `src/game/editor/config/` |

### UI 组件层
```
旧路径: src/interface/pages/editor/
新路径: src/interface/editor/
```

| 旧文件名 | 新文件名 | 新路径 |
|---------|---------|--------|
| `BasePanel.vue` | `EditorPanel.vue` | `src/interface/editor/components/` |
| `SceneExplorer.vue` | `HierarchyPanel.vue` | `src/interface/editor/panels/` |
| `EntityProperties.vue` | `InspectorPanel.vue` | `src/interface/editor/panels/` |
| `EntityCreator.vue` | `EntityPalettePanel.vue` | `src/interface/editor/panels/` |
| `SceneManager.vue` | `SceneSwitcherPanel.vue` | `src/interface/editor/panels/` |
| `BattleLogPanel.vue` | `BattleLogPanel.vue` | `src/interface/editor/panels/` |
| `NotFoundPanel.vue` | `PanelNotFound.vue` | `src/interface/editor/components/` |
| `PanelErrorBoundary.vue` | `PanelErrorBoundary.vue` | `src/interface/editor/components/` |
| `TabbedPanelGroup.vue` | `TabbedPanelGroup.vue` | `src/interface/editor/components/` |

## 🔄 导入路径更新

### 业务逻辑导入
```javascript
// 旧的导入
import { editorManager } from '@/game/interface/editor/EditorManager';
import { entityCreatorController } from '@/game/interface/editor/EntityCreatorController';

// 新的导入
import { editorManager } from '@/game/editor/core/EditorCore';
import { entitySpawner } from '@/game/editor/services/EntitySpawner';
```

### UI 组件导入
```javascript
// 旧的导入
import BasePanel from '@/interface/pages/editor/BasePanel.vue';
import SceneExplorer from '@/interface/pages/editor/SceneExplorer.vue';

// 新的导入
import EditorPanel from '@/interface/editor/components/EditorPanel.vue';
import HierarchyPanel from '@/interface/editor/panels/HierarchyPanel.vue';
```

## 📝 命名规范说明

### 业务逻辑层
- **核心管理**: `*Core.js` - 核心管理器和服务
- **业务服务**: `*Service.js`, `*Spawner.js` - 具体功能服务
- **配置文件**: `*Registry.js`, `*Presets.js`, `*Capabilities.js` - 配置和常量

### UI 组件层
- **面板组件**: `*Panel.vue` - 所有功能面板统一后缀
- **基础组件**: 语义化命名 - `EditorPanel`, `TabbedPanelGroup` 等

### 命名语义化对照
| 旧命名 | 新命名 | 说明 |
|-------|-------|------|
| SceneExplorer | HierarchyPanel | 更准确反映"场景层级"的概念 |
| EntityProperties | InspectorPanel | 借鉴 Unity 的 Inspector 命名 |
| EntityCreator | EntityPalettePanel | "调色板"更形象地描述模板选择 |
| SceneManager | SceneSwitcherPanel | 强调"切换"功能而非"管理" |

## ✅ 已更新的文件

以下文件的导入路径已自动更新：

### 核心系统
- ✅ `src/interface/pages/GameUI.vue`
- ✅ `src/game/ecs/GameManager.js`
- ✅ `src/game/ecs/WorldScene.js`

### 编辑器系统
- ✅ `src/game/ecs/systems/editor/EditorInteractionSystem.js`
- ✅ `src/game/ecs/systems/execute/ExecuteSystem.js`

## 🎨 样式文件

样式文件路径**保持不变**，仍在 `src/styles/editor/` 目录下：
- `SceneExplorer.css` → 对应 `HierarchyPanel.vue`
- `EntityProperties.css` → 对应 `InspectorPanel.vue`
- `EntityCreator.css` → 对应 `EntityPalettePanel.vue`
- `SceneManager.css` → 对应 `SceneSwitcherPanel.vue`
- `TabbedPanelGroup.css` → 对应 `TabbedPanelGroup.vue`

## 🔧 后续维护建议

1. **添加新面板**: 在 `src/interface/editor/panels/` 创建 `*Panel.vue` 文件
2. **添加新服务**: 在 `src/game/editor/services/` 创建 `*Service.js` 或 `*Spawner.js` 文件
3. **修改配置**: 编辑 `src/game/editor/config/` 下的配置文件
4. **扩展能力**: 在 `EditorCapabilities.js` 中添加新能力定义

## 📚 参考文档

- [业务逻辑层 README](src/game/editor/README.md)
- [UI 组件层 README](src/interface/editor/README.md)

## 🚀 优势总结

1. **职责清晰**: 业务逻辑在 `src/game/editor/`，UI 在 `src/interface/editor/`
2. **命名统一**: 所有面板都以 `*Panel.vue` 结尾，服务类以 `*Service.js` 结尾
3. **易于查找**: 按功能分组，新开发者可快速定位代码
4. **便于测试**: 业务逻辑与 UI 分离，更易进行单元测试
5. **扩展性强**: 模块化设计，添加新功能不影响现有代码

## ⚠️ 注意事项

- 所有旧路径的引用已自动更新
- 旧文件已完全删除
- 如有遗漏的引用，构建时会报错，请按照新的导入路径修复
