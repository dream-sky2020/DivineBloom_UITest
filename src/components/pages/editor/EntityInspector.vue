<template>
  <div class="entity-inspector">
    <template v-if="entity">
      <div class="inspector-header">
        <h3>属性编辑: {{ entity.name || entity.type }}</h3>
        <button class="close-btn" @click="deselect">×</button>
      </div>

      <div class="inspector-body">
        <!-- 基础属性 -->
        <section class="prop-section">
          <h4>基础属性</h4>
          <div class="prop-group">
            <label>名称</label>
            <input v-model="entity.name" type="text" />
          </div>
          <div class="prop-group inline">
            <div class="field">
              <label>X</label>
              <input v-model.number="entity.position.x" type="number" />
            </div>
            <div class="field">
              <label>Y</label>
              <input v-model.number="entity.position.y" type="number" />
            </div>
          </div>
        </section>

        <!-- NPC 配置 -->
        <section v-if="entity.npc" class="prop-section">
          <h4>NPC配置</h4>
          <div class="prop-group">
            <label>对话 ID</label>
            <input v-model="entity.actionDialogue.dialogueId" type="text" @change="syncLegacyInteraction" />
          </div>
          <div class="prop-group">
            <label>对话范围</label>
            <input v-model.number="entity.detectArea.radius" type="number" @change="syncLegacyInteraction" />
          </div>
        </section>

        <!-- 传送门配置 -->
        <section v-if="entity.type === 'portal'" class="prop-section">
          <h4>传送门配置</h4>
          <div class="prop-group">
            <label>目标地图</label>
            <input v-model="entity.actionTeleport.mapId" type="text" />
          </div>
          <div class="prop-group">
            <label>目标入口</label>
            <input v-model="entity.actionTeleport.entryId" type="text" />
          </div>
          <div class="prop-group inline">
            <div class="field">
              <label>宽度</label>
              <input v-model.number="entity.detectArea.size.w" type="number" />
            </div>
            <div class="field">
              <label>高度</label>
              <input v-model.number="entity.detectArea.size.h" type="number" />
            </div>
          </div>
        </section>

        <!-- 视觉/缩放 -->
        <section v-if="entity.visual" class="prop-section">
          <h4>视觉</h4>
          <div class="prop-group">
            <label>资源 ID</label>
            <input v-model="entity.visual.id" type="text" />
          </div>
          <div class="prop-group">
            <label>缩放</label>
            <input v-model.number="entity.visual.scale" type="number" step="0.1" />
          </div>
        </section>
      </div>
    </template>
    <div v-else class="empty-state">
      <p>请选择一个实体进行编辑</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameManager } from '@/game/GameManager'

const entity = computed(() => gameManager.editor.selectedEntity)

const deselect = () => {
  gameManager.editor.selectedEntity = null
  // 如果 EditorInteractionSystem 也有引用，也需要清理
  if (gameManager.currentScene.value) {
    const interactionSystem = gameManager.currentScene.value.renderPipeline.find(s => s.selectedEntity !== undefined)
    if (interactionSystem) interactionSystem.selectedEntity = null
  }
}

// 同步旧系统的辅助函数（如果有的话）
const syncLegacyInteraction = () => {
  if (entity.value && entity.value.interaction) {
    if (entity.value.actionDialogue) {
      entity.value.interaction.id = entity.value.actionDialogue.dialogueId
    }
    if (entity.value.detectArea && entity.value.detectArea.radius) {
      entity.value.interaction.range = entity.value.detectArea.radius
    }
  }
}
</script>

<style scoped>
.entity-inspector {
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  color: white;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  z-index: 1000;
}

.inspector-header {
  padding: 12px 16px;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspector-header h3 {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
}

.inspector-body {
  padding: 16px;
  overflow-y: auto;
}

.prop-section {
  margin-bottom: 20px;
}

.prop-section h4 {
  margin: 0 0 10px 0;
  font-size: 12px;
  text-transform: uppercase;
  color: #3b82f6;
  letter-spacing: 0.05em;
}

.prop-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prop-group.inline {
  flex-direction: row;
  gap: 12px;
}

.prop-group.inline .field {
  flex: 1;
}

label {
  font-size: 11px;
  color: #64748b;
}

input {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 6px 8px;
  color: #f1f5f9;
  font-size: 13px;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}
</style>
