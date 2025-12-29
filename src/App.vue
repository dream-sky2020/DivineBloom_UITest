<script setup>
import { reactive, ref, computed } from 'vue';

// 游戏状态
const hero = reactive({ hp: 120, maxHp: 120, mp: 45, maxMp: 45, atk: 12 });
const enemy = reactive({ hp: 100, maxHp: 100, atk: 8, name: '史莱姆', alive: true });
const game = reactive({
  isPlayerTurn: true,
  isAnimating: false,
  message: '',
  displayMessage: '' // 用于打字机效果显示的文字
});

// UI 状态
const selectedAction = ref('attack');
const damageNumbers = ref([]); // 存储飘字: { id, value, type, x, y }
let damageIdCounter = 0;

// 计算属性
const enemyHpPercent = computed(() => (enemy.hp / enemy.maxHp) * 100 + '%');

// 工具：打字机效果
const typeText = (text) => {
  return new Promise(resolve => {
    game.message = text;
    game.displayMessage = '';
    let i = 0;
    const interval = setInterval(() => {
      game.displayMessage += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(resolve, 500);
      }
    }, 30);
  });
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 动作逻辑
const actions = [
  { id: 'attack', label: '攻击' },
  { id: 'magic', label: '魔法' },
  { id: 'item', label: '物品' },
  { id: 'escape', label: '逃跑' }
];

const handleAction = async (actionId) => {
  if (!game.isPlayerTurn || game.isAnimating) return;
  selectedAction.value = actionId;

  if (actionId === 'attack') await playerAttack();
  else if (actionId === 'magic') await playerMagic();
  else if (actionId === 'item') await typeText('没有可用物品！');
  else if (actionId === 'escape') await typeText('无法逃跑！');
};

const playerAttack = async () => {
  game.isAnimating = true;
  await typeText('勇者 发起了攻击！');

  // 触发攻击动画（这里简单用 class 控制）
  const enemyEl = document.querySelector('.enemy');
  enemyEl?.classList.add('shake');

  const dmg = Math.floor(hero.atk * (1 + Math.random() * 0.2));
  enemy.hp = Math.max(0, enemy.hp - dmg);
  showDamage(dmg, 'enemy');

  await wait(500);
  enemyEl?.classList.remove('shake');

  if (enemy.hp <= 0) {
    enemy.alive = false;
    await typeText(`${enemy.name} 被击败了！`);
    // 游戏结束逻辑
  } else {
    game.isPlayerTurn = false;
    game.isAnimating = false;
    enemyTurn();
  }
};

const playerMagic = async () => {
  if (hero.mp < 5) {
    await typeText('MP 不足！');
    return;
  }
  game.isAnimating = true;
  hero.mp -= 5;
  const heal = 30;
  hero.hp = Math.min(hero.maxHp, hero.hp + heal);
  
  await typeText(`勇者 施放了回复术！恢复了 ${heal} 点 HP。`);
  game.isPlayerTurn = false;
  game.isAnimating = false;
  enemyTurn();
};

const enemyTurn = async () => {
  game.isAnimating = true;
  await wait(1000);
  await typeText(`${enemy.name} 发起了攻击！`);

  // 屏幕震动
  const container = document.querySelector('.game-container');
  container?.classList.add('shake');

  const dmg = Math.floor(enemy.atk * (1 + Math.random() * 0.5));
  hero.hp = Math.max(0, hero.hp - dmg);
  showDamage(dmg, 'hero');

  await wait(500);
  container?.classList.remove('shake');

  if (hero.hp <= 0) {
    await typeText('勇者 倒下了...');
  } else {
    game.isPlayerTurn = true;
    game.isAnimating = false;
    await typeText('轮到 勇者 行动了。');
  }
};

const showDamage = (amount, target) => {
  const id = damageIdCounter++;
  const style = target === 'enemy' 
    ? { left: '50%', top: '40%' }
    : { right: '10%', bottom: '30%', color: 'white' };
  
  damageNumbers.value.push({ id, amount, style });
  
  // 1秒后自动移除
  setTimeout(() => {
    damageNumbers.value = damageNumbers.value.filter(d => d.id !== id);
  }, 1000);
};

// 初始化
typeText('出现了一只野生的史莱姆！');

</script>

<template>
  <div class="game-container">
    <!-- Scene Layer -->
    <div class="scene-layer">
      <div class="background-environment">
        <div class="moon"></div>
        <div class="ground"></div>
      </div>

      <div class="enemies-container" v-if="enemy.alive">
        <div class="enemy">
          <div class="enemy-sprite"></div>
          <div class="enemy-shadow"></div>
          <div class="enemy-hp-bar">
            <div class="hp-fill" :style="{ width: enemyHpPercent }"></div>
          </div>
          <div class="enemy-name">{{ enemy.name }}</div>
        </div>
      </div>

      <!-- Damage Overlay -->
      <div class="damage-overlay">
        <div 
          v-for="d in damageNumbers" 
          :key="d.id"
          class="damage-number"
          :style="d.style"
        >
          {{ d.amount }}
        </div>
      </div>
    </div>

    <!-- Party Status -->
    <div class="party-status-layer">
      <div class="character-card active">
        <div class="char-name">勇者</div>
        <div class="char-stats">
          <div class="stat-row">
            <span class="label">HP</span>
            <span class="value">{{ hero.hp }}/{{ hero.maxHp }}</span>
          </div>
          <div class="stat-row">
            <span class="label">MP</span>
            <span class="value">{{ hero.mp }}/{{ hero.maxHp }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- UI Dashboard -->
    <div class="ui-dashboard">
      <div class="message-box">
        <p>{{ game.displayMessage }}</p>
        <div class="blinking-cursor" v-show="!game.isAnimating">▼</div>
      </div>

      <div class="command-menu">
        <div class="menu-title">指令</div>
        <ul class="action-list">
          <li 
            v-for="action in actions"
            :key="action.id"
            class="action-item"
            :class="{ selected: selectedAction === action.id }"
            @click="handleAction(action.id)"
          >
            {{ action.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles specific to this component if needed override global */
</style>

