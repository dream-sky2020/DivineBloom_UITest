import { changeState } from '@/game/ai/utils'

export const WanderState = {
    update(entity, dt) {
        const { aiState, aiConfig, aiSensory, position } = entity

        // 1. Enter Logic
        if (aiState.justEntered) {
            aiState.colorHex = '#eab308' // Yellow
            aiState.suspicion = 0
            aiState.justEntered = false
        }

        // 2. Vision / Suspicion Check (Using Pre-calculated Sensory Data)
        if (aiConfig.type !== 'wander' && aiSensory) {
             // Synchronize suspicion from sensory to aiState
             aiState.suspicion = aiSensory.suspicion

             if (aiState.suspicion >= 1.0) {
                 // [DECOUPLED] Use detectedState from config
                 changeState(entity, aiConfig.detectedState || 'chase')
                 return
             }
        }

        // 3. Home Area Constraint
        let isReturningHome = false
        if (aiConfig.homePosition && aiConfig.patrolRadius) {
            const dx = position.x - aiConfig.homePosition.x
            const dy = position.y - aiConfig.homePosition.y
            const distSq = dx * dx + dy * dy
            const radiusSq = aiConfig.patrolRadius * aiConfig.patrolRadius

            if (distSq > radiusSq) {
                isReturningHome = true
                // Point towards home
                const dist = Math.sqrt(distSq)
                aiState.moveDir.x = -dx / dist
                aiState.moveDir.y = -dy / dist
                // Reset timer if we were idle or moving elsewhere
                if (aiState.timer <= 0) aiState.timer = 1.0 
            }
        }

        // 4. Movement Logic
        if (!isReturningHome && aiState.suspicion > 0 && aiSensory && aiSensory.hasPlayer) {
            // Stop to observe
            aiState.moveDir.x = 0
            aiState.moveDir.y = 0
            
            // Face player
            const playerPos = aiSensory.playerPos
            const dx = playerPos.x - position.x
            const dy = playerPos.y - position.y
            const distSq = aiSensory.distSqToPlayer
            
            if (distSq > 0.001) {
                const invDist = 1 / Math.sqrt(distSq)
                aiState.facing.x = dx * invDist
                aiState.facing.y = dy * invDist
            }
            return
        }

        aiState.timer -= dt
        if (aiState.timer <= 0) {
            aiState.timer = 2 + Math.random() * 2
            const angle = Math.random() * Math.PI * 2
            aiState.moveDir.x = Math.cos(angle)
            aiState.moveDir.y = Math.sin(angle)

            if (Math.random() < 0.3) {
                aiState.moveDir.x = 0
                aiState.moveDir.y = 0
            }
        }
    }
}
