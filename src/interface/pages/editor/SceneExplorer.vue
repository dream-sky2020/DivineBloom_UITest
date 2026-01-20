<template>
  <div class="scene-explorer">
    <div class="explorer-stats">
      <div class="stats-left">
        <span>实体: {{ entities.length }}</span>
        <span v-if="mapId" class="map-tag">{{ mapId }}</span>
      </div>
      <button class="export-btn" @click="handleExport" title="导出场景数据 (JSON)">
        📥
      </button>
    </div>

    <div class="explorer-body">
      <div 
        v-for="e in sortedEntities" 
        :key="e.uuid || e.id" 
        class="entity-item"
        :class="{ selected: selectedEntity === e }"
        @click="selectEntity(e)"
      >
        <div class="entity-info">
          <span v-if="e.globalManager" class="entity-type global">Global</span>
          <span v-else class="entity-type">{{ e.type || 'Unknown' }}</span>
          <span class="entity-name">{{ e.name || (e.globalManager ? 'Global Manager' : '(无名称)') }}</span>
        </div>
        <div class="entity-meta">
          <template v-if="e.position">
            <span>x: {{ Math.round(e.position?.x || 0) }}</span>
            <span>y: {{ Math.round(e.position?.y || 0) }}</span>
          </template>
          <template v-else-if="e.globalManager">
            <span class="global-tag">系统实体</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { world } from '@/game/ecs/world'
import { gameManager } from '@/game/ecs/GameManager'
import { ScenarioLoader } from '@/game/ecs/ScenarioLoader'

const entities = ref([])
const mapId = computed(() => gameManager.currentScene.value?.mapData?.id || '')
const selectedEntity = computed(() => gameManager.editor.selectedEntity)

const sortedEntities = computed(() => {
  return [...entities.value].sort((a, b) => {
    const typeA = a.type || ''
    const typeB = b.type || ''
    if (typeA !== typeB) return typeA.localeCompare(typeB)
    return (a.name || '').localeCompare(b.name || '')
  })
})

const selectEntity = (entity) => {
  gameManager.editor.selectedEntity = entity
}

const handleExport = () => {
  const mapId = gameManager.currentScene.value?.mapData?.id || 'unknown';
  const bundle = ScenarioLoader.exportScene(gameManager.engine, mapId);
  
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${mapId}_scene_export_${new Date().getTime()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

let rafId = 0
const syncData = () => {
  const allEntities = []
  for (const entity of world) {
    allEntities.push(entity)
  }
  entities.value = allEntities
  rafId = requestAnimationFrame(syncData)
}

onMounted(() => {
  syncData()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.scene-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.explorer-stats {
  padding: 6px 12px;
  background: #0f172a;
  border-bottom: 1px solid #334155;
  font-size: 11px;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.map-tag {
  background: #1e293b;
  color: #3b82f6;
  padding: 1px 6px;
  border-radius: 4px;
}

.export-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-btn:hover {
  background: #334155;
  color: #f1f5f9;
}

.explorer-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entity-item {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.entity-item:hover {
  background: #334155;
}

.entity-item.selected {
  background: #1e40af;
  border-color: #3b82f6;
}

.entity-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.entity-type {
  font-size: 9px;
  background: #0f172a;
  color: #3b82f6;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}

.entity-type.global {
  background: #7c3aed;
  color: #ede9fe;
}

.entity-name {
  font-size: 12px;
  color: #f1f5f9;
}

.entity-meta {
  font-size: 10px;
  color: #64748b;
  display: flex;
  gap: 8px;
}
</style>
