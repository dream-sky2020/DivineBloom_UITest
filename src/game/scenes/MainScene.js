import { Player } from '@/game/entities/Player'
import { MapEnemy } from '@/game/entities/MapEnemy'

/**
 * @typedef {import('@/game/GameEngine').GameEngine} GameEngine
 * @typedef {import('@/game/GameEngine').Renderer2D} Renderer2D
 */

export class MainScene {
  /**
   * @param {GameEngine} engine 
   * @param {Function} [onEncounter] - Callback when player encounters enemy
   * @param {object} [initialState] - Saved state to restore
   */
  constructor(engine, onEncounter, initialState = null) {
    this.engine = engine
    this.onEncounter = onEncounter
    this.player = new Player(engine)

    // Map Enemies
    this.mapEnemies = []

    if (initialState && initialState.isInitialized) {
      this._restoreState(initialState)
    } else {
      // Add some test enemies
      this._spawnEnemies()
    }

    // 统一实体列表
    this.entities = [this.player, ...this.mapEnemies]

    this.isLoaded = false
  }

  _restoreState(state) {
    // Restore Player
    if (state.playerPos) {
      this.player.pos.x = state.playerPos.x
      this.player.pos.y = state.playerPos.y
    }

    // Restore Enemies
    if (state.enemies) {
      this.mapEnemies = state.enemies.map(data => {
        return new MapEnemy(this.engine, data.x, data.y, data.battleGroup, {
          player: this.player,
          ...data.options
        })
      })
    }
  }

  _spawnEnemies() {
    // Spawn configured enemies for testing AI
    this.mapEnemies = []

    // 1. Chasers (Wolf)
    for (let i = 0; i < 2; i++) {
      const x = 300 + Math.random() * 500
      const y = 300 + Math.random() * 300
      // Use DB ID 203 (Wolf)
      const group = [{ id: 203 }]

      const enemy = new MapEnemy(this.engine, x, y, group, {
        player: this.player,
        aiType: 'chase',
        visionRadius: 200,
        speed: 110
      })
      this.mapEnemies.push(enemy)
    }

    // 2. Fleers (Bat)
    for (let i = 0; i < 2; i++) {
      const x = 300 + Math.random() * 500
      const y = 300 + Math.random() * 300
      // Use DB ID 202 (Bat)
      const group = [{ id: 202 }]

      const enemy = new MapEnemy(this.engine, x, y, group, {
        player: this.player,
        aiType: 'flee',
        visionRadius: 150,
        speed: 130
      })
      this.mapEnemies.push(enemy)
    }

    // 3. Wanderers (Slime)
    for (let i = 0; i < 2; i++) {
      const x = 300 + Math.random() * 500
      const y = 300 + Math.random() * 300
      // Use DB ID 201 (Slime)
      const group = [{ id: 201 }]

      const enemy = new MapEnemy(this.engine, x, y, group, {
        player: this.player,
        aiType: 'wander',
        visionRadius: 100,
        speed: 60
      })
      this.mapEnemies.push(enemy)
    }

    // 4. Guards (Heavy Guard)
    for (let i = 0; i < 2; i++) {
      const x = 300 + Math.random() * 500
      const y = 300 + Math.random() * 300
      // Use DB ID 204 (Heavy Guard)
      const group = [{ id: 204 }]

      const enemy = new MapEnemy(this.engine, x, y, group, {
        player: this.player,
        aiType: 'chase',
        visionType: 'cone',
        visionAngle: 75, // 75 degrees cone
        visionRadius: 250,
        speed: 90
      })
      this.mapEnemies.push(enemy)
    }
  }

  async load() {
    // 统一加载资源
    const sheetUrl = this._buildTinySpriteSheetDataURL()
    await this.engine.textures.load('sheet', sheetUrl)

    this.isLoaded = true
  }

  /**
   * @param {number} dt 
   */
  update(dt) {
    if (!this.isLoaded) return

    // 更新所有实体
    this.entities.forEach(ent => {
      if (ent.update) ent.update(dt)
    })

    // Check Collisions
    this._checkEncounters()

    // 摄像机跟随玩家 (简单示例)
    // this.engine.renderer.setCamera(this.player.pos.x - 400, 0)
    this.engine.renderer.setCamera(0, 0)
  }

  _checkEncounters() {
    if (!this.onEncounter) return

    const p = this.player.pos
    const detectionRadius = 40 // simple hit box distance

    for (let i = this.mapEnemies.length - 1; i >= 0; i--) {
      const enemy = this.mapEnemies[i]
      const dx = p.x - enemy.pos.x
      const dy = p.y - enemy.pos.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < detectionRadius) {
        // Trigger Encounter!
        console.log('Encounter triggered with enemy index:', i)

        // Remove from map
        this.mapEnemies.splice(i, 1)
        this.entities = this.entities.filter(e => e !== enemy)

        // Callback
        this.onEncounter(enemy.battleGroup)
        return // Trigger one at a time
      }
    }
  }

  /**
   * @param {Renderer2D} renderer 
   */
  draw(renderer) {
    // 1. 绘制背景/地面
    this._drawEnvironment(renderer)

    if (!this.isLoaded) return

    // 2. 绘制所有实体
    // 简单的 Y-sort (根据 Y 轴排序，实现遮挡关系)
    this.entities.sort((a, b) => a.pos.y - b.pos.y)

    this.entities.forEach(ent => {
      if (ent.draw) ent.draw(renderer)
    })
  }

  /**
   * @param {Renderer2D} renderer 
   */
  _drawEnvironment(renderer) {
    const { width, height } = this.engine

    // 草地背景
    renderer.drawRect(0, height * 0.35, width, height * 0.65, '#bbf7d0')

    // 一些装饰块 (模拟之前的 drawGround)
    // 注意：Renderer2D 需要有 drawRect 方法 (我们在 GameEngine 重构时添加了)
    renderer.drawRect(80, height * 0.55, 140, 18, 'rgba(0,0,0,0.10)')
    renderer.drawRect(260, height * 0.70, 200, 18, 'rgba(0,0,0,0.10)')
  }

  // 辅助：生成资源 URL
  _buildTinySpriteSheetDataURL() {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <rect width="32" height="32" fill="none"/>
      <ellipse cx="16" cy="26" rx="9" ry="4" fill="rgba(0,0,0,0.25)"/>
      <circle cx="16" cy="10" r="6" fill="#0f172a"/>
      <rect x="11" y="16" width="10" height="10" rx="2" fill="#ef4444"/>
      <rect x="9" y="20" width="4" height="7" rx="1" fill="#ef4444"/>
      <rect x="19" y="20" width="4" height="7" rx="1" fill="#ef4444"/>
    </svg>`
    const encoded = encodeURIComponent(svg)
    return `data:image/svg+xml;charset=utf-8,${encoded}`
  }
}

