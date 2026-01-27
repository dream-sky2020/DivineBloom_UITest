import { z } from 'zod';

/**
 * 场景过渡请求 Schema
 */
export const SceneTransitionSchema = z.object({
    mapId: z.string(),
    entryId: z.string(),
    transitionType: z.string().default('fade')
});

/**
 * 请求切换地图
 * @param {z.infer<typeof SceneTransitionSchema>} data 
 */
export function SceneTransition(data) {
    const result = SceneTransitionSchema.safeParse(data);
    if (!result.success) {
        console.error('[SceneTransition] Validation failed', result.error);
        return null;
    }
    return result.data;
}
