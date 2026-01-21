<template>
  <div class="entity-creator">
    <!-- 分类筛选 -->
    <div class="category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['category-tab', { active: activeCategory === cat.id }]"
        @click="activeCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- 实体模板列表 -->
    <div class="templates-container">
      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          @click="createEntity(template)"
          :title="template.description"
        >
          <div class="template-icon">{{ template.icon }}</div>
          <div class="template-info">
            <div class="template-name">{{ template.name }}</div>
            <div class="template-desc">{{ template.description }}</div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <p>该分类暂无可用模板</p>
      </div>
    </div>

    <!-- 创建提示 -->
    <div class="creator-hint">
      <div class="hint-item">
        <span class="hint-icon">💡</span>
        <span class="hint-text">点击模板即可在场景中心创建实体</span>
      </div>
      <div class="hint-item">
        <span class="hint-icon">🎯</span>
        <span class="hint-text">实体创建后可在画布中拖动调整位置</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { entityTemplateRegistry } from '@/game/ecs/entities/internal/EntityTemplateRegistry'
import { world } from '@/game/ecs/world'
import { gameManager } from '@/game/ecs/GameManager'
import { createLogger } from '@/utils/logger'

const logger = createLogger('EntityCreator')

// 分类定义
const categories = [
  { id: 'all', name: '全部', icon: '📦' },
  { id: 'gameplay', name: '游戏玩法', icon: '🎮' },
  { id: 'environment', name: '环境装饰', icon: '🌲' }
]

const activeCategory = ref('all')

// 获取所有模板
const allTemplates = computed(() => entityTemplateRegistry.getAll())

// 根据分类过滤模板
const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') {
    return allTemplates.value
  }
  return allTemplates.value.filter(t => t.category === activeCategory.value)
})

/**
 * 创建实体
 */
const createEntity = (template) => {
  try {
    // 获取场景中心位置作为默认生成位置
    const camera = world.with('camera').first?.camera
    const centerX = camera?.x || 960
    const centerY = camera?.y || 540

    // 通过命令系统创建实体
    const globalEntity = world.with('commands').first
    if (globalEntity) {
      globalEntity.commands.queue.push({
        type: 'CREATE_ENTITY',
        payload: {
          templateId: template.id,
          position: { x: centerX, y: centerY }
        }
      })
      logger.info(`Entity creation requested: ${template.name}`)
    } else {
      // 降级方案：直接创建
      const entity = entityTemplateRegistry.createEntity(template.id, null, { x: centerX, y: centerY })
      if (entity) {
        logger.info(`Entity created directly: ${template.name}`, entity)
        // 自动选中新创建的实体
        gameManager.editor.selectedEntity = entity
      }
    }
  } catch (error) {
    logger.error('Failed to create entity:', error)
    alert(`创建实体失败: ${error.message}`)
  }
}
</script>

<style scoped>
.entity-creator {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: #0f172a;
  border-bottom: 1px solid #334155;
  overflow-x: auto;
}

.category-tab {
  padding: 6px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-tab:hover {
  background: #334155;
  color: #f1f5f9;
  border-color: #475569;
}

.category-tab.active {
  background: #1e40af;
  color: white;
  border-color: #3b82f6;
}

/* 模板容器 */
.templates-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

/* 模板卡片 */
.template-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 100px;
}

.template-card:hover {
  background: #334155;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.template-card:active {
  transform: translateY(0);
}

.template-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.template-name {
  font-size: 12px;
  font-weight: 600;
  color: #f1f5f9;
}

.template-desc {
  font-size: 10px;
  color: #64748b;
  line-height: 1.4;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #64748b;
  font-size: 12px;
}

/* 提示区域 */
.creator-hint {
  padding: 8px 12px;
  background: #0f172a;
  border-top: 1px solid #334155;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #64748b;
}

.hint-icon {
  font-size: 14px;
}

.hint-text {
  line-height: 1.4;
}

/* 滚动条样式 */
.templates-container::-webkit-scrollbar {
  width: 6px;
}

.templates-container::-webkit-scrollbar-track {
  background: #0f172a;
}

.templates-container::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

.templates-container::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
