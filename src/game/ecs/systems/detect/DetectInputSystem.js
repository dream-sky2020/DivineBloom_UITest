import { world } from '@/game/ecs/world'
import { createLogger } from '@/utils/logger'

const logger = createLogger('DetectInputSystem')

/**
 * DetectInputSystem
 * 负责处理输入感知逻辑
 * 输出: 更新实体上的 detectInput.isPressed / justPressed
 */
export const DetectInputSystem = {
  update(dt) {
    // 获取玩家实体来读取输入意图 (PlayerIntentSystem 已经处理了原始输入)
    let player = null
    const players = world.with('player', 'playerIntent')
    for (const p of players) {
      player = p
      break
    }

    if (!player) return

    const detectors = world.with('detectInput')

    // Debug: Check if player intends to interact
    if (player.playerIntent.wantsToInteract) {
      // console.log('[DetectInputSystem] Player wants to interact (Global)')
    }

    for (const entity of detectors) {
      const input = entity.detectInput

      // 检查 'Interact' 键
      if (input.keys.includes('Interact')) {
        // 从 PlayerIntent 获取状态
        const wantsToInteract = player.playerIntent.wantsToInteract

        // Debug Log
        if (wantsToInteract) {
          logger.debug(`Input Detected on EntityType: ${entity.type}, ID: ${entity.id || entity.uuid}. IsPressed: ${input.isPressed} -> true`)
        }

        input.justPressed = wantsToInteract && !input.isPressed // 简单模拟 justPressed
        input.isPressed = wantsToInteract
      }
    }
  }
}
