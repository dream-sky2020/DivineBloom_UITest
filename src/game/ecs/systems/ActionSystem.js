import { world, eventQueue } from '../world'

// Query entities that have just been triggered
const triggeredEntities = world.with('triggered')

/**
 * Handlers for specific Action Components
 */
const ActionHandlers = {
    handleBattle(entity, callbacks) {
        if (callbacks.onEncounter && entity.actionBattle) {
            callbacks.onEncounter(entity.actionBattle.group, entity.actionBattle.uuid)
        }
    },

    handleTeleport(entity, callbacks) {
        if (callbacks.onSwitchMap && entity.actionTeleport) {
            callbacks.onSwitchMap(entity.actionTeleport.mapId, entity.actionTeleport.entryId)
        }
    },

    handleDialogue(entity, callbacks) {
        if (callbacks.onInteract && entity.actionDialogue) {
            callbacks.onInteract({
                type: 'dialogue',
                id: entity.actionDialogue.scriptId,
                ...entity.actionDialogue.params
            })
        }
    }
}

/**
 * Handlers for Legacy Event Queue items
 */
const EventHandlers = {
    TRIGGER_BATTLE: (payload, callbacks) => {
        if (callbacks.onEncounter) callbacks.onEncounter(payload.battleGroup, payload.uuid)
    },
    TRIGGER_MAP_SWITCH: (payload, callbacks) => {
        if (callbacks.onSwitchMap) callbacks.onSwitchMap(payload.targetMapId, payload.targetEntryId)
    },
    INTERACT_NPC: (payload, callbacks) => {
        if (callbacks.onInteract) callbacks.onInteract(payload.interaction)
    }
}

export const ActionSystem = {
    /**
     * Process actions from Triggered entities or EventQueue
     * @param {object} callbacks - External callbacks
     */
    update(callbacks = {}) {
        // --- Part 1: Process ECS Trigger Signals ---
        for (const entity of triggeredEntities) {
            // Check for components and dispatch to handlers
            if (entity.actionBattle) {
                ActionHandlers.handleBattle(entity, callbacks)
            }
            else if (entity.actionTeleport) {
                ActionHandlers.handleTeleport(entity, callbacks)
            }
            else if (entity.actionDialogue) {
                ActionHandlers.handleDialogue(entity, callbacks)
            }

            // Cleanup: Signal is consumed
            world.removeComponent(entity, 'triggered')
        }

        // --- Part 2: Process Legacy/UI Events ---
        const events = eventQueue.drain()
        for (const event of events) {
            const handler = EventHandlers[event.type]
            if (handler) {
                handler(event.payload, callbacks)
            }
        }
    }
}
