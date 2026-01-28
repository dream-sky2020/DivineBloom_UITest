/**
 * 待处理动作目标选择系统 (Set Pending Action System)
 */

/**
 * 获取动作的合法目标 ID 列表
 * @param {Object} facade BattleFacade 实例
 * @param {Object} action 动作对象
 * @param {Object} state 战斗状态 { partySlots, enemies, actor }
 * @returns {Array} 合法目标 ID 列表
 */
export const getValidTargetIds = (facade, action, state) => {
    if (action && action.targetType) {
        return facade.target.getValidTargetIds({
            partySlots: state.partySlots,
            enemies: state.enemies,
            actor: state.actor
        }, action.targetType);
    }
    return [];
};
