import { world } from '../world'

// Query entities that might show UI hints (Interactables)
// We look for entities with 'trigger' component of type 'INTERACT'
// Or fallback to old 'interaction' component for safety
const interactables = world.with('position', 'trigger')
const playerQuery = world.with('player', 'position')

export const InteractionSystem = {
    /**
     * System dedicated to UI Proximity Hints (e.g. "Press E to Interact")
     * Logic for actual interaction is now handled by TriggerSystem -> ActionSystem
     * 
     * @param {object} params
     * @param {Function} [params.onProximity] - Callback to update UI hint
     */
    update({ onProximity }) {
        if (!onProximity) return

        // 1. Get Player
        let player = null
        for (const p of playerQuery) {
            player = p
            break
        }
        if (!player) return

        const pPos = player.position

        let nearestEntity = null
        let minDistSq = Infinity

        // 2. Find nearest interactable in range
        for (const entity of interactables) {
            const t = entity.trigger

            // Only care about INTERACT type for UI hints
            if (t.type !== 'INTERACT') continue

            const dx = pPos.x - entity.position.x
            const dy = pPos.y - entity.position.y
            const distSq = dx * dx + dy * dy
            const radiusSq = t.radius * t.radius

            if (distSq <= radiusSq) {
                if (distSq < minDistSq) {
                    minDistSq = distSq
                    nearestEntity = entity
                }
            }
        }

        // 3. Update UI
        // We pass the legacy 'interaction' component because the UI layer expects it
        // If it doesn't exist (pure new entity), we might need to adapt
        if (nearestEntity) {
            const interactionData = nearestEntity.interaction || {
                type: 'dialogue', // default fallback
                id: nearestEntity.actionDialogue?.scriptId
            }
            onProximity(interactionData)
        } else {
            onProximity(null)
        }
    }
}
