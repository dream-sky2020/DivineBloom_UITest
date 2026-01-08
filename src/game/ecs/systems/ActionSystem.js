import { eventQueue } from '../world'

export const ActionSystem = {
    /**
     * Process events from the event queue
     * @param {object} callbacks - External callbacks (e.g. from Vue/Scene)
     * @param {Function} [callbacks.onEncounter]
     */
    update(callbacks = {}) {
        const events = eventQueue.drain()

        for (const event of events) {
            switch (event.type) {
                case 'TRIGGER_BATTLE':
                    if (callbacks.onEncounter) {
                        const { battleGroup, uuid } = event.payload
                        callbacks.onEncounter(battleGroup, uuid)
                    }
                    break;
            }
        }
    }
}

