import { z } from 'zod'
import { world } from '@/game/ecs/world'
import { Visuals } from '@/game/entities/components/Visuals'

// --- Schema Definition ---

export const DecorationEntitySchema = z.object({
    x: z.number(),
    y: z.number(),
    name: z.string().optional().default('Decoration'),
    config: z.object({
        spriteId: z.string().optional(),
        scale: z.number().optional().default(1),
        zIndex: z.number().optional().default(-50),
        rect: z.object({
            width: z.number(),
            height: z.number(),
            color: z.string()
        }).optional()
    }).optional().default({})
});

// --- Entity Definition ---

export const DecorationEntity = {
    create(data) {
        const result = DecorationEntitySchema.safeParse(data);
        if (!result.success) {
            console.error('[DecorationEntity] Validation failed', result.error);
            return null;
        }

        const { x, y, name, config } = result.data;
        const { spriteId, scale, zIndex, rect } = config;

        let visualComponent;
        if (spriteId) {
            visualComponent = Visuals.Sprite(spriteId, scale);
        } else if (rect) {
            visualComponent = Visuals.Rect(rect.width, rect.height, rect.color);
        } else {
            visualComponent = Visuals.Rect(20, 20, 'magenta');
        }

        return world.add({
            type: 'decoration',
            name: name,
            position: { x, y },
            visual: visualComponent,
            zIndex: zIndex
        })
    },

    serialize(entity) {
        return {
            type: 'decoration',
            x: entity.position.x,
            y: entity.position.y,
            name: entity.name,
            config: {
                spriteId: entity.visual.type === 'sprite' ? entity.visual.id : undefined,
                scale: entity.visual.scale,
                zIndex: entity.zIndex,
                rect: entity.visual.type === 'rect' ? {
                    width: entity.visual.width,
                    height: entity.visual.height,
                    color: entity.visual.color
                } : undefined
            }
        }
    }
}
