/**
 * 敌人回合处理系统 (Process Enemy Turn System)
 */

/**
 * 处理敌人 AI 决策与行动执行
 * @param {Object} facade BattleFacade 实例
 * @param {Object} enemy 敌人单位
 * @param {Object} state { partySlots, enemies, turnCount, context }
 * @param {Object} callbacks { onLog, onEndTurn, onReProcess }
 */
export const processEnemyTurn = (facade, enemy, state, callbacks) => {
    const { partySlots, enemies, turnCount, context } = state;
    const { onLog, onEndTurn, onReProcess } = callbacks;

    const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

    // 模拟思考延迟
    setTimeout(() => {
        if (isDead(enemy)) {
            onEndTurn(enemy);
            return;
        }

        if (typeof enemy.actionCount === 'undefined') enemy.actionCount = 0;
        enemy.actionCount++;

        // 构建 AI 决策上下文
        const aiContext = {
            actor: enemy,
            party: partySlots,
            enemies: enemies,
            turnCount: turnCount,
            log: onLog
        };

        // 获取 AI 动作
        const action = facade.getEnemyAction(enemy.id, aiContext);

        if (!action || action.type === 'wait') {
            onEndTurn(enemy);
            return;
        }

        // 执行动作
        const result = facade.executeAction(enemy, action, context);

        // 如果动作不消耗回合（如某些快速技能），则递归处理下一次 AI 行动
        if (result && result.consumeTurn === false) {
            onReProcess(enemy);
        } else {
            onEndTurn(enemy);
        }
    }, 1000);
};
