import { world } from '../world'

const triggers = world.with('position', 'trigger')
const playerQuery = world.with('player', 'position')

export const TriggerSystem = {
    /**
     * @param {number} dt
     * @param {import('@/game/GameEngine').InputManager} input
     */
    update(dt, input) {
        // 1. 获取玩家
        let player = null
        for (const p of playerQuery) {
            player = p
            break
        }
        if (!player) return

        const pPos = player.position

        // 2. 遍历触发器
        for (const entity of triggers) {
            // 如果已经触发过且未被消费 (Signal 存在)，跳过
            if (entity.triggered) continue
            
            // 如果实体被禁用或处于非交互状态 (例如昏迷的敌人)
            if (entity.aiState && entity.aiState.state === 'stunned') continue

            const t = entity.trigger
            let isTriggered = false

            // --- TYPE: ZONE (区域触发) ---
            if (t.type === 'ZONE') {
                const bounds = t.bounds || { x: 0, y: 0, w: 0, h: 0 }
                // 计算绝对坐标包围盒
                const left = entity.position.x + bounds.x
                const right = left + bounds.w
                const top = entity.position.y + bounds.y
                const bottom = top + bounds.h

                if (pPos.x >= left && pPos.x <= right &&
                    pPos.y >= top && pPos.y <= bottom) {
                    isTriggered = true
                    console.log('TriggerSystem: Zone Triggered', entity)
                }
            }
            
            // --- TYPE: PROXIMITY (距离触发) ---
            else if (t.type === 'PROXIMITY') {
                const dx = pPos.x - entity.position.x
                const dy = pPos.y - entity.position.y
                const distSq = dx * dx + dy * dy
                const radiusSq = t.radius * t.radius

                if (distSq <= radiusSq) {
                    isTriggered = true
                }
            }
            
            // --- TYPE: INTERACT (按键交互) ---
            else if (t.type === 'INTERACT') {
                const dx = pPos.x - entity.position.x
                const dy = pPos.y - entity.position.y
                const distSq = dx * dx + dy * dy
                const radiusSq = t.radius * t.radius

                if (distSq <= radiusSq) {
                    // Check Input
                    if (input && (input.isDown('Space') || input.isDown('KeyE') || input.isDown('Enter'))) {
                        isTriggered = true
                    }
                }
            }

            // 3. Emit Signal
            if (isTriggered) {
                world.addComponent(entity, 'triggered', true)
            }
        }
    }
}

