import { z } from 'zod';
import { ID, LocalizedStringSchema } from '../common.js';
import { StatusEffectSchema } from '../effects.js';

// --- 状态 (Status) Schema ---
// StatusEffectSchema 现在从 effects.js 导入，提供完整的类型检查

export const StatusSchema = z.object({
    id: ID,
    name: LocalizedStringSchema,
    type: z.string(), // "statusTypes.buff"
    icon: z.string().optional(),
    subText: LocalizedStringSchema.optional(),
    description: LocalizedStringSchema.optional(),

    // 生命周期控制
    // 'turn': 标准回合制，每回合-1 (默认)
    // 'action': 行动消耗制
    // 'none': 不自动减少（用于弹药、光环、永久被动）
    decayMode: z.enum(['turn', 'action', 'none']).optional().default('turn'),

    // 状态特性
    persistent: z.boolean().optional().default(false), // 战斗结束后是否保留
    stackable: z.boolean().optional().default(false), // 是否可堆叠

    // 战斗属性
    deathChance: z.number().min(0).max(1).optional(), // 濒死状态下的死亡概率

    effects: z.array(StatusEffectSchema).optional().default([]),

    // --- 运行时属性 (Runtime) ---
    uuid: z.string().optional(), // 实例唯一ID
    duration: z.number().int().optional().default(3), // 剩余持续时间
    stacks: z.number().int().optional().default(1), // 当前堆叠数
    value: z.any().optional(), // 存储额外动态数据 (如伤害数值、来源等)
    sourceId: ID.optional(), // 来源单位ID
    targetId: ID.optional(), // 目标单位ID
});
