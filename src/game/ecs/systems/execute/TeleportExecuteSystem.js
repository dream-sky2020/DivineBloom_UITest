import { world } from '@/game/ecs/world'
import { SceneTransition } from '@/game/ecs/entities/components/Requests'
import { createLogger } from '@/utils/logger'

const logger = createLogger('TeleportSystem')

/**
 * Teleport System
 * 处理地图切换逻辑
 */
export const TeleportExecuteSystem = {
  handle(request, callbacks, mapData) {
    const entity = request.source
    const targetEntity = request.target

    logger.info('Handle called for entity:', entity.type)

    if (entity.actionTeleport) {
      const { mapId, entryId } = entity.actionTeleport

      // 判断是否是同地图传送 (Intra-map teleport)
      // 如果没有 mapId，或者 mapId 等于当前地图 ID
      const isLocal = !mapId || (mapData && mapId === mapData.id)

      if (isLocal) {
        if (!mapData || !mapData.entryPoints || !mapData.entryPoints[entryId]) {
          logger.warn(`Local teleport failed: Entry point ${entryId} not found in current map`)
          return
        }

        const spawn = mapData.entryPoints[entryId]
        
        // 如果有目标实体（通常是触发传送的玩家），则直接移动它
        if (targetEntity && targetEntity.position) {
          logger.info(`Local teleport: Moving ${targetEntity.type} to ${entryId} (${spawn.x}, ${spawn.y})`)
          targetEntity.position.x = spawn.x
          targetEntity.position.y = spawn.y
        } else {
          logger.warn('Local teleport failed: No target entity or target has no position')
        }
        
        // 移除临时 Action (如果是)
        if (entity.type !== 'portal') {
          world.removeComponent(entity, 'actionTeleport')
        }
        return
      }

      // 跨地图传送逻辑 (Cross-map transition)
      logger.info(`Triggering transition to ${mapId}:${entryId}`)

      // 给实体添加切换场景请求，交由 WorldScene → SceneManager 处理
      world.addComponent(entity, 'sceneTransition', SceneTransition({
        mapId,
        entryId
      }))

      // 如果不是 Portal (例如 Player 的临时 Action)，则移除组件
      if (entity.type !== 'portal') {
        world.removeComponent(entity, 'actionTeleport')
      }

      logger.info(`Requesting transition to map: ${mapId}, entry: ${entryId}`)
    } else {
      logger.warn('Entity missing actionTeleport component!', entity)
    }
  }
}
