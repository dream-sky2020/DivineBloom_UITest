import { actionQueue, eventQueue, world } from '@/game/ecs/world'
import { BattleExecuteSystem } from '@/game/ecs/systems/execute/BattleExecuteSystem'
import { DialogueExecuteSystem } from '@/game/ecs/systems/execute/DialogueExecuteSystem'
import { TeleportExecuteSystem } from '@/game/ecs/systems/execute/TeleportExecuteSystem'
import { createLogger } from '@/utils/logger'

const logger = createLogger('ExecuteSystem')

/**
 * 遗留事件处理器
 */
const EventHandlers = {
  TRIGGER_BATTLE: (payload, callbacks) => {
    if (callbacks && callbacks.onEncounter) callbacks.onEncounter(payload.battleGroup, payload.uuid)
  },
  TRIGGER_MAP_SWITCH: (payload, callbacks) => {
    if (callbacks && callbacks.onSwitchMap) callbacks.onSwitchMap(payload.targetMapId, payload.targetEntryId)
  },
  INTERACT_NPC: (payload, callbacks) => {
    if (callbacks && callbacks.onInteract) callbacks.onInteract(payload.interaction)
  }
}

/**
 * ExecuteSystem
 * 任务执行总管
 * 接收 TriggerSystem 产生的 Action 请求，分发给具体子系统
 */
export const ExecuteSystem = {
  update(callbacks = {}) {
    // 1. 处理 ActionQueue (ECS 内部产生)
    // Defensive check: ensure queue exists (though imported)
    if (!actionQueue) {
      logger.error('ActionQueue is undefined!');
      return;
    }
    
    // Check Global Player Intents (Directly from entities, not actions)
    // This is a bit of a hybrid approach, but Menu is a global system action
    const playerEntity = world.with('player', 'playerIntent').first;
    if (playerEntity && playerEntity.playerIntent.wantsToOpenMenu) {
       if (callbacks.onOpenMenu) {
           callbacks.onOpenMenu();
           // Reset intent to prevent multiple triggers (though pause should handle it)
           playerEntity.playerIntent.wantsToOpenMenu = false;
       }
    }

    const queueLength = actionQueue.length
    for (let i = 0; i < queueLength; i++) {
      const request = actionQueue.shift()
      if (!request) continue

      // Type Guard: Validate request structure
      if (!request.source || !request.type) {
        logger.error('Invalid request structure:', request);
        continue;
      }

      const { source, type } = request

      // logger.debug(`Processing action: ${type}`, source.type)

      switch (type) {
        case 'BATTLE':
          BattleExecuteSystem.handle(source, callbacks)
          break

        case 'DIALOGUE':
          DialogueExecuteSystem.handle(source, callbacks)
          break

        case 'TELEPORT':
          TeleportExecuteSystem.handle(source, callbacks)
          break

        default:
          logger.warn(`Unknown action type: ${type}`, source)
      }
    }

    // 2. 处理 Legacy/UI Events (EventQueue) - 保持兼容性
    if (!eventQueue) return;

    const events = eventQueue.drain()
    for (const event of events) {
      if (!event.type || !event.payload) {
        logger.warn('Invalid legacy event format:', event);
        continue;
      }

      const handler = EventHandlers[event.type]
      if (handler) {
        try {
          handler(event.payload, callbacks)
        } catch (e) {
          logger.error(`Error handling legacy event ${event.type}:`, e);
        }
      } else {
        // Optional: warn about unhandled legacy events if strict
      }
    }
  }
}
