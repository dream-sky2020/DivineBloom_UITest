<template>
  <div class="dev-tools-overlay">
    <div class="dev-tools-container">
      
      <!-- 头部 -->
      <div class="dev-tools-header">
        <h1 class="dev-tools-title">
          <span class="icon">🛠️</span>
          <span v-t="'dev.devTools.title'"></span>
        </h1>
        <div class="tabs-group">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="['tab-btn', { active: currentTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 标签内容 -->
      <div class="tab-content">
        <!-- 终端标签页 -->
        <div v-if="currentTab === 'terminal'" class="terminal-tab">
          <CommandConsole />
        </div>

        <!-- 验证器标签页 -->
        <div v-else-if="currentTab === 'validator'" class="validator-tab">
          <DataValidator />
        </div>

        <!-- 系统切换标签页 -->
        <div v-else-if="currentTab === 'systems'" class="system-switcher-tab">
          <div class="system-section">
            <h3 v-t="'dev.uiSwitcher'"></h3>
            <div class="system-buttons">
              <button 
                v-for="sys in gameSystems" 
                :key="sys.id"
                @click="switchSystem(sys.id)"
                :class="['system-button', { active: currentSystem === sys.id }]"
              >
                <span class="status-indicator" :class="{ active: currentSystem === sys.id }"></span>
                {{ sys.label }}
                <span class="button-label">{{ sys.description }}</span>
              </button>
            </div>
          </div>

          <div class="system-section">
            <h3 v-t="'dev.debugActions'"></h3>
            <div class="debug-actions">
              <button @click="toggleEditMode" :class="['debug-button', { active: isEditMode }]">
                {{ isEditMode ? '关闭编辑器 (Ctrl+E)' : '开启编辑器 (Ctrl+E)' }}
              </button>
              <button 
                v-if="currentSystem === 'world-map'" 
                @click="togglePause" 
                :class="['debug-button', { warn: world2d.state.isPaused }]"
              >
                {{ world2d.state.isPaused ? '恢复运行' : '暂停运行' }}
              </button>
              <button 
                v-if="currentSystem === 'world-map'"
                @click="exportScene" 
                class="debug-button"
              >
                {{ isEditMode ? '📥 导出场景布局' : '📸 捕捉运行快照' }}
              </button>
              <button @click="logState" class="debug-button">
                打印状态到控制台
              </button>
              <button @click="addGold" class="debug-button">
                添加 1000 金币
              </button>
            </div>
          </div>
        </div>

        <!-- 说明标签页 -->
        <div v-else-if="currentTab === 'info'" class="info-tab">
          <div class="info-section">
            <h3>📝 开发者工具说明</h3>
            <p>这是游戏的开发者工具集，提供命令行终端、数据验证、系统切换等调试功能。</p>
          </div>

          <div class="info-section">
            <h4>🖥️ 终端</h4>
            <p>提供命令行界面，可以执行各种开发调试命令：</p>
            <ul>
              <li><code>help</code> - 显示所有可用命令</li>
              <li><code>gold [数量]</code> - 添加金币</li>
              <li><code>spawn [实体ID]</code> - 在玩家位置生成实体</li>
              <li><code>sys [系统名]</code> - 切换到指定系统</li>
              <li><code>tp [x] [y]</code> - 传送玩家到指定坐标</li>
              <li><code>state</code> - 显示当前游戏状态</li>
              <li><code>pause/resume</code> - 暂停/恢复游戏</li>
              <li><code>edit</code> - 切换编辑器模式</li>
            </ul>
            <p>支持方向键↑↓浏览历史命令，Tab键自动补全。</p>
          </div>

          <div class="info-section">
            <h4>🔍 数据验证器</h4>
            <ul>
              <li>点击"开始验证"按钮验证所有游戏数据</li>
              <li>自动检查角色、技能、物品和状态数据是否符合 Schema 定义</li>
              <li>检查全局 ID 重复、跨实体引用有效性</li>
              <li>显示详细的错误路径、错误类型和修复建议</li>
            </ul>
          </div>

          <div class="info-section">
            <h4>🎮 系统切换</h4>
            <p>快速切换不同的游戏系统界面，并提供便捷的调试操作：</p>
            <ul>
              <li>一键切换主菜单、世界地图、战斗、商店、图鉴等系统</li>
              <li>开启/关闭编辑器模式</li>
              <li>暂停/恢复游戏运行</li>
              <li>导出场景数据</li>
              <li>添加测试资源</li>
            </ul>
          </div>

          <div class="info-section">
            <h4>⌨️ 快捷键</h4>
            <ul>
              <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> - 打开/关闭开发工具</li>
              <li><kbd>`</kbd> 或 <kbd>~</kbd> - 快速打开终端（游戏中）</li>
              <li><kbd>Ctrl</kbd> + <kbd>E</kbd> - 切换编辑器模式</li>
              <li><kbd>Esc</kbd> - 关闭开发工具</li>
            </ul>
          </div>

          <div class="info-section">
            <h4>💡 提示</h4>
            <ul>
              <li>开发工具界面会在游戏画面上叠加显示，不会遮挡背景</li>
              <li>玩家可以在游戏过程中随时打开终端输入命令</li>
              <li>使用命令行可以快速测试游戏功能，验证数据，定位 Bug</li>
              <li>所有调试操作都不会保存到存档，重启游戏即可恢复</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGameStore } from '@/stores/game';
import { world2d } from '@world2d'; // ✅ 使用统一接口
import { editorManager } from '@/game/editor/core/EditorCore';
import CommandConsole from '@/interface/dev/CommandConsole.vue';
import DataValidator from '@/interface/dev/DataValidator.vue';

defineEmits(['change-system']);

const { t } = useI18n();
const gameStore = useGameStore();

const currentTab = ref('terminal');
const currentSystem = computed(() => world2d.state.system);
const isEditMode = computed(() => editorManager.editMode);

const tabs = computed(() => [
  { id: 'terminal', label: t('dev.devTools.tabs.terminal') },
  { id: 'validator', label: t('dev.devTools.tabs.validator') },
  { id: 'systems', label: t('dev.devTools.tabs.systems') },
  { id: 'info', label: t('dev.devTools.tabs.info') }
]);

const gameSystems = computed(() => [
  { id: 'main-menu', label: t('dev.systems.mainMenu'), description: '开始画面' },
  { id: 'world-map', label: t('dev.systems.worldMap'), description: '2D 开放世界' },
  { id: 'battle', label: t('dev.systems.battle'), description: '战斗系统' },
  { id: 'shop', label: t('dev.systems.shop'), description: '购物界面' },
  { id: 'encyclopedia', label: t('dev.systems.encyclopedia'), description: '图鉴系统' },
  { id: 'list-menu', label: t('dev.systems.listMenu'), description: '菜单列表' }
]);

const switchSystem = (systemId) => {
  world2d.state.system = systemId;
};

const toggleEditMode = () => {
  world2d.toggleEditMode();
};

const togglePause = () => {
  if (world2d.state.isPaused) {
    world2d.resume();
  } else {
    world2d.pause();
  }
};

const exportScene = () => {
  // ✅ 使用统一 API 导出场景
  const bundle = world2d.exportCurrentScene();
  
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${mapId}_scene_export_${new Date().getTime()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const logState = () => {
  console.log('=== 游戏状态 ===');
  console.log('当前系统:', world2d.state.system);
  console.log('暂停状态:', world2d.state.isPaused);
  console.log('编辑模式:', editorManager.editMode);
  console.log('游戏商店:', gameStore);
  console.log('================');
};

const addGold = () => {
  gameStore.world2d.inventory.gold += 1000;
};
</script>

<style scoped src="@styles/pages/systems/DevToolsSystem.css"></style>
