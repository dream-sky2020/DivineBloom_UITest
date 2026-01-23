<template>
  <div class="not-found-panel">
    <div class="error-icon">⚠️</div>
    <h3>面板未找到</h3>
    <p>ID: {{ panelId }}</p>
    <button @click="resetLayout">重置布局</button>
  </div>
</template>

<script setup>
import { editorManager } from '@/game/interface/editor/EditorManager'

const props = defineProps({
  panelId: String
})

const resetLayout = () => {
  if (confirm('确定要重置编辑器布局吗？这将清除所有自定义排列。')) {
    editorManager.resetToPreset('standard')
  }
}
</script>

<style scoped>
.not-found-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  color: #94a3b8;
  text-align: center;
  background: #1e293b;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

h3 {
  color: #f1f5f9;
  margin-bottom: 8px;
}

p {
  font-family: monospace;
  font-size: 12px;
  margin-bottom: 20px;
  background: #0f172a;
  padding: 4px 8px;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2563eb;
}
</style>
