import { defineStore } from 'pinia';
import { ref } from 'vue';
import { charactersDb } from '@/data/characters';

export const usePartyStore = defineStore('party', () => {
    // 存储队伍成员的运行时状态
    // Key: Character ID, Value: Object { currentHp, currentMp, ... }
    const members = ref({});
    
    // 简单的队伍编队 (Slot mapping)
    // 0: { front: 5, back: 1 }
    // 1: { front: 6, back: 2 } ...
    const formation = ref([
        { front: 5, back: 1 },
        { front: 6, back: 2 },
        { front: 7, back: 3 },
        { front: 4, back: null }
    ]);

    const reset = () => {
        members.value = {};
        // Reset formation to default or empty? Let's keep default structure but maybe clear chars?
        // For now reset to default formation
        formation.value = [
            { front: 5, back: 1 },
            { front: 6, back: 2 },
            { front: 7, back: 3 },
            { front: 4, back: null }
        ];
    };

    const serialize = () => {
        return {
            members: members.value,
            formation: formation.value
        };
    };

    const loadState = (data) => {
        if (data.members) members.value = data.members;
        if (data.formation) formation.value = data.formation;
    };

    // 初始化队伍（如果尚未初始化）
    const initParty = () => {
        if (Object.keys(members.value).length > 0) return;

        // 加载初始角色状态
        const initialIds = [1, 2, 3, 4, 5, 6, 7]; // 所有可能的角色
        
        initialIds.forEach(id => {
            const dbChar = charactersDb[id];
            if (dbChar) {
                members.value[id] = {
                    id: id,
                    currentHp: dbChar.initialStats.hp,
                    currentMp: dbChar.initialStats.mp,
                    // 可以扩展更多运行时属性，如经验值、等级等
                    level: 1,
                    exp: 0
                };
            }
        });
    };

    // 获取完整的战斗用角色对象（合并 DB 数据和运行时状态）
    const getCharacterState = (id) => {
        if (!id) return null;
        
        // 确保初始化
        initParty();

        const runtime = members.value[id];
        const db = charactersDb[id];
        
        if (!runtime || !db) return null;

        return {
            ...db,
            // 优先使用运行时状态覆盖
            currentHp: runtime.currentHp,
            currentMp: runtime.currentMp,
            
            // 基础属性 (暂不考虑成长，始终读 DB)
            maxHp: db.initialStats.hp, 
            maxMp: db.initialStats.mp,
            atk: db.initialStats.atk || 50,
            def: db.initialStats.def || 30,
            spd: db.initialStats.spd || 10,
            mag: db.initialStats.mag || 10,
            
            skills: db.skills || []
        };
    };

    // 战斗结束后更新状态
    const updatePartyAfterBattle = (battlePartySlots) => {
        battlePartySlots.forEach(slot => {
            if (slot.front) updateMember(slot.front);
            if (slot.back) updateMember(slot.back);
        });
    };

    const updateMember = (battleChar) => {
        const member = members.value[battleChar.id];
        if (member) {
            member.currentHp = Math.max(0, battleChar.currentHp); // 死人可能是0或负，存为0
            member.currentMp = battleChar.currentMp;
            // 可以在这里处理经验值增加
        }
    };

    return {
        members,
        formation,
        initParty,
        getCharacterState,
        updatePartyAfterBattle,
        reset,
        serialize,
        loadState
    };
});

