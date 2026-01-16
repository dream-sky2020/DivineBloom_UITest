import { world } from '@/game/ecs/world'

/**
 * Movement System (Physics)
 * 整合了位移计算与边界约束。
 * 
 * Required Components:
 * @property {object} position - 位置组件 {x, y}
 * @property {object} velocity - 速度组件 {x, y}
 * 
 * Optional Components:
 * @property {object} bounds - 边界限制 {minX, maxX, minY, maxY}
 */

const movingEntities = world.with('position', 'velocity')

export const MovementSystem = {
  update(dt) {
    for (const entity of movingEntities) {
      const { position, velocity, bounds } = entity

      // 1. 基础位移 (Euler integration)
      // 注意：这里不再进行重复的 type guard，假设加载时已校验或在必要时由加载器处理
      position.x += velocity.x * dt
      position.y += velocity.y * dt

      // 2. 立即执行边界约束 (Constraint)
      // 合并逻辑可以显著减少对 bounds 组件的重复查询开销
      if (bounds) {
        const { minX, maxX, minY, maxY } = bounds
        
        // 只有在坐标超出边界时才进行赋值，减少内存写入
        if (position.x < minX) position.x = minX
        else if (position.x > maxX) position.x = maxX
        
        if (position.y < minY) position.y = minY
        else if (position.y > maxY) position.y = maxY
      }
    }
  }
}
