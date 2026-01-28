/**
 * 回合开始处理系统 (Start Turn Action)
 */

/**
 * 处理回合开始逻辑
 * @param {Object} facade BattleFacade 实例
 * @param {Object} unit 当前单位
 * @param {Object} state { context }
 * @param {Object} callbacks { onLog, onEndTurn, onProcessEnemyTurn, onWaitInput }
 */
export const startTurn = (facade, unit, state, callbacks) => {
    const { context } = state;
    const { onLog, onEndTurn, onProcessEnemyTurn, onWaitInput } = callbacks;

    const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

    // 触发回合开始被动和状态效果处理
    facade.skill.processPassiveTrigger(unit, 'turn_start', context);
    facade.effect.processTurnStatuses(unit, context);

    if (isDead(unit)) {
        onEndTurn(unit);
        return;
    }

    // 检查是否无法行动 (眩晕等控制效果)
    const cannotMove = facade.status.checkCrowdControl(unit);
    if (cannotMove) {
        onLog('battle.cannotMove', { name: unit.name });
        facade.skill.processPassiveTrigger(unit, 'on_cc_skip', context);
        setTimeout(() => onEndTurn(unit), 1000);
        return;
    }

    if (!unit.isPlayer) {
        onProcessEnemyTurn(unit);
    } else {
        onWaitInput();
    }
};
