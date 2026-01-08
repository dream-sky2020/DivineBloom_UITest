import { world } from '@/game/ecs/world'

export const EnemyFactory = {
  create(data) {
    const { x, y, battleGroup, options = {} } = data

    // 默认值处理
    const isStunned = options.isStunned || false
    const visualId = options.spriteId || 'enemy_slime'
    const uuid = options.uuid || Math.random().toString(36).substr(2, 9)

    const entity = world.add({
      type: 'enemy', 
      position: { x, y },
      velocity: { x: 0, y: 0 },
      enemy: true,

      // [NEW ARCHITECTURE]
      trigger: {
        type: 'PROXIMITY',
        radius: 40 // Default encounter radius
      },
      actionBattle: {
        group: battleGroup || [],
        uuid: uuid
      },

      // [LEGACY COMPATIBILITY]
      interaction: {
        battleGroup: battleGroup || [],
        uuid: uuid
      },

      bounds: {
        minX: 0, maxX: 9999, 
        minY: 0, maxY: 9999
      },

      aiConfig: {
        type: options.aiType || 'wander',
        visionRadius: options.visionRadius || 120,
        visionType: options.visionType || 'circle',
        visionAngle: (options.visionAngle || 90) * (Math.PI / 180),
        visionProximity: options.visionProximity || 40,
        speed: options.speed || 80,
        suspicionTime: options.suspicionTime || 0,
        minYRatio: options.minYRatio || 0.35
      },

      aiState: {
        state: isStunned ? 'stunned' : 'wander',
        timer: isStunned ? (options.stunnedTimer || 3.0) : 0,
        suspicion: 0,
        moveDir: { x: 0, y: 0 },
        facing: { x: 1, y: 0 },
        colorHex: '#eab308', 
        alertAnim: 0,
        starAngle: 0,
        justEntered: true
      },

      visual: {
        id: visualId,
        state: isStunned ? 'stunned' : 'idle',
        frameIndex: 0,
        timer: 0,
        scale: options.scale || 1
      }
    })

    return entity
  }
}
