# 编辑器业务逻辑层

此目录包含编辑器的所有业务逻辑和核心功能，独立于 UI 框架。

## 📁 目录结构

```
src/game/editor/
├── core/                          # 核心管理
│   ├── EditorCore.js             # 编辑器核心管理器（原 EditorManager）
│   ├── PanelLayoutService.js     # 面板布局服务（原 LayoutManager）
│   └── EditorCapabilities.js     # 编辑器能力定义（原 Capabilities）
│
├── services/                      # 业务服务
│   └── EntitySpawner.js          # 实体生成器（原 EntityCreatorController）
│
└── config/                        # 配置文件
    ├── PanelRegistry.js          # 面板注册表（原 PanelDefinitions）
    └── WorkspacePresets.js       # 工作区预设（原 SystemSpecs）
```

## 🎯 主要组件

### EditorCore (核心管理器)
- **职责**: 编辑器的主入口，管理编辑器状态、面板布局和系统能力
- **导出**: `editorManager` 单例
- **使用**:
```javascript
import { editorManager } from '@/game/editor/core/EditorCore';

// 同步系统能力
editorManager.syncWithSystem('world-map');

// 选择实体
editorManager.selectedEntity = entity;

// 移动面板
editorManager.movePanel({...});
```

### PanelLayoutService (布局服务)
- **职责**: 管理面板布局的保存、加载和移动逻辑
- **静态方法**: `save()`, `load()`, `movePanel()`

### EntitySpawner (实体生成器)
- **职责**: 管理实体模板的分类、筛选和创建
- **导出**: `entitySpawner` 单例
- **使用**:
```javascript
import { entitySpawner } from '@/game/editor/services/EntitySpawner';

entitySpawner.createEntity(template);
```

## 🔧 配置文件

### PanelRegistry
定义所有面板的标题、图标和能力要求

### WorkspacePresets
定义系统规格和工作区预设布局

### EditorCapabilities
定义编辑器能力常量（ECS_EDITING, ENTITY_INSPECTION 等）

## 📝 命名规范

- **核心管理类**: `*Core.js`
- **服务类**: `*Service.js`, `*Spawner.js`
- **配置文件**: `*Registry.js`, `*Presets.js`, `*Capabilities.js`
