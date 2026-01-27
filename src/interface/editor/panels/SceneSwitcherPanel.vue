<template>
  <EditorPanel 
    :title="editorManager.getPanelTitle('scene-manager')" 
    :icon="editorManager.getPanelIcon('scene-manager')" 
    :is-enabled="editorManager.isPanelEnabled('scene-manager')"
  >
    <template #header-actions>
      <div class="header-actions">
        <button class="icon-btn" @click="handleExportProject" title="导出全项目 (JSON)">
          📦 导出场景
        </button>
        <label class="icon-btn import-label" title="导入项目数据">
          📥 导入场景
          <input type="file" @change="handleImportProject" accept=".json" style="display: none;" />
        </label>
      </div>
    </template>

    <div class="panel-section">
      <div class="section-header">
        <span>场景列表</span>
      </div>
      <div class="scene-list">
        <div 
          v-for="mapId in availableMaps" 
          :key="mapId" 
          class="scene-item"
          :class="{ 
            active: currentMapId === mapId,
            loading: isLoading && loadingMapId === mapId,
            disabled: isLoading
          }"
          @click="switchMap(mapId)"
          @contextmenu="handleRightClick($event, mapId)"
        >
          <div class="scene-icon">{{ isLoading && loadingMapId === mapId ? '⏳' : '🗺️' }}</div>
          <div class="scene-info">
            <div class="scene-name">{{ mapId }}</div>
            <div class="scene-status">
              <template v-if="isLoading && loadingMapId === mapId">
                加载中...
              </template>
              <template v-else>
                {{ worldStore.worldStates[mapId] ? '已修改' : '默认配置' }}
              </template>
            </div>
          </div>
          <div v-if="currentMapId === mapId && !isLoading" class="active-indicator">当前</div>
        </div>
      </div>
    </div>
  </EditorPanel>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { schemasManager } from '@/schemas/SchemasManager'
import { useGameStore } from '@/stores/game'
import { world2d } from '@world2d' // ✅ 使用统一接口
import { editorManager } from '@/game/editor/core/EditorCore'
import { createLogger } from '@/utils/logger'
import EditorPanel from '../components/EditorPanel.vue'

const { openContextMenu } = inject('editorContextMenu');

const logger = createLogger('SceneSwitcherPanel')

const gameStore = useGameStore()
const worldStore = gameStore.world2d
const availableMaps = computed(() => schemasManager.mapIds)
const currentMapId = computed(() => worldStore.currentMapId)
const isLoading = ref(false)
const loadingMapId = ref('')

const handleRightClick = (e, mapId) => {
  const hasState = !!worldStore.worldStates[mapId];
  const items = [
    { 
      label: '重置场景数据', 
      icon: '♻️', 
      class: 'danger',
      disabled: !hasState,
      action: () => confirmResetMap(mapId) 
    }
  ];
  openContextMenu(e, items);
}

const confirmResetMap = (mapId) => {
  if (confirm(`确定要重置场景 "${mapId}" 的所有修改吗？此操作不可撤销。`)) {
    delete worldStore.worldStates[mapId];
    if (currentMapId.value === mapId) {
      // ✅ 使用统一 API 重新加载
      world2d.loadMap(mapId);
    }
    logger.info('Map state reset:', mapId);
  }
}

const switchMap = async (mapId) => {
  if (currentMapId.value === mapId || isLoading.value) return
  
  try {
    isLoading.value = true
    loadingMapId.value = mapId
    
    // 1. 保存当前地图状态
    if (world2d.currentScene.value) {
      worldStore.saveState(world2d.currentScene.value)
    }
    
    // 2. ✅ 使用统一 API 切换场景
    await world2d.loadMap(mapId)
  } catch (error) {
    logger.error('Failed to switch map:', error)
    alert(`切换地图失败: ${error.message}`)
  } finally {
    isLoading.value = false
    loadingMapId.value = ''
  }
}

const handleExportProject = async () => {
  // ✅ 使用兼容接口获取 ScenarioLoader（高级功能）
  const ScenarioLoader = world2d.getScenarioLoader()
  const bundle = await ScenarioLoader.exportProject(world2d.engine, worldStore.worldStates, schemasManager.mapLoaders)
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `scene_full_export_${new Date().getTime()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const handleImportProject = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const bundle = JSON.parse(e.target.result)
      // ✅ 使用兼容接口获取 ScenarioLoader
      const ScenarioLoader = world2d.getScenarioLoader()
      const newStates = ScenarioLoader.importProject(bundle)
      worldStore.bulkUpdateStates(newStates)
      alert('场景导入成功！请重新加载或切换地图。')
    } catch (err) {
      logger.error('Failed to import scene:', err)
      alert('导入失败：文件格式不正确')
    }
  }
  reader.readAsText(file)
}
</script>

<style scoped src="@styles/editor/SceneManager.css"></style>
