import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { charactersDb } from '@/data/characters';
import { skillsDb } from '@/data/skills';
import { itemsDb } from '@/data/items';
import { statusDb } from '@/data/status';
import { useInventoryStore } from './inventory';
import { usePartyStore } from './party';
import { getEnemyAction } from '@/game/ai';
import { calculateDamage, applyDamage, applyHeal } from '@/game/battle/mechanics';
import { processEffect, processTurnStatuses } from '@/game/battle/effects';
import { applyStatus, removeStatus, checkCrowdControl } from '@/game/battle/status';

export const useBattleStore = defineStore('battle', () => {
    const inventoryStore = useInventoryStore();
    const partyStore = usePartyStore();

    // --- State ---
    const enemies = ref([]);
    const partySlots = ref([]);
    const turnCount = ref(1);
    const battleState = ref('idle'); // idle, active, victory, defeat
    const battleLog = ref([]);
    const atbPaused = ref(false);
    const activeUnit = ref(null); // The unit currently acting (Player or Enemy)

    // --- Getters ---
    const activeCharacter = computed(() => {
        // Return activeUnit if it is a player character
        if (activeUnit.value && activeUnit.value.isPlayer) {
            return activeUnit.value;
        }
        return null;
    });

    const isPlayerTurn = computed(() => {
        return !!activeCharacter.value && atbPaused.value;
    });

    // Get Battle Items (Consumables only)
    const battleItems = computed(() => {
        return inventoryStore.getAllItems.filter(item => item.type === 'itemTypes.consumable');
    });

    // --- Actions ---

    // Build Context for Mechanics
    const getContext = () => ({
        log,
        performSwitch,
        partySlots: partySlots.value,
        enemies: enemies.value
    });

    // Helper to find any party member
    const findPartyMember = (id) => {
        for (const slot of partySlots.value) {
            if (slot.front && slot.front.id === id) return slot.front;
            if (slot.back && slot.back.id === id) return slot.back;
        }
        return null;
    };

    const createUnit = (dbId, isPlayer = false) => {
        const data = charactersDb[dbId];
        if (!data) return null;
        return {
            ...data,
            // Ensure runtime stats are initialized from initialStats
            currentHp: data.initialStats.hp,
            maxHp: data.initialStats.hp,
            currentMp: data.initialStats.mp,
            maxMp: data.initialStats.mp,
            atk: data.initialStats.atk || 50,
            def: data.initialStats.def || 30,
            spd: data.initialStats.spd || 10,
            mag: data.initialStats.mag || 10,
            // Runtime state
            skills: data.skills || [], // Load skills from data
            statusEffects: [],
            isDefending: false,
            atb: 0,
            isPlayer: isPlayer,
            actionCount: 0
        };
    };

    const hydrateUnit = (state, isPlayer) => {
        if (!state) return null;
        return {
            ...state,
            // Runtime state for battle
            statusEffects: [],
            isDefending: false,
            atb: 0,
            isPlayer: isPlayer,
            actionCount: 0
        };
    };

    // Initialize Battle
    const initBattle = (enemyList) => {
        // Reset state
        turnCount.value = 1;
        battleLog.value = [];
        activeUnit.value = null;
        atbPaused.value = false;

        // Setup Enemies
        if (enemyList) {
            enemies.value = enemyList.map(e => {
                // Try to hydrate from DB if ID exists
                if (e.id && charactersDb[e.id]) {
                    const base = createUnit(e.id, false);
                    // Merge overrides (like currentHp) from the passed object
                    return { ...base, ...e, atb: 0, isPlayer: false, actionCount: 0 };
                }
                return { ...e, atb: 0, isPlayer: false, actionCount: 0 };
            });
        } else {
            // Default Mock Enemies - Loaded from charactersDb using helper
            enemies.value = [
                createUnit(101, false),
                createUnit(102, false),
                createUnit(103, false),
                createUnit(104, false)
            ].filter(e => e !== null);
        }

        // Setup Party (Load from PartyStore)
        partyStore.initParty();
        partySlots.value = partyStore.formation.map(slot => ({
            front: hydrateUnit(partyStore.getCharacterState(slot.front), true),
            back: hydrateUnit(partyStore.getCharacterState(slot.back), true)
        }));

        battleState.value = 'active';
        log('battle.started');
    };

    // ATB Tick
    const updateATB = (dt) => {
        if (battleState.value !== 'active' || atbPaused.value) return;

        const ATB_SPEED_MULTIPLIER = 2.0; // Adjust for pacing
        const MAX_ATB = 100;
        const RESERVE_MAX_ATB = 500; // Allow reserve to overcharge

        // Collect all active units with metadata to avoid repeated lookups
        const unitEntries = [];
        enemies.value.forEach(e => {
            if (e.currentHp > 0) unitEntries.push({ unit: e, isBackRow: false });
        });
        partySlots.value.forEach(slot => {
            if (slot.front && slot.front.currentHp > 0) unitEntries.push({ unit: slot.front, isBackRow: false });
            if (slot.back && slot.back.currentHp > 0) unitEntries.push({ unit: slot.back, isBackRow: true });
        });

        // Increment ATB
        for (const { unit, isBackRow } of unitEntries) {
            const maxAtb = isBackRow ? RESERVE_MAX_ATB : MAX_ATB;

            // Speed factor
            let spd = unit.spd || 10;
            // Apply status modifiers
            if (unit.statusEffects) {
                unit.statusEffects.forEach(s => {
                    const statusDef = statusDb[s.id];
                    if (statusDef && statusDef.effects) {
                        statusDef.effects.forEach(eff => {
                            if (eff.trigger === 'passive' && eff.type === 'statMod' && eff.stat === 'spd') {
                                spd *= eff.value;
                            }
                        });
                    }
                });
            }

            unit.atb = Math.min(maxAtb, unit.atb + (spd * dt * ATB_SPEED_MULTIPLIER));

            // Only trigger turn for non-back row units
            if (!isBackRow && unit.atb >= MAX_ATB && !atbPaused.value) {
                // Unit is ready
                unit.atb = MAX_ATB;
                startTurn(unit);
                // Break to handle one unit at a time (could queue them, but for now strict pause)
                return;
            }
        }
    };

    const startTurn = (unit) => {
        atbPaused.value = true;
        activeUnit.value = unit;
        unit.isDefending = false; // Reset Defend at start of turn

        // Process Turn Start Statuses (DoT, HoT)
        processTurnStatuses(unit, getContext());

        // Check if unit died from status
        if (unit.currentHp <= 0) {
            endTurn(unit);
            return;
        }

        // Check Crowd Control (Stun/Freeze)
        const cannotMove = checkCrowdControl(unit);
        if (cannotMove) {
            log('battle.cannotMove', { name: unit.name });
            setTimeout(() => {
                endTurn(unit);
            }, 1000);
            return;
        }

        if (!unit.isPlayer) {
            // Enemy Logic
            processEnemyTurn(unit);
        } else {
            // Player Logic: Waiting for UI input
            // UI will see isPlayerTurn = true
        }
    };

    const endTurn = (unit) => {
        // Set to negative value to provide a visual "cooldown" where the bar stays empty for a bit
        unit.atb = -25;
        activeUnit.value = null;
        atbPaused.value = false;
        checkBattleStatus();
    };

    const processEnemyTurn = async (enemy) => {
        // Delay for dramatic effect
        setTimeout(() => {
            if (enemy.currentHp <= 0) {
                endTurn(enemy);
                return;
            }

            // Increment Action Count
            if (typeof enemy.actionCount === 'undefined') enemy.actionCount = 0;
            enemy.actionCount++;

            // Context
            const context = {
                actor: enemy,
                party: partySlots.value,
                turnCount: turnCount.value
            };

            const action = getEnemyAction(enemy.id, context);

            if (!action) {
                endTurn(enemy);
                return;
            }

            if (action.type === 'custom_skill') {
                // Log
                if (action.logKey) {
                    let logParams = { name: enemy.name };
                    if (action.targetType === 'single' && action.targetId) {
                        const t = findPartyMember(action.targetId);
                        if (t) logParams.target = t.name;
                    }
                    log(action.logKey, logParams);
                }

                // Resolve Targets
                let targets = [];
                if (action.targetType === 'all') {
                    targets = partySlots.value
                        .filter(s => s.front && s.front.currentHp > 0)
                        .map(s => s.front);
                } else if (action.targetType === 'single' && action.targetId) {
                    const t = findPartyMember(action.targetId);
                    if (t) targets = [t];
                }

                // Apply Effects
                targets.forEach(target => {
                    if (action.effects) {
                        let lastResult = 0;
                        action.effects.forEach(eff => {
                            lastResult = processEffect(eff, target, enemy, null, getContext(), false, lastResult);
                        });
                    }
                });

            } else if (action.type === 'skill') {
                const skill = skillsDb[action.skillId];
                if (skill) {
                    // Log: Always use generic 'useSkill' format
                    log('battle.useSkill', { user: enemy.name, skill: skill.name });

                    // Resolve Targets
                    let targets = [];
                    // Check AI override first, then skill data
                    const targetType = action.targetType || skill.targetType;

                    if (targetType === 'allEnemies' || targetType === 'all') { // For enemy using skill, 'allEnemies' means Players
                        targets = partySlots.value
                            .filter(s => s.front && s.front.currentHp > 0)
                            .map(s => s.front);
                    } else if (targetType === 'single' || targetType === 'enemy') {
                        const t = findPartyMember(action.targetId);
                        if (t) targets = [t];
                        else {
                            // Fallback if AI didn't provide targetId but it's single target
                            const alive = partySlots.value.filter(s => s.front && s.front.currentHp > 0).map(s => s.front);
                            if (alive.length > 0) targets = [alive[Math.floor(Math.random() * alive.length)]];
                        }
                    }

                    // Apply Effects
                    targets.forEach(target => {
                        if (skill.effects) {
                            let lastResult = 0;
                            skill.effects.forEach(eff => {
                                lastResult = processEffect(eff, target, enemy, skill, getContext(), false, lastResult);
                            });
                        }
                    });
                }
            } else if (action.type === 'attack') {
                const target = findPartyMember(action.targetId);
                if (target) {
                    log('battle.attacks', { attacker: enemy.name, target: target.name });
                    const dmg = calculateDamage(enemy, target);
                    applyDamage(target, dmg, getContext());
                }
            }

            endTurn(enemy);
        }, 1000);
    };

    // Player Actions
    const playerAction = async (actionType, payload = null) => {
        if (!activeUnit.value || !activeUnit.value.isPlayer) return;

        const actor = activeUnit.value;

        // Normalize payload
        let targetId = null;
        let skillId = null;
        let itemId = null;

        if (typeof payload === 'object' && payload !== null) {
            targetId = payload.targetId;
            skillId = payload.skillId;
            itemId = payload.itemId;
        } else {
            skillId = payload; // Legacy support
        }

        let actionDone = true;

        if (actionType === 'item') {
            if (!itemId) return;

            // Consume Item
            inventoryStore.removeItem(itemId, 1);
            const item = itemsDb[itemId];
            log('battle.useItem', { user: actor.name, item: item.name });

            // Centralized Item Logic
            handleItemEffect(itemId, targetId, actor);

        } else if (actionType === 'skill') {
            const skill = skillsDb[skillId];
            if (skill) {
                // Deduct MP
                const cost = parseInt(skill.cost) || 0;
                if (actor.currentMp < cost) {
                    log('battle.notEnoughMp');
                    return; // Don't end turn
                }
                actor.currentMp -= cost;
                log('battle.useSkill', { user: actor.name, skill: skill.name });

                // Skill Logic
                if (skill.effects) {
                    if (skill.chain) {
                        // Chain Logic
                        let currentTarget = enemies.value.find(e => e.id === targetId) || enemies.value.find(e => e.currentHp > 0);
                        let bounceCount = skill.chain;
                        let multiplier = 1.0;
                        const hitIds = new Set();

                        for (let i = 0; i < bounceCount; i++) {
                            if (!currentTarget) break;
                            hitIds.add(currentTarget.id);

                            // Process effects and capture damage
                            let damageDealt = 0;
                            skill.effects.forEach(eff => {
                                const finalEffect = { ...eff };
                                if (finalEffect.type === 'damage') {
                                    finalEffect.value *= multiplier;
                                }
                                // Use silent=true to suppress default logs, we log manually below
                                const val = processEffect(finalEffect, currentTarget, actor, skill, getContext(), true);
                                if (finalEffect.type === 'damage') damageDealt += val;
                            });

                            log('battle.chainHit', { count: i + 1, target: currentTarget.name, amount: damageDealt });

                            multiplier *= (skill.decay || 0.85);

                            // Find next target (random alive enemy not yet hit)
                            const candidates = enemies.value.filter(e => e.currentHp > 0 && !hitIds.has(e.id));
                            if (candidates.length === 0) break;
                            currentTarget = candidates[Math.floor(Math.random() * candidates.length)];
                        }
                    } else {
                        // Generic Effect Processing
                        // Refactored: Resolve Targets First to support dependent effects (e.g. drain)
                        let targets = [];

                        if (skill.targetType === 'allEnemies') {
                            targets = enemies.value.filter(e => e.currentHp > 0);
                        } else if (skill.targetType === 'allAllies') {
                            partySlots.value.forEach(slot => {
                                if (slot.front && slot.front.currentHp > 0) targets.push(slot.front);
                                if (slot.back && slot.back.currentHp > 0) targets.push(slot.back);
                            });
                        } else if (skill.targetType === 'allDeadAllies') {
                            partySlots.value.forEach(slot => {
                                if (slot.front && slot.front.currentHp <= 0) targets.push(slot.front);
                                if (slot.back && slot.back.currentHp <= 0) targets.push(slot.back);
                            });
                        } else if (skill.targetType === 'allUnits') {
                            // Enemies
                            enemies.value.forEach(enemy => { if (enemy.currentHp > 0) targets.push(enemy); });
                            // Allies
                            partySlots.value.forEach(slot => {
                                if (slot.front && slot.front.currentHp > 0) targets.push(slot.front);
                                if (slot.back && slot.back.currentHp > 0) targets.push(slot.back);
                            });
                        } else if (skill.targetType === 'allOtherUnits') {
                            // All Enemies
                            enemies.value.forEach(enemy => { if (enemy.currentHp > 0) targets.push(enemy); });
                            // All Allies EXCEPT actor
                            partySlots.value.forEach(slot => {
                                if (slot.front && slot.front.currentHp > 0 && slot.front.id !== actor.id) targets.push(slot.front);
                                if (slot.back && slot.back.currentHp > 0 && slot.back.id !== actor.id) targets.push(slot.back);
                            });
                        } else if (skill.targetType === 'allOtherAllies') {
                            partySlots.value.forEach(slot => {
                                if (slot.front && slot.front.currentHp > 0 && slot.front.id !== actor.id) targets.push(slot.front);
                                if (slot.back && slot.back.currentHp > 0 && slot.back.id !== actor.id) targets.push(slot.back);
                            });
                        } else {
                            // Single Target
                            let target = null;
                            if (skill.targetType === 'ally' || skill.targetType === 'deadAlly') {
                                target = targetId ? findPartyMember(targetId) : actor;
                            } else if (skill.targetType === 'enemy') {
                                target = enemies.value.find(e => e.id === targetId) || enemies.value.find(e => e.currentHp > 0);
                            }
                            if (target) targets.push(target);
                        }

                        // Apply Effects
                        targets.forEach(target => {
                            let lastResult = 0;
                            skill.effects.forEach(effect => {
                                lastResult = processEffect(effect, target, actor, skill, getContext(), false, lastResult);
                            });
                        });
                    }
                }
            }
        } else if (actionType === 'attack') {
            log('battle.attackStart', { attacker: actor.name });

            // Resolve Target
            let target = enemies.value.find(e => e.id === targetId);
            if (!target) {
                target = enemies.value.find(e => e.currentHp > 0);
            }

            if (target) {
                const dmg = calculateDamage(actor, target);
                applyDamage(target, dmg, getContext());
            }
        } else if (actionType === 'defend') {
            actor.isDefending = true;
            log('battle.defending', { name: actor.name });
        } else if (actionType === 'switch') {
            // Find slot index for this actor
            const slotIndex = partySlots.value.findIndex(s => s.front && s.front.id === actor.id);
            if (slotIndex !== -1) {
                const slot = partySlots.value[slotIndex];
                if (slot && slot.back && slot.back.currentHp > 0) {
                    performSwitch(slotIndex);
                } else {
                    log('battle.cannotSwitch');
                    return; // Don't end turn
                }
            }
        } else if (actionType === 'skip') {
            log('battle.skipTurn', { name: actor.name });
        }

        if (actionDone) {
            endTurn(actor);
        }
    };


    const handleItemEffect = (itemId, targetId, actor) => {
        const item = itemsDb[itemId];
        if (!item || !item.effects) return;

        // Resolve Target (if single target effect needs it)
        let target = null;
        if (item.targetType === 'ally' || item.targetType === 'deadAlly') {
            target = findPartyMember(targetId);
            if (!target && item.targetType === 'ally') target = actor; // Fallback to self
        } else if (item.targetType === 'enemy') {
            target = enemies.value.find(e => e.id === targetId);
            if (!target) target = enemies.value.find(e => e.currentHp > 0);
        }

        // Apply all effects
        item.effects.forEach(effect => {
            if (item.targetType === 'allDeadAllies') {
                partySlots.value.forEach(slot => {
                    if (slot.front && slot.front.currentHp <= 0) processEffect(effect, slot.front, actor, null, getContext());
                    if (slot.back && slot.back.currentHp <= 0) processEffect(effect, slot.back, actor, null, getContext());
                });
            } else if (item.targetType === 'allAllies') {
                partySlots.value.forEach(slot => {
                    if (slot.front && slot.front.currentHp > 0) processEffect(effect, slot.front, actor, null, getContext());
                    if (slot.back && slot.back.currentHp > 0) processEffect(effect, slot.back, actor, null, getContext());
                });
            } else {
                processEffect(effect, target, actor, null, getContext());
            }
        });
    };

    // --- Status System ---
    // (Moved to status.js, kept here for store action references if needed, but actually we use the imported ones now via processEffect)
    // The internal status helpers (applyStatus, removeStatus) are no longer needed here as they are imported by effects.js.
    // However, if processATB (updateATB) or other logic needs them, we should update those too.

    // Note: updateATB uses status effects for speed calculation, which is read-only.
    // processTurnStatuses is called in startTurn.

    // We can remove the local definitions of processEffect, applyStatus, removeStatus, processTurnStatuses, checkCrowdControl, performSwitch (wait, performSwitch is used by applyDamage callback, so it must stay or be passed)

    // performSwitch needs access to partySlots.value (ref), so it should stay in the store.
    // applyDamage needs to call performSwitch. We pass performSwitch in getContext().

    const performSwitch = (slotIndex) => {
        const slot = partySlots.value[slotIndex];
        if (slot && slot.back) {
            const temp = slot.front;
            slot.front = slot.back;
            slot.back = temp;

            // Switching in clears defense
            if (slot.front) slot.front.isDefending = false;
            // Initialize ATB for new char (maybe partial?)
            if (slot.front.atb === undefined) slot.front.atb = 0;
            slot.front.isPlayer = true; // Ensure flag

            log('battle.switchIn', { name: slot.front.name });
        }
    };

    // Removing old function definitions that are now imported or unused
    // processEffect, applyStatus, removeStatus, processTurnStatuses, checkCrowdControl, applyDamage, applyHeal are removed from here.

    const checkBattleStatus = () => {
        const allEnemiesDead = enemies.value.every(e => e.currentHp <= 0);
        if (allEnemiesDead) {
            battleState.value = 'victory';
            log('battle.victory');

            // Sync state back to PartyStore
            partyStore.updatePartyAfterBattle(partySlots.value);

            return true;
        }

        const allPlayersDead = partySlots.value.every(s => !s.front || s.front.currentHp <= 0);
        if (allPlayersDead) {
            battleState.value = 'defeat';
            log('battle.defeat');
            return true;
        }
        return false;
    };

    const log = (keyOrMsg, params = {}) => {
        if (typeof keyOrMsg === 'string') {
            const hasParams = params && Object.keys(params).length > 0;
            if (!hasParams && (keyOrMsg.includes(' ') || /[\u4e00-\u9fa5]/.test(keyOrMsg))) {
                battleLog.value.push(`[${new Date().toLocaleTimeString()}] ${keyOrMsg}`);
            } else {
                battleLog.value.push({
                    key: keyOrMsg,
                    params: params || {},
                    timestamp: new Date()
                });
            }
        } else {
            battleLog.value.push(`[${new Date().toLocaleTimeString()}] ${String(keyOrMsg)}`);
        }

        if (battleLog.value.length > 50) battleLog.value.shift();
    };

    return {
        // State
        enemies,
        partySlots,
        turnCount,
        battleState,
        battleLog,
        atbPaused,
        activeUnit,

        // Getters
        activeCharacter,
        isPlayerTurn,
        battleItems,

        // Actions
        initBattle,
        playerAction,
        updateATB
    };
});
