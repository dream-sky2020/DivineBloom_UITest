import { z } from 'zod';

/**
 * Camera Component Schema
 */
export const CameraSchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0),
  targetX: z.number().default(0),
  targetY: z.number().default(0),
  lerp: z.number().min(0).max(1).default(0.1),
  useBounds: z.boolean().default(true),
  deadZone: z.object({
    width: z.number().default(100),
    height: z.number().default(100)
  }).default({ width: 100, height: 100 }),
  // 目标实体引用 (通常是玩家)
  targetEntity: z.any().nullable().default(null)
});

/**
 * Camera Component Definition
 */
export const Camera = {
  /**
   * 创建相机组件
   * @param {Partial<z.infer<typeof CameraSchema>>} data 
   */
  create(data = {}) {
    const result = CameraSchema.safeParse(data);
    if (!result.success) {
      console.warn('[Camera] Validation failed, using defaults', result.error);
      return CameraSchema.parse({});
    }
    return result.data;
  }
};
