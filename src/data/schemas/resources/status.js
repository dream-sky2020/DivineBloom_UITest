import { z } from 'zod';
import { ID, LocalizedStringSchema } from '../common.js';

// --- 状态 (Status) Schema ---

const StatusEffectSchema = z.object({
    trigger: z.string(), // "turnStart", "passive", "checkAction"
    type: z.string(), // "damage", "statMod", "stun", "heal"
    value: z.number().optional(),
    scaling: z.string().optional(),
    stat: z.string().optional(), // for statMod
    chance: z.number().optional(),
    maxStack: z.number().optional() // 计数器类型最大层数
});

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

    // 堆叠相关
    hasStack: z.boolean().optional(),
    stackLabel: LocalizedStringSchema.optional(),

    effects: z.array(StatusEffectSchema).optional().default([])
});
