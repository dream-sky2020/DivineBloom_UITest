/**
 * ATB 更新系统 (Update ATB System)
 */

/**
 * 更新所有单位的 ATB 值
 * @param {Object} facade BattleFacade 实例
 * @param {number} dt 增量时间
 * @param {Object} state { enemies, partySlots, atbPaused, battleState }
 * @param {Object} callbacks { onStartTurn }
 */
export const updateATB = (facade, dt, state, callbacks) => {
    const { enemies, partySlots, atbPaused, battleState } = state;
    const { onStartTurn } = callbacks;

    if (battleState !== 'active' || atbPaused) return;

    const MAX_ATB = 100;
    const MAX_BP = 6;
    const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

    const unitEntries = [];
    enemies.forEach(e => {
        if (!isDead(e)) unitEntries.push({ unit: e, isBackRow: false });
    });
    partySlots.forEach(slot => {
        if (slot.front && !isDead(slot.front)) unitEntries.push({ unit: slot.front, isBackRow: false });
        if (slot.back && !isDead(slot.back)) unitEntries.push({ unit: slot.back, isBackRow: true });
    });

    for (const { unit, isBackRow } of unitEntries) {
        const tick = facade.time.calculateAtbTick(unit, dt);

        if (isBackRow) {
            unit.atb = (unit.atb || 0) + tick;
        } else {
            unit.atb = Math.min(MAX_ATB, (unit.atb || 0) + tick);
        }

        if (unit.atb >= MAX_ATB) {
            if (isBackRow) {
                unit.atb -= MAX_ATB;
                unit.energy = Math.min(MAX_BP, (unit.energy || 0) + 2);
            } else if (!atbPaused) {
                unit.atb = MAX_ATB;
                unit.energy = Math.min(MAX_BP, (unit.energy || 0) + 1);
                onStartTurn(unit);
                return;
            }
        }
    }
};
