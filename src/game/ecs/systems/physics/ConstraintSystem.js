import { world } from '@/game/ecs/world'

/**
 * Constraint System Components Schema
 * 
 * Required Components:
 * @property {object} position - 位置组件
 * @property {number} position.x
 * @property {number} position.y
 * 
 * @property {object} bounds - 边界限制组件
 * @property {number} bounds.minX - 最小 X 坐标
 * @property {number} bounds.maxX - 最大 X 坐标
 * @property {number} bounds.minY - 最小 Y 坐标
 * @property {number} bounds.maxY - 最大 Y 坐标
 */

// Entities that need to be constrained within bounds
// They must have 'position' and 'bounds' components
// bounds: { minX, maxX, minY, maxY }
const constrainedEntities = world.with('position', 'bounds')

export const ConstraintSystem = {
  update(dt) {
    for (const entity of constrainedEntities) {
      // Defensive checks
      if (!entity.position) {
        console.error(`[ConstraintSystem] Entity ${entity.id || 'N/A'} missing position component!`);
        continue;
      }
      if (!entity.bounds) {
        console.error(`[ConstraintSystem] Entity ${entity.id || 'N/A'} missing bounds component!`);
        continue;
      }

      const { minX, maxX, minY, maxY } = entity.bounds
      
      // Validation check for bounds logic
      if (typeof minX !== 'number' || typeof maxX !== 'number' || typeof minY !== 'number' || typeof maxY !== 'number') {
        console.warn(`[ConstraintSystem] Invalid bounds for Entity ${entity.id || 'N/A'}:`, entity.bounds);
        continue; // Skip invalid constraints
      }
      if (minX > maxX || minY > maxY) {
        console.warn(`[ConstraintSystem] Inverted bounds detected for Entity ${entity.id || 'N/A'}:`, entity.bounds);
        // Could auto-fix here, but let's just log and proceed carefully
      }

      const { position } = entity
      
      const originalX = position.x
      const originalY = position.y

      position.x = Math.max(minX, Math.min(maxX, position.x))
      position.y = Math.max(minY, Math.min(maxY, position.y))

      if (position.x !== originalX || position.y !== originalY) {
         // Debug log for boundary hit (useful for debugging map edges)
         // console.debug(`[ConstraintSystem] Entity ${entity.id} hit bounds! Clamped from (${originalX.toFixed(1)},${originalY.toFixed(1)}) to (${position.x.toFixed(1)},${position.y.toFixed(1)})`);
      }
    }
  }
}
