<template>
  <div class="root">
    <canvas ref="cv" class="cv"></canvas>

    <!-- UI 层完全与游戏逻辑解耦，只负责展示数据 -->
    <div class="ui" v-if="debugInfo">
      <div><span v-t="'worldMap.position'"></span>: x={{ Math.round(debugInfo.x) }}, y={{ Math.round(debugInfo.y) }}</div>
      <div><span v-t="'worldMap.lastInput'"></span>: {{ debugInfo.lastInput || $t('common.unknown') }}</div>
      
      <!-- Enemy Alert Status -->
      <div v-if="debugInfo.chasingCount > 0" style="color: #ef4444; font-weight: bold;">
        ⚠️ {{ debugInfo.chasingCount }} Enemies Chasing!
      </div>
      
      <div v-t="'worldMap.moveControls'"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { GameEngine } from '@/game/GameEngine'
import { MainScene } from '@/game/scenes/MainScene'
import { useBattleStore } from '@/stores/battle'
import { useWorldStore } from '@/stores/world'

const emit = defineEmits(['change-system'])
const battleStore = useBattleStore()
const worldStore = useWorldStore()

const cv = ref(null)

// 使用 shallowRef 保存非响应式的复杂对象
const engine = shallowRef(null)
const scene = shallowRef(null)

// 专门用于 UI 展示的响应式数据
const debugInfo = ref({ x: 0, y: 0, lastInput: '' })

function syncUI() {
  if (!scene.value || !engine.value) return
  
  const player = scene.value.player
  
  // Count chasing enemies
  const chasingCount = scene.value.mapEnemies 
    ? scene.value.mapEnemies.filter(e => e.aiType === 'chase' && e.state === 'alert').length
    : 0

  // 每帧同步一次数据到 UI (Vue 的响应式系统足够快，处理单纯的文本更新没问题)
  debugInfo.value = {
    x: player.pos.x,
    y: player.pos.y,
    lastInput: engine.value.input.lastInput,
    chasingCount
  }
}

onMounted(async () => {
  if (!cv.value) return
  
  // 1. 初始化引擎
  const gameEngine = new GameEngine(cv.value)
  engine.value = gameEngine

  // 2. 初始化场景
  // 传入遇敌回调
  const initialState = worldStore.isInitialized ? {
    isInitialized: true,
    playerPos: worldStore.playerPos,
    enemies: worldStore.enemies
  } : null

  const mainScene = new MainScene(gameEngine, (enemyGroup) => {
      console.log('Enter Battle!', enemyGroup)
      // 1. Pause Engine (optional, but good practice)
      gameEngine.stop()

      // 2. Init Battle Data
      battleStore.initBattle(enemyGroup)

      // 3. Switch UI
      emit('change-system', 'battle')
  }, initialState)
  scene.value = mainScene
  
  // 3. 加载资源
  await mainScene.load()

  // 4. 绑定循环
  gameEngine.onUpdate = (dt) => {
    mainScene.update(dt)
    syncUI() // 同步数据给 Vue
  }
  
  gameEngine.onDraw = (renderer) => {
    mainScene.draw(renderer)
  }

  // 5. 启动
  gameEngine.start()
})

onUnmounted(() => {
  if (scene.value && scene.value.player) {
    worldStore.saveState(scene.value.player, scene.value.mapEnemies)
  }

  if (engine.value) {
    engine.value.destroy()
  }
})
</script>

<style scoped src="@styles/components/pages/systems/WorldMapSystem.css"></style>
