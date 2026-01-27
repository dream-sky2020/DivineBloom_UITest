import { z } from 'zod';

// --- Schema Definition ---
export const TimerSchema = z.object({
    totalTime: z.number().default(0), // 累计运行时间（秒）
    running: z.boolean().default(true) // 是否正在计时
});

// --- Component Factory ---
export const Timer = {
    /**
     * 创建计时器组件
     * @param {Partial<z.infer<typeof TimerSchema>>} data 
     * @returns 
     */
    create(data = {}) {
        const result = TimerSchema.safeParse(data);
        if (!result.success) {
            console.warn('[Timer] Validation failed, using defaults', result.error);
            return TimerSchema.parse({});
        }
        return result.data;
    }
};
