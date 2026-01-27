import { charactersDb } from '@schema/characters';
import { skillsDb } from '@schema/skills';

/**
 * 生成唯一战斗 ID
 */
export const generateUUID = () => 'u' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

/**
 * 过滤排他性技能（如同类型的被动只生效一个）
 */
export const filterExclusiveSkills = (skillIds) => {
    // 简单的去重，未来可以加入互斥逻辑
    return [...new Set(skillIds)];
};

/**
 * 创建新的战斗单位数据
 * @param {string} dbId 角色/怪物 ID
 * @param {boolean} isPlayer 是否为玩家角色
 * @returns {Object|null} 战斗单位数据
 */
export const createUnit = (dbId, isPlayer = false) => {
    const data = charactersDb[dbId];
    if (!data) return null;

    // 获取基础属性
    const maxHp = data.maxHp || data.hp;
    const maxMp = data.maxMp || data.mp;

    return {
        ...data,
        uuid: data.uuid || generateUUID(),
        // 运行时 HP/MP：优先使用 data 中定义的 currentHp (用于开场不满血)，否则为满值
        currentHp: data.currentHp !== undefined ? data.currentHp : data.hp,
        maxHp: maxHp,
        currentMp: data.currentMp !== undefined ? data.currentMp : data.mp,
        maxMp: maxMp,

        // 基础战斗属性
        atk: data.atk || 50,
        def: data.def || 30,
        mag: data.mag || 10,
        spd: data.spd || 10,

        // 技能：合并初始技能并过滤
        skills: filterExclusiveSkills([...(data.skills || []), ...(data.fixedPassiveSkills || [])]),

        // 状态：优先使用 data 中定义的初始状态 (用于开场带 Buff/Debuff)
        statusEffects: [...(data.statusEffects || [])],

        // 运行时状态
        isDefending: data.isDefending || false,
        atb: data.atb || 0,
        energy: data.energy || 0, // Energy Points (BP)
        isPlayer: isPlayer,
        actionCount: data.actionCount || 0
    };
};

/**
 * 从存档或状态恢复战斗单位
 * @param {Object} state 存档状态
 * @param {boolean} isPlayer 是否为玩家
 * @returns {Object|null} 战斗单位数据
 */
export const hydrateUnit = (state, isPlayer) => {
    if (!state) return null;

    // 对于玩家角色，合并已装备和固定技能
    let battleSkills = state.skills || [];
    if (isPlayer) {
        const equippedActive = (state.equippedActiveSkills || []).filter(id => id !== null);
        const equippedPassive = (state.equippedPassiveSkills || []).filter(id => id !== null);
        const fixedPassive = state.fixedPassiveSkills || [];
        battleSkills = [...equippedActive, ...equippedPassive, ...fixedPassive];
        battleSkills = filterExclusiveSkills([...new Set(battleSkills)]);
    }

    const maxHp = state.maxHp || state.hp;
    const maxMp = state.maxMp || state.mp;

    return {
        ...state,
        uuid: state.uuid || generateUUID(),
        skills: battleSkills,

        // 运行时属性：优先保留 state 中的值（用于存档加载/持久化），否则从基础属性初始化
        currentHp: state.currentHp !== undefined ? state.currentHp : state.hp,
        maxHp: maxHp,
        currentMp: state.currentMp !== undefined ? state.currentMp : state.mp,
        maxMp: maxMp,

        atk: state.atk || 50,
        def: state.def || 30,
        mag: state.mag || 10,
        spd: state.spd || 10,

        // 状态
        statusEffects: state.statusEffects ? [...state.statusEffects] : [],
        isDefending: state.isDefending || false,
        atb: state.atb || 0,
        energy: state.energy || 0,
        isPlayer: isPlayer,
        actionCount: state.actionCount || 0
    };
};
