import { z } from 'zod';

/**
 * MousePosition Component Schema
 * 记录鼠标在游戏世界中的坐标位置
 */
export const MousePositionSchema = z.object({
    worldX: z.number().default(0),
    worldY: z.number().default(0),
    screenX: z.number().default(0),
    screenY: z.number().default(0)
});

/**
 * MousePosition Component
 */
export const MousePosition = {
    /**
     * 创建 MousePosition 组件
     * @param {Partial<z.infer<typeof MousePositionSchema>>} data 配置信息
     */
    create(data = {}) {
        const result = MousePositionSchema.safeParse(data);
        if (!result.success) {
            console.warn('[MousePosition] Validation failed, using defaults', result.error);
            return MousePositionSchema.parse({});
        }
        return result.data;
    }
};
