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
  update(callbacks = {}, mapData = null) {
    // 1. 处理 ActionQueue (ECS 内部产生)
    // Defensive check: ensure queue exists (though imported)
    if (!actionQueue) {
      logger.error('ActionQueue is undefined!');
      return;
    }
    
    // Check Global Player Intents (Directly from entities, not actions)
    const playerEntity = world.with('player', 'playerIntent').first;
    if (playerEntity && playerEntity.playerIntent.wantsToOpenMenu) {
       if (callbacks.onOpenMenu) {
           callbacks.onOpenMenu();
           playerEntity.playerIntent.wantsToOpenMenu = false;
       }
    }

    // 优化：批量提取任务并清空原队列，避免 shift() 的 O(N) 位移开销和 GC 抖动
    if (actionQueue.length > 0) {
      const requests = actionQueue.splice(0, actionQueue.length);
      
      for (const request of requests) {
        if (!request) continue;

        // Type Guard: Validate request structure
        if (!request.source || !request.type) {
          logger.error('Invalid request structure:', request);
          continue;
        }

        const { source, type } = request;

        switch (type) {
          case 'BATTLE':
            BattleExecuteSystem.handle(source, callbacks);
            break;

          case 'DIALOGUE':
            DialogueExecuteSystem.handle(source, callbacks);
            break;

          case 'TELEPORT':
            TeleportExecuteSystem.handle(request, callbacks, mapData);
            break;

          default:
            logger.warn(`Unknown action type: ${type}`, source);
        }
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
