<template>
  <div class="command-console">
    <div class="console-output" ref="outputContainer">
      <div v-for="(entry, idx) in history" :key="idx" :class="['console-line', entry.type]">
        <span v-if="entry.type === 'command'" class="prompt">></span>
        <span class="text">{{ entry.text }}</span>
      </div>
    </div>
    <div class="console-input-wrapper">
      <span class="prompt">></span>
      <input 
        ref="inputElement"
        v-model="currentInput"
        @keydown.enter="executeCommand"
        @keydown.up="historyUp"
        @keydown.down="historyDown"
        @keydown.tab.prevent="autocomplete"
        class="console-input"
        type="text"
        placeholder="输入命令 (help 查看帮助)"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useGameStore } from '@/stores/game';
import { world2d } from '@world2d'; // ✅ 使用统一接口

// ✅ 延迟获取函数（避免循环依赖）
const getWorld = () => world2d.getWorld();
const getEntityTemplateRegistry = () => world2d.getEntityTemplateRegistry();

const gameStore = useGameStore();
const currentInput = ref('');
const history = ref([]);
const commandHistory = ref([]);
const historyIndex = ref(-1);
const outputContainer = ref(null);
const inputElement = ref(null);

// 添加欢迎消息
onMounted(() => {
  addOutput('=== 开发者终端 v1.0 ===', 'system');
  addOutput('输入 "help" 查看可用命令', 'info');
  addOutput('', 'output');
  
  // 自动聚焦输入框
  if (inputElement.value) {
    inputElement.value.focus();
  }
});

const addOutput = (text, type = 'output') => {
  history.value.push({ text, type });
  nextTick(() => {
    if (outputContainer.value) {
      outputContainer.value.scrollTop = outputContainer.value.scrollHeight;
    }
  });
};

const executeCommand = () => {
  const cmd = currentInput.value.trim();
  if (!cmd) return;

  // 显示命令
  addOutput(cmd, 'command');
  
  // 保存到历史
  commandHistory.value.push(cmd);
  historyIndex.value = commandHistory.value.length;
  
  // 解析并执行
  parseCommand(cmd);
  
  // 清空输入
  currentInput.value = '';
};

const parseCommand = (cmd) => {
  const parts = cmd.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  try {
    switch (command) {
      case 'help':
        showHelp();
        break;
      case 'clear':
        history.value = [];
        break;
      case 'gold':
        cmdGold(args);
        break;
      case 'spawn':
        cmdSpawn(args);
        break;
      case 'sys':
      case 'system':
        cmdSystem(args);
        break;
      case 'list':
        cmdList(args);
        break;
      case 'tp':
      case 'teleport':
        cmdTeleport(args);
        break;
      case 'state':
        cmdState();
        break;
      case 'pause':
        cmdPause();
        break;
      case 'resume':
        cmdResume();
        break;
      case 'edit':
        cmdEdit();
        break;
      default:
        addOutput(`未知命令: ${command}`, 'error');
        addOutput('输入 "help" 查看可用命令', 'info');
    }
  } catch (e) {
    addOutput(`执行错误: ${e.message}`, 'error');
  }
};

const showHelp = () => {
  addOutput('', 'output');
  addOutput('=== 可用命令 ===', 'system');
  addOutput('help             - 显示此帮助信息', 'info');
  addOutput('clear            - 清空终端', 'info');
  addOutput('', 'output');
  addOutput('=== 游戏状态 ===', 'system');
  addOutput('state            - 显示当前游戏状态', 'info');
  addOutput('pause            - 暂停游戏', 'info');
  addOutput('resume           - 恢复游戏', 'info');
  addOutput('edit             - 切换编辑器模式', 'info');
  addOutput('', 'output');
  addOutput('=== 系统切换 ===', 'system');
  addOutput('sys <name>       - 切换系统界面', 'info');
  addOutput('  可用: world-map, battle, shop, encyclopedia, main-menu', 'info');
  addOutput('', 'output');
  addOutput('=== 资源管理 ===', 'system');
  addOutput('gold <amount>    - 添加金币', 'info');
  addOutput('spawn <id>       - 在玩家位置生成实体', 'info');
  addOutput('list <type>      - 列出实体模板', 'info');
  addOutput('  类型: all, gameplay, environment', 'info');
  addOutput('tp <x> <y>       - 传送玩家到指定坐标', 'info');
  addOutput('', 'output');
};

const cmdGold = (args) => {
  const amount = parseInt(args[0]);
  if (isNaN(amount)) {
    addOutput('用法: gold <数量>', 'error');
    return;
  }
  
  gameStore.world2d.inventory.gold += amount;
  addOutput(`✓ 已添加 ${amount} 金币，当前金币: ${gameStore.world2d.inventory.gold}`, 'success');
};

const cmdSpawn = (args) => {
  if (args.length === 0) {
    addOutput('用法: spawn <实体ID>', 'error');
    return;
  }

  const templateId = args[0];
  const template = getEntityTemplateRegistry().getTemplate(templateId);
  
  if (!template) {
    addOutput(`错误: 未找到模板 "${templateId}"`, 'error');
    addOutput('使用 "list all" 查看可用模板', 'info');
    return;
  }

  // 获取玩家位置
  const player = getWorld().with('player').first;
  if (!player || !player.position) {
    addOutput('错误: 无法获取玩家位置', 'error');
    return;
  }

  const x = Math.round(player.position.x);
  const y = Math.round(player.position.y);

  // 创建实体
  const globalEntity = getWorld().with('commands').first;
  if (globalEntity) {
    globalEntity.commands.queue.push({
      type: 'CREATE_ENTITY',
      payload: {
        templateId: templateId,
        position: { x, y }
      }
    });
    addOutput(`✓ 已在 (${x}, ${y}) 生成 "${template.name}"`, 'success');
  } else {
    addOutput('错误: 命令系统不可用', 'error');
  }
};

