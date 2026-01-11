import { world } from '@/game/ecs/world'

/**
 * Movement System Components Schema
 * 
 * Required Components:
 * @property {object} position - 位置组件
 * @property {number} position.x
 * @property {number} position.y
 * 
 * @property {object} velocity - 速度组件
 * @property {number} velocity.x - X轴速度 (pixels/sec)
 * @property {number} velocity.y - Y轴速度 (pixels/sec)
 */

const movingEntities = world.with('position', 'velocity')

export const MovementSystem = {
  update(dt) {
    for (const entity of movingEntities) {
      // Defensive checks
      if (!entity.position) {
        console.error(`[MovementSystem] Entity ${entity.id || 'N/A'} missing position component!`);
        continue;
      }
      if (!entity.velocity) {
        console.error(`[MovementSystem] Entity ${entity.id || 'N/A'} missing velocity component!`);
        continue;
      }

      // Type guards for numeric values
      if (typeof entity.velocity.x !== 'number' || typeof entity.velocity.y !== 'number') {
        console.warn(`[MovementSystem] Invalid velocity values for Entity ${entity.id}:`, entity.velocity);
        // Auto-fix or skip
        entity.velocity.x = entity.velocity.x || 0;
        entity.velocity.y = entity.velocity.y || 0;
      }

      // Basic Euler integration
      entity.position.x += entity.velocity.x * dt
      entity.position.y += entity.velocity.y * dt
    }
  }
}
