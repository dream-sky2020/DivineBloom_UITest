import { z } from 'zod';

// --- AI Schema Definitions ---

export const AIConfigSchema = z.object({
  type: z.string().default('wander'),
  visionRadius: z.number().default(120),
  speed: z.number().default(80),
  visionType: z.string().default('circle'),
  visionAngle: z.number().default(Math.PI / 2), // 弧度
  visionProximity: z.number().default(40),
  suspicionTime: z.number().default(0),
  minYRatio: z.number().default(0.35)
});

export const AIStateSchema = z.object({
  state: z.string().default('wander'),
  timer: z.number().default(0),
  suspicion: z.number().default(0),
  moveDir: z.object({ x: z.number(), y: z.number() }).default({ x: 0, y: 0 }),
  facing: z.object({ x: z.number(), y: z.number() }).default({ x: 1, y: 0 }),
  colorHex: z.string().default('#eab308'),
  alertAnim: z.number().default(0),
  starAngle: z.number().default(0),
  justEntered: z.boolean().default(true)
});

// --- AI Factory ---

// Helper for fallback AI config
const createFallbackAIConfig = (type) => ({
  type: type || 'wander',
  visionRadius: 120,
  speed: 80,
  visionType: 'circle',
  visionAngle: Math.PI / 2,
  visionProximity: 40,
  suspicionTime: 0,
  minYRatio: 0.35
});

const createFallbackAIState = (defaultState) => ({
  state: defaultState || 'wander',
  timer: 0,
  suspicion: 0,
  moveDir: { x: 0, y: 0 },
  facing: { x: 1, y: 0 },
  colorHex: '#eab308',
  alertAnim: 0,
  starAngle: 0,
  justEntered: true
});

export const AI = {
  /**
   * AI 配置组件
   * Defaults handled by Schema
   */
  Config(type, visionRadius, speed, extraOptions = {}) {
    // 预处理: 将角度转换为弧度 (这是业务逻辑，非默认值逻辑，保留在此)
    // 如果未提供，传 undefined 给 Schema，让 Schema 使用默认值
    const visionAngle = (extraOptions.visionAngle !== undefined)
      ? extraOptions.visionAngle * (Math.PI / 180)
      : undefined;

    const input = {
      type,
      visionRadius,
      speed,
      visionType: extraOptions.visionType,
      visionAngle: visionAngle,
      visionProximity: extraOptions.visionProximity,
      suspicionTime: extraOptions.suspicionTime,
      minYRatio: extraOptions.minYRatio
    };

    if (!AIConfigSchema) return createFallbackAIConfig(type);

    const result = AIConfigSchema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      console.error('[AI] Config validation failed', result.error);
      return createFallbackAIConfig(type);
    }
  },

  /**
   * AI 状态组件
   */
  State(isStunned, stunnedTimer, defaultState) {
    // Construct intent data
    const input = {
      state: isStunned ? 'stunned' : defaultState,
      timer: isStunned ? (stunnedTimer || 3.0) : 0
    };

    if (!AIStateSchema) return createFallbackAIState(defaultState);

    const result = AIStateSchema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      console.error('[AI] State validation failed', result.error);
      return createFallbackAIState(defaultState);
    }
  }
}
