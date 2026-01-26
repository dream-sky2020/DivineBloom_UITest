import { world } from '@world2d/world';

/**
 * 场景时间系统
 * 负责更新全局计时器组件
 */
export const TimeSystem = {
    /**
     * @param {number} dt 
     */
    update(dt) {
        const entities = world.with('timer');
        for (const entity of entities) {
            if (entity.timer.running) {
                entity.timer.totalTime += dt;
            }
        }
    }
};
