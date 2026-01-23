import { z } from 'zod';
import { ID, LocalizedStringSchema, StatsSchema } from '../common.js';
import { SkillEffectSchema } from '../effects.js';

// --- 物品 (Item) Schema ---

export const ItemSchema = z.object({
    id: ID,
    name: LocalizedStringSchema,
    type: z.string(), // e.g. "itemTypes.consumable"
    icon: z.string(),
    subText: LocalizedStringSchema,
    footerLeft: z.string(),
    description: LocalizedStringSchema,

    // 可选字段
    targetType: z.string().optional(), // 消耗品特有
    consumeTurn: z.boolean().optional(), // 是否消耗回合，默认为 true (仅消耗品有效)
    effects: z.array(SkillEffectSchema).optional(), // 消耗品特有
    price: z.number().optional(),

    // 装备特有 (StatsSchema 是所有属性可选，符合装备加成)
    stats: StatsSchema.optional(),
});
