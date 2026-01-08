import { world } from '@/game/ecs/world'

export const NPCFactory = {
  create(data) {
    const { x, y, config = {} } = data

    // 简单的校验，防止配置错误导致默认值覆盖
    if (!config.dialogueId) {
      console.warn('[NPCFactory] NPC missing dialogueId, falling back to "welcome". Check map data structure.', data)
    }

    // 默认值逻辑来自原 NPC.js
    const dialogueId = config.dialogueId || 'welcome'
    const visualId = config.spriteId || 'npc_guide'

    const entity = world.add({
      type: 'npc',
      position: { x, y },
      npc: true,
      interaction: {
        type: 'dialogue',
        id: dialogueId,
        range: config.range || 60
      },
      // Body component (for collisions if implemented later, currently used for static property?)
      body: {
        static: true,
        radius: 15,
        width: 30,
        height: 30
      },
      bounds: { minX: 0, maxX: 9999, minY: 0, maxY: 9999 },

      visual: {
        id: visualId,
        state: 'default',
        frameIndex: 0,
        timer: 0,
        scale: config.scale || 0.8
      }
    })

    return entity
  }
}

