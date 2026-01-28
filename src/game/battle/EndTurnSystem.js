/**
 * 回合结束处理系统 (End Turn System)
 */

/**
 * 执行回合结束清理逻辑
 * @param {Object} unit 当前单位
 * @param {Object} callbacks { onCheckStatus }
 */
export const endTurn = (unit, callbacks) => {
    // 扣除 ATB 基础值 (防止连续行动，模拟回复开销)
    unit.atb = -25;
    
    // 检查战斗胜负状态
    callbacks.onCheckStatus();
};
