import { z } from 'zod';
import { Visuals as VisualDefs } from '../../../schemas/visuals.js';

/**
 * 动画帧定义
 */
export const AnimationFrameSchema = z.object({
  assetId: z.string(), // 该帧对应的具体资源ID
  duration: z.number().default(100), // 毫秒
});

/**
 * 循环动画定义
 */
export const AnimationLoopSchema = z.object({
  id: z.string(), // 动画ID (e.g., 'idle', 'walk')
  frames: z.array(AnimationFrameSchema),
  loop: z.boolean().default(true)
});

export const AnimationComponentSchema = z.object({
  currentState: z.string().default('idle'),
  frameIndex: z.number().default(0),
  timer: z.number().default(0),
  speedMultiplier: z.number().default(1),
  paused: z.boolean().default(false),
  
  // 存储该实体可用的所有动画数据
  animations: z.record(z.string(), AnimationLoopSchema).default({})
});

export const Animation = {
  /**
   * 创建动画组件
   */
  create(animationsMap = {}, initialState = 'idle') {
    const rawData = { 
      animations: animationsMap,
      currentState: initialState 
    };
    const result = AnimationComponentSchema.safeParse(rawData);
    return result.success ? result.data : this.fallback(initialState);
  },

  /**
   * 从公共视觉定义创建动画组件
   * @param {string} visualId 
   * @param {string} initialState 
   */
  createFromVisual(visualId, initialState = 'idle') {
    const def = VisualDefs[visualId] || VisualDefs['default'];
    const animationsMap = {};
    
    if (def && def.animations) {
      for (const [animKey, animDef] of Object.entries(def.animations)) {
        animationsMap[animKey] = {
          id: animKey,
          loop: animDef.loop !== false,
          frames: (animDef.frames || [0]).map(frameIdx => ({
            assetId: visualId, 
            duration: animDef.speed > 0 ? (1000 / animDef.speed) : 100
          }))
        };
      }
    }

    return this.create(animationsMap, initialState);
  },

  fallback(initialState = 'idle') {
    return { 
      currentState: initialState, 
      frameIndex: 0, 
      timer: 0, 
      speedMultiplier: 1, 
      paused: false,
      animations: {}
    };
  }
};
