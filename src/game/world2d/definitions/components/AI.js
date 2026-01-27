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
  minYRatio: z.number().default(0.35),

  // --- New Optimized Configs ---
  homePosition: z.object({ x: z.number(), y: z.number() }).optional(),
  patrolRadius: z.number().default(150),
  detectedState: z.string().default('chase'), // 疑虑值满后进入的状态 (chase/flee)
  stunDuration: z.number().default(5),        // 击晕持续时间
  chaseExitMultiplier: z.number().default(1.5) // 追击/逃跑退出的距离倍率 (相对于视野半径)
});

export const AIStateSchema = z.object({
  state: z.string().default('wander'),
  timer: z.number().default(0),
  lostTargetTimer: z.number().default(0), // 丢失玩家后的追击剩余时间
  lastSeenPos: z.object({ x: z.number(), y: z.number() }).nullable().default(null), // 玩家最后出现的坐标
  suspicion: z.number().default(0),
  moveDir: z.object({ x: z.number(), y: z.number() }).default({ x: 0, y: 0 }),
  facing: z.object({ x: z.number(), y: z.number() }).default({ x: 1, y: 0 }),
  colorHex: z.string().default('#eab308'),
  alertAnim: z.number().default(0),
  starAngle: z.number().default(0),
  justEntered: z.boolean().default(true),
  targetPos: z.object({ x: z.number(), y: z.number() }).nullable().default(null) // 临时目标位置
});

// --- AI Factory ---

export const AI = {
  /**
   * AI 配置组件
   * Defaults handled by Schema
   */
  Config(type, visionRadius, speed, extraOptions = {}) {
    // 预处理: 将角度转换为弧度 (这是业务逻辑，非默认值逻辑，保留在此)
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
      minYRatio: extraOptions.minYRatio,
      homePosition: extraOptions.homePosition,
      patrolRadius: extraOptions.patrolRadius,
      detectedState: extraOptions.detectedState,
      stunDuration: extraOptions.stunDuration,
      chaseExitMultiplier: extraOptions.chaseExitMultiplier
    };

    const result = AIConfigSchema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      console.error('[AI] Config validation failed', result.error);
      return AIConfigSchema.parse({ type });
    }
  },

  /**
   * AI 状态组件
   */
  State(isStunned, stunnedTimer, defaultState) {
    const input = {
      state: isStunned ? 'stunned' : defaultState,
      timer: isStunned ? (stunnedTimer || 3.0) : 0
    };

    const result = AIStateSchema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      console.error('[AI] State validation failed', result.error);
      return AIStateSchema.parse({ state: input.state });
    }
  }
}
