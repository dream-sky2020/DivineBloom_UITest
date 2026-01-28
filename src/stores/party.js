import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { charactersDb } from '@schema/characters';
import { skillsDb } from '@schema/skills';
import { itemsDb } from '@schema/items';

function getAllDefinedItems(count = 10) {
  return Object.keys(itemsDb).map(id => ({
    id,
    count
  }));
}

export const usePartyStore = defineStore('party', () => {
    // --- Party State ---
    const members = ref({});
    const formation = ref([
        { front: 'character_flame_swordsman', back: 'character_tempest_mage' },
        { front: 'character_holy_brawler', back: 'character_blaze_gunner' },
        { front: 'character_don_quixote', back: 'character_scheherazade' },
        { front: 'character_jia_baoyu', back: null }
    ]);

    // --- Inventory State ---
    const inventoryState = ref(getAllDefinedItems());

    // --- Common Actions (Reset, Serialize, Load) ---
    const reset = () => {
        members.value = {};
        formation.value = [
            { front: 'character_flame_swordsman', back: 'character_tempest_mage' },
            { front: 'character_holy_brawler', back: 'character_blaze_gunner' },
            { front: 'character_don_quixote', back: 'character_scheherazade' },
            { front: 'character_jia_baoyu', back: null }
        ];
        inventoryState.value = getAllDefinedItems();
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
        if (data.inventory) inventoryState.value = data.inventory;
    };

    // --- Inventory Actions & Getters ---
    function addItem(itemId, amount = 1) {
        const existingItem = inventoryState.value.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.count += amount;
        } else {
            inventoryState.value.push({ id: itemId, count: amount });
        }
    }

    function removeItem(itemId, amount = 1) {
        const index = inventoryState.value.findIndex(item => item.id === itemId);
        if (index !== -1) {
            const item = inventoryState.value[index];
            if (item.count > amount) {
                item.count -= amount;
            } else {
                inventoryState.value.splice(index, 1);
            }
        }
    }

    const getAllItems = computed(() => {
        return inventoryState.value.map(slot => {
            const dbItem = itemsDb[slot.id];
            if (!dbItem) return null;

            return {
                ...dbItem,
                count: slot.count,
                footerRight: `x${slot.count}`,
                category: mapTypeToCategory(dbItem.type)
            };
        }).filter(item => item !== null);
    });

    function mapTypeToCategory(type) {
        if (type === 'itemTypes.consumable' || type === 'Consumable') return 'Consumables';
        if (type === 'itemTypes.weapon' || type === 'Weapon') return 'Weapons';
        if (type === 'itemTypes.armor' || type === 'Armor') return 'Armor';
        if (type === 'itemTypes.accessory' || type === 'Accessory') return 'Accessories';
        if (type === 'itemTypes.material' || type === 'Material') return 'Materials';
        if (type === 'itemTypes.ammo' || type === 'Ammo') return 'Ammo';
        if (type === 'itemTypes.keyItem' || type === 'Key Item') return 'Key Items';
        return 'Others';
    }

    function getItemsByCategory(category) {
        if (category === 'All') return getAllItems.value;
        return getAllItems.value.filter(item => item.category === category);
    }

    // --- Party Actions & Getters ---
    const initParty = () => {
        if (Object.keys(members.value).length > 0) return;

        // 加载初始角色状态
        const initialIds = [
            'character_flame_swordsman',
            'character_blaze_gunner', 
            'character_tempest_mage',
            'character_holy_brawler',
            'character_don_quixote',
            'character_jia_baoyu',
            'character_scheherazade'
        ];
        
        initialIds.forEach(id => {
            const dbChar = charactersDb[id];
            if (dbChar) {
                const activeLimit = dbChar.activeSkillLimit || 6;
                const passiveLimit = dbChar.passiveSkillLimit || 4;

                // Initialize slots with null
                let equippedActive = Array(activeLimit).fill(null);
                let equippedPassive = Array(passiveLimit).fill(null);
                
                // If DB has skills, try to auto-equip them into slots
                const dbEquippedActive = dbChar.equippedActiveSkills || [];
                const dbEquippedPassive = dbChar.equippedPassiveSkills || [];

                dbEquippedActive.forEach((skillId, index) => {
                    if (index < activeLimit) equippedActive[index] = skillId;
                });
                dbEquippedPassive.forEach((skillId, index) => {
                    if (index < passiveLimit) equippedPassive[index] = skillId;
                });

                let fixedPassive = dbChar.fixedPassiveSkills ? [...dbChar.fixedPassiveSkills] : [];
                
                // Force include core death passives as fixed if not present
                if (!fixedPassive.includes('skill_passive_call_of_death')) {
                    fixedPassive.push('skill_passive_call_of_death');
                }
                
                // Auto-equip logic if slots are completely empty
                if (dbEquippedActive.length === 0 && dbEquippedPassive.length === 0 && dbChar.skills && dbChar.skills.length > 0) {
                     let aIdx = 0;
                     let pIdx = 0;
                     for (const skillId of dbChar.skills) {
                        const skill = skillsDb[skillId];
                        if (!skill) continue;
                        
                        if (skill.type === 'skillTypes.passive' || (skillId >= 400 && skillId < 500)) {
                            if (pIdx < passiveLimit) {
                                equippedPassive[pIdx++] = skillId;
                            }
                        } else {
                            if (aIdx < activeLimit) {
                                equippedActive[aIdx++] = skillId;
                            }
                        }
                     }
                }

                members.value[id] = {
                    id: id,
                    currentHp: dbChar.hp,
                    currentMp: dbChar.mp,
                    level: 1,
                    exp: 0,
                    equippedActiveSkills: equippedActive,
                    equippedPassiveSkills: equippedPassive,
                    fixedPassiveSkills: fixedPassive
                };
            }
        });
    };

    // Equip/Unequip Actions
    const equipSkill = (characterId, skillId, isPassive = false) => {
        const member = members.value[characterId];
        const dbChar = charactersDb[characterId];
        if (!member || !dbChar) return false;

        const targetList = isPassive ? member.equippedPassiveSkills : member.equippedActiveSkills;
        
        // Check if already equipped
        if (targetList.includes(skillId)) return true; // Already equipped

        // Find first empty slot
        const emptyIndex = targetList.indexOf(null);
        if (emptyIndex === -1) return false; // Full

        // Check if own the skill
        const allSkills = dbChar.skills || [];
        if (!allSkills.includes(skillId)) return false; // Don't own it

        targetList[emptyIndex] = skillId;
        return true;
    };

    const equipSkillToSlot = (characterId, skillId, slotIndex, isPassive = false) => {
        const member = members.value[characterId];
        const dbChar = charactersDb[characterId];
        if (!member || !dbChar) return false;

        const targetList = isPassive ? member.equippedPassiveSkills : member.equippedActiveSkills;
        const limit = isPassive ? (dbChar.passiveSkillLimit || 4) : (dbChar.activeSkillLimit || 6);

        if (slotIndex < 0 || slotIndex >= limit) return false;

        // Check if own the skill
        const allSkills = dbChar.skills || [];
        if (!allSkills.includes(skillId)) return false;

        // Check if already equipped in another slot
        const existingIndex = targetList.indexOf(skillId);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
            // Remove from old slot
            targetList[existingIndex] = null;
        }

        targetList[slotIndex] = skillId;
        return true;
    };

    const unequipSkill = (characterId, skillId, isPassive = false) => {
        const member = members.value[characterId];
        if (!member) return;

        // Cannot unequip fixed skills
        if (isPassive && member.fixedPassiveSkills && member.fixedPassiveSkills.includes(skillId)) {
            return;
        }

        const targetList = isPassive ? member.equippedPassiveSkills : member.equippedActiveSkills;
        const index = targetList.indexOf(skillId);
        if (index > -1) {
            targetList[index] = null;
        }
    };

    const unequipSkillFromSlot = (characterId, slotIndex, isPassive = false) => {
        const member = members.value[characterId];
        if (!member) return;

        const targetList = isPassive ? member.equippedPassiveSkills : member.equippedActiveSkills;
        const skillId = targetList[slotIndex];
        
        if (!skillId) return;

        // Cannot unequip fixed skills
        if (isPassive && member.fixedPassiveSkills && member.fixedPassiveSkills.includes(skillId)) {
            return;
        }

        targetList[slotIndex] = null;
    };

    // 获取完整的战斗用角色对象（合并 DB 数据和运行时状态）
    const getCharacterState = (id) => {
        if (!id) return null;
        
        // 确保初始化
        initParty();

        const runtime = members.value[id];
        const db = charactersDb[id];
        
        if (!runtime || !db) return null;

        // Merge equipped skills from runtime, fallback to DB if runtime missing (shouldn't happen after init)
        const activeLimit = db.activeSkillLimit || 6;
        const passiveLimit = db.passiveSkillLimit || 4;
        
        const equippedActive = runtime.equippedActiveSkills || Array(activeLimit).fill(null);
        const equippedPassive = runtime.equippedPassiveSkills || Array(passiveLimit).fill(null);
        const fixedPassive = runtime.fixedPassiveSkills || db.fixedPassiveSkills || [];

        return {
            ...db,
            // 优先使用运行时状态覆盖
            currentHp: runtime.currentHp,
            currentMp: runtime.currentMp,
            
            // 基础属性 (暂不考虑成长，始终读 DB)
            maxHp: db.hp, 
            maxMp: db.mp,
            atk: db.atk || 50,
            def: db.def || 30,
            spd: db.spd || 10,
            mag: db.mag || 10,
            
            skills: db.skills || [], // All learned skills
            equippedActiveSkills: [...equippedActive],
            equippedPassiveSkills: [...equippedPassive],
            fixedPassiveSkills: [...fixedPassive],
            activeSkillLimit: activeLimit,
            passiveSkillLimit: passiveLimit
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
        // Party State
        members,
        formation,
        initParty,
        getCharacterState,
        updatePartyAfterBattle,
        equipSkill,
        equipSkillToSlot,
        unequipSkill,
        unequipSkillFromSlot,

        // Inventory State & Actions
        inventoryState,
        addItem,
        removeItem,
        getAllItems,
        getItemsByCategory,

        // Common
        reset,
        serialize,
        loadState
    };
});

