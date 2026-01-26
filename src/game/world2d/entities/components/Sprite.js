import { z } from 'zod';

export const SpriteComponentSchema = z.object({
  id: z.string(), // 对应资源ID (e.g., 'hero', 'slime')
  scale: z.number().default(1),
  visible: z.boolean().default(true),
  
  // Color properties
  tint: z.string().optional(), // e.g., 'rgba(255,0,0,0.5)'
  opacity: z.number().min(0).max(1).default(1),
  brightness: z.number().default(1),
  contrast: z.number().default(1),
  
  // Offset properties
  offsetX: z.number().default(0),
  offsetY: z.number().default(0),
  rotation: z.number().default(0), // 弧度
  flipX: z.boolean().default(false),
  flipY: z.boolean().default(false)
});

export const Sprite = {
  create(id, options = {}) {
    const rawData = { 
      id, 
      ...options 
    };
    const result = SpriteComponentSchema.safeParse(rawData);
    if (result.success) {
      return result.data;
    } else {
      console.error(`[Sprite] Validation failed for id: ${id}`, result.error);
      return { 
        id: id || 'error', 
        scale: 1, 
        visible: true,
        opacity: 1,
        brightness: 1,
        contrast: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        flipX: false,
        flipY: false
      };
    }
  }
};
