import { world } from '@/game/ecs/world'
import { PlayerConfig } from '@/data/assets'

export const PlayerFactory = {
  create(data) {
    const { x, y, scale } = data

    const entity = world.add({
      type: 'player', // 方便序列化识别
      position: { x, y },
      velocity: { x: 0, y: 0 },

      // 玩家特有属性
      input: true,
      player: true, // Tag

      // 移动参数 (来自 PlayerConfig 或默认)
      speed: PlayerConfig.speed || 200,
      fastSpeed: PlayerConfig.fastSpeed || 320,

      bounds: {
        minX: 0, maxX: 9999, // 由 EnvironmentSystem 更新
        minY: 0, maxY: 9999
      },

      visual: {
        id: 'hero',
        state: 'idle',
        frameIndex: 0,
        timer: 0,
        scale: scale || 0.7
      }
    })

    return entity
  }
}