const cmdSystem = (args) => {
  if (args.length === 0) {
    addOutput('用法: sys <系统名>', 'error');
    addOutput('可用: world-map, battle, shop, encyclopedia, main-menu, list-menu', 'info');
    return;
  }

  const systemId = args[0];
  const validSystems = ['world-map', 'battle', 'shop', 'encyclopedia', 'main-menu', 'list-menu', 'dev-tools'];
  
  if (!validSystems.includes(systemId)) {
    addOutput(`错误: 未知系统 "${systemId}"`, 'error');
    addOutput('可用: ' + validSystems.join(', '), 'info');
    return;
  }

  world2d.state.system = systemId;
  addOutput(`✓ 已切换到系统: ${systemId}`, 'success');
};

const cmdList = (args) => {
  const type = args[0] || 'all';
  const templates = getEntityTemplateRegistry().getAll();
  
  let filtered = templates;
  if (type !== 'all') {
    filtered = templates.filter(t => t.category === type);
  }

  if (filtered.length === 0) {
    addOutput(`没有找到类型为 "${type}" 的模板`, 'info');
    return;
  }

  addOutput('', 'output');
  addOutput(`=== 实体模板 (${filtered.length}个) ===`, 'system');
  filtered.forEach(t => {
    addOutput(`${t.icon || '📦'} ${t.id.padEnd(20)} - ${t.name} [${t.category}]`, 'info');
  });
  addOutput('', 'output');
};

const cmdTeleport = (args) => {
  if (args.length < 2) {
    addOutput('用法: tp <x> <y>', 'error');
    return;
  }

  const x = parseFloat(args[0]);
  const y = parseFloat(args[1]);

  if (isNaN(x) || isNaN(y)) {
    addOutput('错误: 坐标必须是数字', 'error');
    return;
  }

  const player = getWorld().with('player').first;
  if (!player || !player.position) {
    addOutput('错误: 找不到玩家实体', 'error');
    return;
  }

  player.position.x = x;
  player.position.y = y;
  addOutput(`✓ 已传送到 (${x}, ${y})`, 'success');
};

const cmdState = () => {
  addOutput('', 'output');
  addOutput('=== 游戏状态 ===', 'system');
  addOutput(`当前系统: ${world2d.state.system}`, 'info');
  addOutput(`暂停状态: ${world2d.state.isPaused ? '是' : '否'}`, 'info');
  addOutput(`编辑模式: ${world2d.editor.editMode ? '开启' : '关闭'}`, 'info');
  addOutput(`当前地图: ${gameStore.world2d.currentMapId}`, 'info');
  addOutput(`金币: ${gameStore.world2d.inventory.gold}`, 'info');
  
  const player = getWorld().with('player').first;
  if (player && player.position) {
    addOutput(`玩家位置: (${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)})`, 'info');
  }
  addOutput('', 'output');
};

const cmdPause = () => {
  world2d.pause();
  addOutput('✓ 游戏已暂停', 'success');
};

const cmdResume = () => {
  world2d.resume();
  addOutput('✓ 游戏已恢复', 'success');
};

const cmdEdit = () => {
  world2d.toggleEditMode();
  const mode = world2d.editor.editMode ? '开启' : '关闭';
  addOutput(`✓ 编辑器模式已${mode}`, 'success');
};

const historyUp = () => {
  if (commandHistory.value.length === 0) return;
  
  if (historyIndex.value > 0) {
    historyIndex.value--;
    currentInput.value = commandHistory.value[historyIndex.value];
  }
};

const historyDown = () => {
  if (commandHistory.value.length === 0) return;
  
  if (historyIndex.value < commandHistory.value.length - 1) {
    historyIndex.value++;
    currentInput.value = commandHistory.value[historyIndex.value];
  } else {
    historyIndex.value = commandHistory.value.length;
    currentInput.value = '';
  }
};

const autocomplete = () => {
  const input = currentInput.value.trim().toLowerCase();
  if (!input) return;

  const commands = [
    'help', 'clear', 'gold', 'spawn', 'sys', 'system', 
    'list', 'tp', 'teleport', 'state', 'pause', 'resume', 'edit'
  ];

  const matches = commands.filter(cmd => cmd.startsWith(input));
  if (matches.length === 1) {
    currentInput.value = matches[0] + ' ';
  } else if (matches.length > 1) {
    addOutput('可能的命令: ' + matches.join(', '), 'info');
  }
};
</script>

<style scoped>
.command-console {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 0.5rem;
  overflow: hidden;
  font-family: 'Courier New', 'Consolas', monospace;
  color: #e2e8f0;
}

.console-output {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.console-line {
  margin-bottom: 0.25rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.console-line.command {
  color: #38bdf8;
  font-weight: 600;
}

.console-line.output {
  color: #cbd5e1;
}

.console-line.success {
  color: #4ade80;
}

.console-line.error {
  color: #f87171;
}

.console-line.warning {
  color: #fbbf24;
}

.console-line.info {
  color: #94a3b8;
}

.console-line.system {
  color: #a78bfa;
  font-weight: 700;
}

.prompt {
  color: #38bdf8;
  margin-right: 0.5rem;
  user-select: none;
}

.console-input-wrapper {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.console-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
}

.console-input::placeholder {
  color: #64748b;
}

/* 滚动条样式 */
.console-output::-webkit-scrollbar {
  width: 8px;
}

.console-output::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.console-output::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 4px;
}

.console-output::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
</style>
