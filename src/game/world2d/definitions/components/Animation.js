import { z } from 'zod';

/**
 * 动画组件 Schema
 */
export const AnimationSchema = z.object({
  currentState: z.string().default('idle'),
  frameIndex: z.number().default(0),
  timer: z.number().default(0),
  speedMultiplier: z.number().default(1),
  paused: z.boolean().default(false),
  
  // 用于追踪 sprite.id 的变化，实现自动重置
  lastSyncedId: z.string().optional()
});

export const Animation = {
  /**
   * 创建动画组件
   * @param {string|Partial<z.infer<typeof AnimationSchema>>} data 
   */
  create(data = 'idle') {
    const input = typeof data === 'string' ? { currentState: data } : data;
    const result = AnimationSchema.safeParse(input);
    if (!result.success) {
      console.warn('[Animation] Validation failed, using defaults', result.error);
      return AnimationSchema.parse({});
    }
    return result.data;
  }
};
