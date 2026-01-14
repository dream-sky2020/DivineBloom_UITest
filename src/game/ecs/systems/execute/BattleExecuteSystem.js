import { world } from '@/game/ecs/world'
import { createLogger } from '@/utils/logger'

const logger = createLogger('BattleExecuteSystem')

export const BattleExecuteSystem = {
  handle(entity, callbacks) {
    if (entity.actionBattle) {
      const { group, uuid } = entity.actionBattle

      if (!group) {
        logger.warn('Missing enemy group in actionBattle')
        world.removeComponent(entity, 'actionBattle')
        return
      }

      logger.info(`Requesting battle with group:`, group)

      // Directly trigger the encounter callback (managed by GameManager)
      if (callbacks && callbacks.onEncounter) {
        callbacks.onEncounter(group, uuid)
      } else {
        logger.warn('onEncounter callback missing!')
      }

      // 如果是 Enemy (配置数据)，则保留组件；如果是临时 Action (如 Player 主动发起)，则移除
      // 目前 Enemy 的 actionBattle 也是配置，不能移除，否则逃跑后无法再次触发
      if (entity.type !== 'enemy') {
        world.removeComponent(entity, 'actionBattle')
      }
    }
  }
}
