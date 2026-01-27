import { z } from 'zod';

/**
 * 场景配置组件 Schema
 */
export const SceneConfigSchema = z.object({
    id: z.string(),
    name: z.string().default('Unknown Scene'),
    width: z.number().default(800),
    height: z.number().default(600),
    groundColor: z.string().default('#000000'),
    // 可以扩展更多场景级别的配置，例如重力、环境光、天气等
    gravity: z.object({
        x: z.number().default(0),
        y: z.number().default(0)
    }).optional().default({ x: 0, y: 0 }),
});

/**
 * 场景配置组件工厂
 */
export const SceneConfig = {
    /**
     * @param {Partial<z.infer<typeof SceneConfigSchema>>} data 
     */
    create(data = {}) {
        const result = SceneConfigSchema.safeParse(data);
        if (!result.success) {
            console.error('[SceneConfig] Validation failed', result.error);
            return SceneConfigSchema.parse({ id: data.id || 'unknown' });
        }
        return result.data;
    }
};
