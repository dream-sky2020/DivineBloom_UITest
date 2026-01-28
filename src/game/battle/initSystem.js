/**
 * 战斗初始化系统 (Init System)
 * 负责战斗的初始化、开始、阶段转换等流程逻辑
 */

/**
 * 初始化战斗单位（包括敌人和玩家队伍）
 * @param {Object} facade BattleFacade 实例，用于调用 unit 相关方法
 * @param {Object} options
 * @param {Array} options.enemyList 敌人基础数据列表 (可选)
 * @param {Array} options.partyFormation 队伍阵型数据
 * @param {Function} options.getCharacterState 获取角色状态的回调
 * @returns {Object} { enemies, partySlots }
 */
export const setupBattle = (facade, { enemyList, partyFormation, getCharacterState }) => {
    let enemies = [];
    if (enemyList && enemyList.length > 0) {
        enemies = enemyList.map(e => {
            if (e.id) {
                const base = facade.createUnit(e.id, false);
                if (base) {
                    return { ...base, ...e, atb: 0, isPlayer: false, actionCount: 0 };
                }
            }
            return { ...e, atb: 0, isPlayer: false, actionCount: 0 };
        });
    } else {
        // 默认 Mock 敌人
        const mockIds = [
            'character_emperor_shenwu',
            'character_shahryar',
            'character_hefietian',
            'character_yibitian'
        ];
        enemies = mockIds.map(id => facade.createUnit(id, false)).filter(e => e !== null);
    }

    const partySlots = partyFormation.map(slot => ({
        front: facade.hydrateUnit(getCharacterState(slot.front), true),
        back: facade.hydrateUnit(getCharacterState(slot.back), true)
    }));

    return { enemies, partySlots };
};

/**
 * 战斗开始时的统一处理（如触发被动技能、记录日志）
 * @param {Object} facade BattleFacade 实例
 * @param {Array} allUnits 所有参与战斗的单位
 * @param {Object} context 战斗上下文
 */
export const onBattleStart = (facade, allUnits, context) => {
    facade.trigger('log', 'battle.started');
    
    allUnits.forEach(unit => {
        if (unit) {
            facade.skill.processPassiveTrigger(unit, 'battle_start', context);
        }
    });
};
