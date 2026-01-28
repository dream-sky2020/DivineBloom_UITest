/**
 * 能量调整系统 (Adjust Boost System)
 */

/**
 * 计算新的能量等级
 * @param {string|number} delta 变化量或 'reset'
 * @param {number} currentBoost 当前能量等级
 * @param {Object} actor 当前行动者
 * @returns {number} 新的能量等级
 */
export const calculateBoostLevel = (delta, currentBoost, actor) => {
    if (!actor || !actor.isPlayer) return 0;

    let newLevel;
    if (delta === 'reset') {
        newLevel = 0;
    } else {
        newLevel = currentBoost + delta;
    }

    const maxBoost = 3; 
    const currentEnergy = actor.energy || 0;
    newLevel = Math.max(0, Math.min(newLevel, currentEnergy, maxBoost));
    return newLevel;
};
