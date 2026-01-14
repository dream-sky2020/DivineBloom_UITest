import { world } from '@/game/ecs/world'
import { createLogger } from '@/utils/logger'

const logger = createLogger('DetectAreaSystem')

/**
 * DetectAreaSystem
 * 负责处理空间感知逻辑
 * 输出: 更新实体上的 detectArea.results
 */
export const DetectAreaSystem = {
  update(dt) {
    // 1. 获取所有具有 DetectArea 的实体
    const detectors = world.with('detectArea', 'position')

    // 2. 获取潜在目标 (目前主要优化为只检测玩家，后续可扩展)
    let player = null
    const players = world.with('player', 'position')
    for (const p of players) {
      player = p
      break
    }

    for (const entity of detectors) {
      // Defensive Check
      if (!entity.detectArea) {
        logger.warn(`Entity ${entity.id || 'N/A'} missing detectArea component!`);
        continue;
      }

      const detect = entity.detectArea
      detect.results = [] // 重置结果

      // Defensive Check for required arrays (ensure safe fallback if schema failed)
      if (!detect.includeTags) detect.includeTags = [];
      if (!detect.results) detect.results = [];

      // 目前只实现对 Player 的检测
      if (detect.target === 'player' || detect.includeTags.includes('player')) {
        if (player && this.checkCollision(entity, player, detect)) {
          // General Debug Log
          logger.debug(`Collision Detected! EntityType: ${entity.type}, ID: ${entity.id}, Target: Player`)

          if (entity.type === 'portal') {
            logger.debug(`Portal Details - Player: (${player.position.x.toFixed(2)}, ${player.position.y.toFixed(2)}), Center: (${(entity.position.x + detect.offset.x).toFixed(2)}, ${(entity.position.y + detect.offset.y).toFixed(2)})`)
          } else if (entity.type === 'enemy') {
            logger.debug(`Enemy Sight Triggered! ID: ${entity.id}`)
          } else if (entity.type === 'npc') {
            logger.debug(`NPC Interaction Range! ID: ${entity.id}`)
          }

          detect.results.push(player)
        }
      }

      // TODO: 如果 target 是 'actors'，则需要遍历所有 actors 并进行筛选
    }
  },

  checkCollision(detectorEntity, targetEntity, config) {
    // Type Guards & Defensive Checks
    if (!detectorEntity.position) {
      logger.error(`Detector entity missing position! ID: ${detectorEntity.id}`);
      return false;
    }
    if (!targetEntity.position) {
      logger.error(`Target entity missing position! ID: ${targetEntity.id}`);
      return false;
    }
    if (!config) {
      logger.error(`Missing config for checkCollision!`);
      return false;
    }

    const dPos = detectorEntity.position
    const tPos = targetEntity.position

    // 计算检测中心点 (加上偏移)
    const centerX = dPos.x + (config.offset?.x || 0)
    const centerY = dPos.y + (config.offset?.y || 0)

    if (config.shape === 'circle') {
      const dx = tPos.x - centerX
      const dy = tPos.y - centerY
      const distSq = dx * dx + dy * dy
      const radiusSq = (config.radius || 0) * (config.radius || 0)

      return distSq <= radiusSq
    }
    else if (config.shape === 'aabb' || config.shape === 'rect') { // Support both aabb and rect
      // 简单的 AABB 检测
      const halfW = (config.size?.w || 0) / 2
      const halfH = (config.size?.h || 0) / 2

      // 修正：如果 offset 是中心，那么：
      const minX = centerX - halfW
      const maxX = centerX + halfW
      const minY = centerY - halfH
      const maxY = centerY + halfH

      return tPos.x >= minX && tPos.x <= maxX &&
        tPos.y >= minY && tPos.y <= maxY
    }

    return false
  }
}
