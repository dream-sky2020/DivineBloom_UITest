import { world } from '@world2d/world'

/**
 * Dialogue System
 * 处理对话触发逻辑
 */
export const DialogueExecuteSystem = {
  handle(entity, callbacks) {
    if (callbacks.onInteract && entity.actionDialogue) {
      callbacks.onInteract({
        type: 'dialogue',
        id: entity.actionDialogue.scriptId,
        ...entity.actionDialogue.params
      })
    }
  }
}
