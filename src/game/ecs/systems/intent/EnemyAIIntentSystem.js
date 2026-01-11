import { world } from '@/game/ecs/world'
import { WanderState } from '@/game/ai/states/WanderState'
import { ChaseState } from '@/game/ai/states/ChaseState'
import { FleeState } from '@/game/ai/states/FleeState'
import { StunnedState } from '@/game/ai/states/StunnedState'

/**
 * Enemy AI Intent System (Formerly EnemyAISystem)
 * 负责 AI 决策 (Think)
 * 根据感知数据 (aiSensory) 运行状态机，更新状态和意图
 * 
 * Required Components:
 * ... (同前)
 * @property {object} aiSensory (From AISenseSystem)
 */

const enemyEntities = world.with('enemy', 'position', 'velocity', 'aiState', 'aiConfig')

// State Map
const STATES = {
  'wander': WanderState,
  'chase': ChaseState,
  'flee': FleeState,
  'stunned': StunnedState
}

export const EnemyAIIntentSystem = {
  update(dt) {
    // No longer need to fetch player here, States use aiSensory

    for (const entity of enemyEntities) {
      // Defensive Checks
      if (!entity.aiState) {
          console.error(`[EnemyAIIntentSystem] Entity ${entity.id || 'N/A'} missing aiState!`);
          continue;
      }

      const { aiState } = entity
      
      const currentState = STATES[aiState.state]
      if (currentState) {
          try {
              // States now read from entity.aiSensory internally
              // Defensive: Check update method
              if (typeof currentState.update === 'function') {
                  currentState.update(entity, dt)
              } else {
                  console.error(`[EnemyAIIntentSystem] Invalid State Implementation for '${aiState.state}'`);
              }
          } catch (e) {
              console.error(`[EnemyAIIntentSystem] Error in AI State '${aiState.state}' for Entity ${entity.id || 'N/A'}:`, e);
              // Fallback to wander or idle to prevent loop crash
              aiState.state = 'wander';
          }
      } else {
          console.warn(`[EnemyAIIntentSystem] Unknown AI State '${aiState.state}' for Entity ${entity.id || 'N/A'}. Resetting to wander.`);
          aiState.state = 'wander';
      }
      
      // Control Logic moved to EnemyControlSystem
    }
  }
}
