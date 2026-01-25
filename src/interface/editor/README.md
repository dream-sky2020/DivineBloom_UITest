# 编辑器 UI 组件层

此目录包含编辑器的所有 Vue 组件，负责可视化呈现和用户交互。

## 📁 目录结构

```
src/interface/editor/
├── components/                    # 基础组件
│   ├── EditorPanel.vue           # 面板基类（原 BasePanel）
│   ├── TabbedPanelGroup.vue      # 标签面板组（保持不变）
│   ├── PanelErrorBoundary.vue    # 错误边界（保持不变）
│   └── PanelNotFound.vue         # 面板未找到（原 NotFoundPanel）
│
└── panels/                        # 功能面板
    ├── HierarchyPanel.vue        # 场景层级面板（原 SceneExplorer）
    ├── InspectorPanel.vue        # 属性检查器面板（原 EntityProperties）
    ├── EntityPalettePanel.vue    # 实体调色板面板（原 EntityCreator）
    ├── SceneSwitcherPanel.vue    # 场景切换面板（原 SceneManager）
    └── BattleLogPanel.vue        # 战斗日志面板（保持不变）
```

## 🎯 组件分类

### 基础组件 (components/)
可复用的通用编辑器组件，不包含具体业务逻辑

#### EditorPanel
- **用途**: 所有面板的基类组件
- **特性**: 
  - 标准化的标题栏
  - 操作按钮插槽
  - 锁定状态覆盖层
  - 底部插槽
- **使用**:
```vue
<EditorPanel 
  :title="editorManager.getPanelTitle('scene-explorer')" 
  :icon="editorManager.getPanelIcon('scene-explorer')" 
  :is-enabled="editorManager.isPanelEnabled('scene-explorer')"
>
  <!-- 内容 -->
  <template #header-actions>
    <!-- 头部操作按钮 -->
  </template>
  <template #footer>
    <!-- 底部提示信息 -->
  </template>
</EditorPanel>
```

#### TabbedPanelGroup
- **用途**: 管理多个面板的标签组
- **特性**: 拖放支持、动态布局

#### PanelErrorBoundary
- **用途**: 捕获面板错误，防止整个编辑器崩溃

#### PanelNotFound
- **用途**: 当面板组件未注册时显示的占位符

### 功能面板 (panels/)
具体的编辑器功能面板，包含业务逻辑

#### HierarchyPanel (场景层级)
- **原名**: SceneExplorer
- **功能**: 显示场景中所有实体的树形列表
- **特性**: 实体选择、删除、导出

#### InspectorPanel (属性检查器)
- **原名**: EntityProperties
- **功能**: 查看和编辑选中实体的属性
- **特性**: 声明式字段映射、实时编辑

#### EntityPalettePanel (实体调色板)
- **原名**: EntityCreator
- **功能**: 创建新实体
- **特性**: 分类筛选、模板预览

#### SceneSwitcherPanel (场景切换器)
- **原名**: SceneManager
- **功能**: 切换和管理场景
- **特性**: 场景列表、导入导出

#### BattleLogPanel (战斗日志)
- **功能**: 显示战斗日志
- **特性**: 日志清除、实时更新

## 📝 命名规范

- **面板组件**: `*Panel.vue`
- **基础组件**: 语义化命名，如 `EditorPanel.vue`, `TabbedPanelGroup.vue`

## 🎨 样式文件

面板样式文件仍保持在原位置：
- `src/styles/editor/SceneExplorer.css` → 用于 `HierarchyPanel.vue`
- `src/styles/editor/EntityProperties.css` → 用于 `InspectorPanel.vue`
- `src/styles/editor/EntityCreator.css` → 用于 `EntityPalettePanel.vue`
- `src/styles/editor/SceneManager.css` → 用于 `SceneSwitcherPanel.vue`

## 🔌 与业务逻辑层的交互

所有面板都通过导入 `editorManager` 和其他服务来访问业务逻辑：

```javascript
import { editorManager } from '@/game/editor/core/EditorCore';
import { entitySpawner } from '@/game/editor/services/EntitySpawner';
```

**不要在 UI 组件中实现复杂的业务逻辑**，而是调用业务逻辑层的服务。
