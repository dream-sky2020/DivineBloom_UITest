import { world } from '@/game/ecs/world'

/**
 * Enemy Control System
 * 负责将 AI 意图 (aiState.moveDir) 转换为物理速度 (Velocity)
 * 同时也负责更新朝向 (Facing)
 * 
 * Required Components:
 * @property {object} velocity
 * @property {object} aiState (Intent source)
 * @property {object} aiConfig (Speed source)
 */

const controlEntities = world.with('enemy', 'velocity', 'aiState', 'aiConfig')

export const EnemyControlSystem = {
    update(dt) {
        for (const entity of controlEntities) {
            // Defensive Checks
            if (!entity.aiState) {
                console.error(`[EnemyControlSystem] Entity ${entity.id || 'N/A'} missing aiState!`);
                continue;
            }
            if (!entity.aiConfig) {
                console.error(`[EnemyControlSystem] Entity ${entity.id || 'N/A'} missing aiConfig!`);
                continue;
            }
            if (!entity.velocity) {
                console.error(`[EnemyControlSystem] Entity ${entity.id || 'N/A'} missing velocity!`);
                continue;
            }

            const { aiState, aiConfig, velocity } = entity

            const moveDir = aiState.moveDir
            
            // Validate moveDir
            if (!moveDir || typeof moveDir.x !== 'number' || typeof moveDir.y !== 'number') {
                console.warn(`[EnemyControlSystem] Invalid moveDir for Entity ${entity.id || 'N/A'}:`, moveDir);
                // Fail safe: stop moving
                velocity.x = 0;
                velocity.y = 0;
                continue;
            }

            const speed = aiConfig.speed || 0

            // Update Facing
            const lenSq = moveDir.x * moveDir.x + moveDir.y * moveDir.y
            if (lenSq > 0.001) {
                const len = Math.sqrt(lenSq)
                
                // Defensive: ensure aiState has facing object
                if (!aiState.facing) aiState.facing = { x: 1, y: 0 };
                
                aiState.facing.x = moveDir.x / len
                aiState.facing.y = moveDir.y / len
            }

            // Sync to Velocity
            velocity.x = moveDir.x * speed
            velocity.y = moveDir.y * speed
        }
    }
}
