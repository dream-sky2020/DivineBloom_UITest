import { z } from 'zod';

/**
 * Commands Component Schema
 */
export const CommandsSchema = z.object({
    queue: z.array(z.any()).default([])
});

/**
 * Commands Component
 * 
 * 存储等待执行的任务或指令。
 * 它可以由 UI 触发（如删除、保存、生成），也可以由 ECS 内部系统触发。
 */
export const Commands = {
    /**
     * 创建 Commands 组件
     * @param {Array|Partial<z.infer<typeof CommandsSchema>>} data 初始命令或配置
     */
    create(data = []) {
        const input = Array.isArray(data) ? { queue: data } : data;
        const result = CommandsSchema.safeParse(input);
        if (!result.success) {
            console.warn('[Commands] Validation failed, using defaults', result.error);
            return CommandsSchema.parse({});
        }
        return result.data;
    }
};
