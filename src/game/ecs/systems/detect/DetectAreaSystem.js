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

    // 2. 获取所有具备被探测资格的实体
    const targets = world.with('detectable', 'position')

    for (const entity of detectors) {
      const detect = entity.detectArea
      detect.results = [] // 重置结果

      // 获取探测器要求的目标标签
      const requiredLabels = Array.isArray(detect.target) ? detect.target : [detect.target]
      const requiredSet = new Set([...requiredLabels, ...(detect.includeTags || [])])

      // 遍历潜在目标
      for (const target of targets) {
        if (target === entity) continue // 不探测自己

        const detectable = target.detectable
        
        // 标签匹配检查
        const hasMatch = detectable.labels.some(label => requiredSet.has(label))

        if (hasMatch) {
          // 排除标签检查
          if (detect.excludeTags && detectable.labels.some(label => detect.excludeTags.includes(label))) {
            continue
          }

          // 进行空间检测 (目前 target 视为点，使用其 position)
          if (this.checkCollision(entity, target, detect)) {
            detect.results.push(target)
          }
        }
      }
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
