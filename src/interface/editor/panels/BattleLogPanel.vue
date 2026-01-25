<template>
  <EditorPanel 
    :title="editorManager.getPanelTitle('battle-log')" 
    :icon="editorManager.getPanelIcon('battle-log')" 
    :is-enabled="editorManager.isPanelEnabled('battle-log')"
  >
    <template #header-actions>
      <button 
        class="clear-btn" 
        @click="battleStore.clearLog()" 
        title="清除日志"
        :disabled="battleStore.battleLog.length === 0"
      >
        🗑️
      </button>
    </template>

    <div class="battle-log-panel-wrapper">
      <div v-if="battleStore.battleLog.length === 0" class="empty-state">
        等待战斗日志...
      </div>
      <BattleLog v-else :battle-log="battleStore.battleLog" />
    </div>
  </EditorPanel>
</template>

<script setup>
import { useBattleStore } from '@/stores/battle';
import { editorManager } from '@/game/editor/core/EditorCore';
import EditorPanel from '../components/EditorPanel.vue';
import BattleLog from '@/interface/ui/BattleLog.vue';

const battleStore = useBattleStore();
</script>

<style scoped>
.battle-log-panel-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--editor-bg-dark, #0f172a);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--editor-text-muted, #64748b);
  font-style: italic;
  font-size: 0.9rem;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.6;
  transition: all 0.2s;
}

.clear-btn:hover:not(:disabled) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.clear-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

:deep(.battle-log-container) {
  background: transparent !important;
  border: none !important;
  padding: 8px !important;
  height: 100% !important;
  position: relative !important;
  top: 0 !important;
  right: 0 !important;
  width: 100% !important;
}

:deep(.log-entry) {
  text-shadow: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
</style>
