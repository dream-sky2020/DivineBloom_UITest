/**
 * 战斗状态检查系统 (Check Battle Status System)
 */

/**
 * 检查战斗是否结束（胜利、失败或继续）
 * @param {Object} facade BattleFacade 实例
 * @param {Object} state { enemies, partySlots, triggeredEnemyUuid }
 * @param {Object} config { itemsDb }
 * @param {Object} callbacks { onLog, onVictory, onDefeat, onAddLoot, onUpdateParty, onNotifyECS }
 * @returns {boolean} 是否战斗结束
 */
export const checkBattleStatus = (facade, state, config, callbacks) => {
    const { enemies, partySlots, triggeredEnemyUuid } = state;
    const { itemsDb } = config;
    const { onLog, onVictory, onDefeat, onAddLoot, onUpdateParty, onNotifyECS } = callbacks;

    const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

    const allEnemiesDead = enemies.every(e => isDead(e));
    if (allEnemiesDead) {
        onVictory(triggeredEnemyUuid);
        onLog('battle.victory');

        const allDrops = [];
        enemies.forEach(enemy => {
            const drops = facade.calculateDrops(enemy);
            if (drops.length > 0) {
                allDrops.push(drops);
            }
        });
        const finalDrops = facade.loot.mergeDrops(allDrops);

        finalDrops.forEach(drop => {
            onAddLoot(drop.itemId, drop.qty);
            const item = itemsDb[drop.itemId];
            if (item) {
                onLog('battle.foundLoot', { item: item.name, qty: drop.qty });
            }
        });

        onUpdateParty(partySlots);
        onNotifyECS('victory', finalDrops);
        return true;
    }

    const allPlayersDead = partySlots.every(s =>
        (!s.front || isDead(s.front)) &&
        (!s.back || isDead(s.back))
    );
    if (allPlayersDead) {
        onDefeat(triggeredEnemyUuid);
        onLog('battle.defeat');
        onNotifyECS('defeat');
        return true;
    }

    return false;
};
