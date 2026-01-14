import { world } from '@/game/ecs/world'
import { createLogger } from '@/utils/logger'

const logger = createLogger('PlayerIntentSystem')

/**
 * Player Intent System
 * 负责解析原始输入 (RawInput) 并转化为玩家意图 (PlayerIntent)
 * 处理死区、归一化、输入缓冲、连击判断等逻辑
 * 
 * Target Entities:
 * @property {object} rawInput
 * 
 * Output Component:
 * @property {object} playerIntent
 * @property {object} playerIntent.move { x, y } (Normalized)
 * @property {boolean} playerIntent.wantsToRun
 * @property {boolean} playerIntent.wantsToInteract
 */

const intentEntities = world.with('rawInput')

export const PlayerIntentSystem = {
    update(dt) {
        for (const entity of intentEntities) {
            // Defensive Check
            if (!entity.rawInput) {
                logger.error(`Entity ${entity.id || 'N/A'} has rawInput tag but no component!`);
                continue;
            }

            // Ensure intent component exists
            if (!entity.playerIntent) {
                // If creating component dynamically, ensure structure is valid
                world.addComponent(entity, 'playerIntent', {
                    move: { x: 0, y: 0 },
                    wantsToRun: false,
                    wantsToInteract: false,
                    wantsToOpenMenu: false
                })
            }

            const raw = entity.rawInput
            const intent = entity.playerIntent
            
            // Validate Raw Input Structure
            if (!raw.axes || !raw.buttons) {
                logger.warn(`Invalid rawInput structure for Entity ${entity.id || 'N/A'}`);
                // Reset intent
                intent.move.x = 0; intent.move.y = 0;
                intent.wantsToRun = false;
                continue;
            }

            // 1. Process Movement Intent
            let dx = raw.axes.x || 0
            let dy = raw.axes.y || 0

            // Normalize diagonal movement
            if (dx !== 0 && dy !== 0) {
                const inv = 1 / Math.sqrt(2)
                dx *= inv
                dy *= inv
            }

            // Defensive: Ensure intent.move exists
            if (!intent.move) intent.move = { x: 0, y: 0 };
            
            intent.move.x = dx
            intent.move.y = dy

            // 2. Process Action Intents
            intent.wantsToRun = !!raw.buttons.run
            intent.wantsToInteract = !!raw.buttons.interact
            intent.wantsToOpenMenu = !!raw.buttons.menu

            // Debug Log (Optional)
            if (intent.wantsToInteract) {
                logger.debug(`Interaction Intent Registered! Entity: ${entity.id}`);
            }
        }
    }
}
