import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { charactersDb } from '@/data/characters';
import { skillsDb } from '@/data/skills';
import { itemsDb } from '@/data/items';
import { statusDb } from '@/data/status';
import { useInventoryStore } from './inventory';

// --- Helper Functions ---

const calculateDamage = (attacker, defender, skill = null, effect = null) => {
    let atk = attacker.atk || 10;
    let def = defender.def || 5;

    // Apply Status Modifiers
    if (attacker.statusEffects) {
        attacker.statusEffects.forEach(s => {
            const statusDef = statusDb[s.id];
            if (statusDef && statusDef.effects) {
                statusDef.effects.forEach(eff => {
                    if (eff.trigger === 'passive' && eff.type === 'statMod' && eff.stat === 'atk') {
                        atk *= eff.value;
                    }
                });
            }
        });
    }
    if (defender.statusEffects) {
        defender.statusEffects.forEach(s => {
            const statusDef = statusDb[s.id];
            if (statusDef && statusDef.effects) {
                statusDef.effects.forEach(eff => {
                    if (eff.trigger === 'passive' && eff.type === 'statMod' && eff.stat === 'def') {
                        def *= eff.value;
                    }
                });
            }
        });
    }

    // Skill modifiers
    let multiplier = 1.0;

    // Check Scaling from Effect or Fallback to generic logic
    if (effect && effect.value) {
        multiplier = effect.value;
    }

    if (skill) {
        if (skill.category === 'skillCategories.magic' || (effect && effect.scaling === 'mag')) {
            // Magic ignores some defense
            def *= 0.7;
            atk = (attacker.currentMp * 0.5) + (attacker.mag * 2 || atk); // Use MAG stat if available
            // Elemental Modifiers
            if (skill.element === 'elements.fire') multiplier *= 1.1;
            // ... more element logic
        } else {
            // Physical
            atk *= 1.0;
        }
    }

    let rawDmg = Math.max(1, (atk * multiplier) - (def / 2));

    // Defend Status
    if (defender.isDefending) {
        rawDmg *= 0.5;
    }

    // Add some randomness +/- 10%
    const variance = (Math.random() * 0.2) + 0.9;
    return Math.floor(rawDmg * variance * 10); // Adjusted scaling
};

export const useBattleStore = defineStore('battle', () => {
    const inventoryStore = useInventoryStore();

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

    // Helper to find any party member
    const findPartyMember = (id) => {
        for (const slot of partySlots.value) {
            if (slot.front && slot.front.id === id) return slot.front;
            if (slot.back && slot.back.id === id) return slot.back;
        }
        return null;
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
            enemies.value = enemyList.map(e => ({ ...e, atb: 0, isPlayer: false, actionCount: 0 }));
        } else {
            // Default Mock Enemies
            enemies.value = [
                {
                    ...charactersDb[101],
                    hp: 50000, maxHp: 50000,
                    isBoss: true, color: '#fbbf24',
                    atk: 50, def: 40, spd: 20, mag: 40,
                    isDefending: false,
                    statusEffects: [],
                    atb: 0,
                    isPlayer: false,
                    actionCount: 0
                },
                {
                    ...charactersDb[102],
                    hp: 45000, maxHp: 45000,
                    isBoss: true, color: '#94a3b8',
                    atk: 45, def: 35, spd: 25, mag: 50,
                    isDefending: false,
                    statusEffects: [],
                    atb: 0,
                    isPlayer: false,
                    actionCount: 0
                },
                {
                    ...charactersDb[103],
                    hp: 60000, maxHp: 60000,
                    isBoss: true, color: '#ef4444',
                    atk: 60, def: 45, spd: 30, mag: 55,
                    isDefending: false,
                    statusEffects: [],
                    atb: 0,
                    isPlayer: false,
                    actionCount: 0
                }
            ];
        }

        // Setup Party (Load from global state or mock)
        partySlots.value = [
            { front: createBattleChar(5, [101, 401]), back: createBattleChar(1, [101]) },
            { front: createBattleChar(6, [102, 203]), back: createBattleChar(2, [102]) },
            { front: createBattleChar(7, [201, 202, 301, 303, 203]), back: createBattleChar(3, [203]) },
            { front: createBattleChar(4, [101, 302]), back: null }
        ];

        battleState.value = 'active';
        log('battle.started');
    };

    const createBattleChar = (dbId, skillIds = []) => {
        const data = charactersDb[dbId];
        if (!data) return null;
        return {
            ...data,
            currentHp: data.initialStats.hp,
            maxHp: data.initialStats.hp,
            currentMp: data.initialStats.mp,
            maxMp: data.initialStats.mp,
            atk: data.initialStats.atk || 50,
            def: data.initialStats.def || 30,
            spd: data.initialStats.spd || 10,
            mag: data.initialStats.mag || 10,
            skills: skillIds, // Assign skills here
            statusEffects: [],
            isDefending: false,
            atb: 0, // Start ATB 0 for consistency
            isPlayer: true
        };
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
            if (e.hp > 0) unitEntries.push({ unit: e, isBackRow: false });
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
        processTurnStatuses(unit);

        // Check if unit died from status
        if ((unit.currentHp || unit.hp) <= 0) {
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
        // Use setTimeout but we are in a store action, ideally we don't block
        // We can just set a timeout to call 'performEnemyAction'

        // Since we want to stop time, we are paused.
        // We can execute logic and then unpause after a delay.

        setTimeout(() => {
            if (enemy.hp <= 0) {
                endTurn(enemy);
                return;
            }

            // Increment Action Count
            if (typeof enemy.actionCount === 'undefined') enemy.actionCount = 0;
            enemy.actionCount++;

            // Find valid targets
            const aliveSlots = partySlots.value.filter(s => s.front && s.front.currentHp > 0);
            if (aliveSlots.length === 0) {
                endTurn(enemy);
                return;
            }
            const allTargets = aliveSlots.map(s => s.front);
            const randomTarget = allTargets[Math.floor(Math.random() * allTargets.length)];

            // AI Logic
            if (enemy.id === 103) { // Hefietian
                if (enemy.actionCount % 2 === 0) {
                    // Even: AOE Fire + Burn
                    log('battle.bossAoeFire', { name: enemy.name });
                    allTargets.forEach(target => {
                        const dmg = calculateDamage(enemy, target, null, { value: 1.2, scaling: 'mag' });
                        applyDamage(target, dmg);
                        applyStatus(target, 2, 3); // Burn
                    });
                } else {
                    // Odd: Single Strong Fire + Burn
                    log('battle.bossSingleFire', { name: enemy.name, target: randomTarget.name });
                    const dmg = calculateDamage(enemy, randomTarget, null, { value: 1.8, scaling: 'str' });
                    applyDamage(randomTarget, dmg);
                    applyStatus(randomTarget, 2, 3); // Burn
                }
            } else if (enemy.id === 102) { // Shahryar
                if (enemy.actionCount % 2 === 0) {
                    // Even: AOE Slash + Bleed
                    log('battle.bossAoeSlash', { name: enemy.name });
                    allTargets.forEach(target => {
                        const dmg = calculateDamage(enemy, target, null, { value: 1.0, scaling: 'str' });
                        applyDamage(target, dmg);
                        applyStatus(target, 5, 3); // Bleed
                    });
                } else {
                    // Odd: Single Slash + Bleed
                    log('battle.bossSingleSlash', { name: enemy.name, target: randomTarget.name });
                    const dmg = calculateDamage(enemy, randomTarget, null, { value: 1.5, scaling: 'str' });
                    applyDamage(randomTarget, dmg);
                    applyStatus(randomTarget, 5, 3); // Bleed
                }
            } else if (enemy.id === 101) { // Emperor Shenwu
                if (enemy.actionCount % 2 !== 0) {
                    // Odd: Single Lightning + Paralysis
                    log('battle.bossSingleLightning', { name: enemy.name, target: randomTarget.name });
                    const dmg = calculateDamage(enemy, randomTarget, null, { value: 1.6, scaling: 'mag' });
                    applyDamage(randomTarget, dmg);
                    applyStatus(randomTarget, 4, 2); // Paralysis
                } else {
                    // Even: AOE Blizzard + Chance Freeze + Chance Slow
                    log('battle.bossAoeIce', { name: enemy.name });
                    allTargets.forEach(target => {
                        const dmg = calculateDamage(enemy, target, null, { value: 1.3, scaling: 'mag' });
                        applyDamage(target, dmg);
                        // Chance Freeze (30%)
                        if (Math.random() < 0.3) applyStatus(target, 3, 1);
                        // Chance Slow (50%)
                        if (Math.random() < 0.5) applyStatus(target, 6, 3);
                    });
                }
            } else {
                // Default AI
                log('battle.attacks', { attacker: enemy.name, target: randomTarget.name });
                const dmg = calculateDamage(enemy, randomTarget);
                applyDamage(randomTarget, dmg);
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
                        let currentTarget = enemies.value.find(e => e.id === targetId) || enemies.value.find(e => e.hp > 0);
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
                                const val = processEffect(finalEffect, currentTarget, actor, skill, true);
                                if (finalEffect.type === 'damage') damageDealt += val;
                            });

                            log('battle.chainHit', { count: i + 1, target: currentTarget.name, amount: damageDealt });

                            multiplier *= (skill.decay || 0.85);

                            // Find next target (random alive enemy not yet hit)
                            const candidates = enemies.value.filter(e => e.hp > 0 && !hitIds.has(e.id));
                            if (candidates.length === 0) break;
                            currentTarget = candidates[Math.floor(Math.random() * candidates.length)];
                        }
                    } else {
                        // Generic Effect Processing
                        skill.effects.forEach(effect => {
                            if (skill.targetType === 'allEnemies') {
                                for (const enemy of enemies.value) {
                                    if (enemy.hp > 0) {
                                        processEffect(effect, enemy, actor, skill);
                                    }
                                }
                            } else if (skill.targetType === 'allAllies') {
                                partySlots.value.forEach(slot => {
                                    if (slot.front && slot.front.currentHp > 0) processEffect(effect, slot.front, actor, skill);
                                });
                            } else {
                                // Single Target
                                let target = null;
                                if (skill.targetType === 'ally' || skill.targetType === 'deadAlly') {
                                    target = targetId ? findPartyMember(targetId) : actor;
                                } else if (skill.targetType === 'enemy') {
                                    target = enemies.value.find(e => e.id === targetId) || enemies.value.find(e => e.hp > 0);
                                }
                                processEffect(effect, target, actor, skill);
                            }
                        });
                    }
                }
            }
        } else if (actionType === 'attack') {
            log('battle.attackStart', { attacker: actor.name });

            // Resolve Target
            let target = enemies.value.find(e => e.id === targetId);
            if (!target) {
                target = enemies.value.find(e => e.hp > 0);
            }

            if (target) {
                const dmg = calculateDamage(actor, target);
                applyDamage(target, dmg);
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

    const processEffect = (effect, target, actor, skill = null, silent = false) => {
        if (!effect) return 0;

        switch (effect.type) {
            case 'heal':
                if (target) {
                    let amount = effect.value;
                    if (effect.scaling === 'maxHp') {
                        amount = Math.floor(target.maxHp * effect.value);
                    }
                    return applyHeal(target, amount, silent);
                }
                break;
            case 'recoverMp':
                if (target) {
                    target.currentMp = Math.min(target.maxMp, target.currentMp + effect.value);
                    if (!silent) log('battle.recoveredMp', { target: target.name, amount: effect.value });
                    return effect.value;
                }
                break;
            case 'revive':
                if (target && target.currentHp <= 0) {
                    target.currentHp = Math.floor(target.maxHp * effect.value);
                    if (!silent) log('battle.revived', { target: target.name });
                    return target.currentHp;
                } else {
                    if (!silent) log('battle.noEffect');
                    return 0;
                }
                break;
            case 'damage':
                if (target) {
                    let dmg = 0;
                    if (effect.scaling === 'atk' || effect.scaling === 'mag') {
                        // Use standard calculation
                        dmg = calculateDamage(actor, target, skill, effect);
                    } else if (effect.scaling === 'maxHp') {
                        // MaxHP scaling (e.g. for Poison/DoT)
                        dmg = Math.floor(target.maxHp * effect.value);
                    } else {
                        // Fixed damage
                        dmg = effect.value;
                    }
                    applyDamage(target, dmg, silent);
                    return dmg;
                }
                break;
            case 'applyStatus':
                if (target) {
                    // Check chance if present
                    if (effect.chance && Math.random() > effect.chance) {
                        return 0; // Failed chance
                    }
                    applyStatus(target, effect.status, effect.duration || 3, null, silent);
                    return 1;
                }
                break;
            case 'buff':
                // Attempt to map dynamic buff to statusDb
                let statusId = null;
                if (effect.stat === 'def') statusId = 104; // Defense Up
                if (effect.stat === 'atk') statusId = 102; // Attack Up
                if (effect.stat === 'spd') statusId = 103; // Haste

                if (statusId) {
                    applyStatus(target, statusId, effect.duration || 3, effect.value, silent);
                } else {
                    if (!silent) log('battle.buffCast', { user: actor.name, target: target ? target.name : { zh: '友方全体', en: 'allies' } });
                }
                break;
            case 'cureStatus':
                if (target) {
                    // Map string "poison" to ID 1, etc.
                    let sId = null;
                    if (effect.status === 'poison') sId = 1;

                    if (sId) removeStatus(target, sId, silent);
                    else if (!silent) log('battle.statusCured', { target: target.name, status: effect.status });
                }
                break;
            case 'fullRestore':
                if (partySlots.value) {
                    partySlots.value.forEach(slot => {
                        if (slot.front) {
                            slot.front.currentHp = slot.front.maxHp;
                            slot.front.currentMp = slot.front.maxMp;
                            slot.front.statusEffects = [];
                        }
                        if (slot.back) {
                            slot.back.currentHp = slot.back.maxHp;
                            slot.back.currentMp = slot.back.maxMp;
                            slot.back.statusEffects = [];
                        }
                    });
                    if (!silent) log('battle.partyRestored');
                }
                break;
            default:
                console.warn('Unknown effect type:', effect.type);
        }
        return 0;
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
            if (!target) target = enemies.value.find(e => e.hp > 0);
        }

        // Apply all effects
        item.effects.forEach(effect => {
            processEffect(effect, target, actor);
        });
    };

    // --- Status System ---

    const applyStatus = (target, statusId, duration = 3, value = null, silent = false) => {
        if (!target || !statusDb[statusId]) return;

        // Initialize if not present
        if (!target.statusEffects) target.statusEffects = [];

        // Check if already exists
        const existing = target.statusEffects.find(s => s.id === statusId);
        const statusDef = statusDb[statusId];

        if (existing) {
            existing.duration = duration; // Refresh duration
            if (!silent) log('battle.statusExtended', { target: target.name, status: statusDef.name });
        } else {
            target.statusEffects.push({
                id: statusId,
                duration: duration,
                value: value
            });
            if (!silent) log('battle.statusApplied', { target: target.name, status: statusDef.name });
        }
    };

    const removeStatus = (target, statusId, silent = false) => {
        if (!target || !target.statusEffects) return;
        const idx = target.statusEffects.findIndex(s => s.id === statusId);
        if (idx !== -1) {
            const statusDef = statusDb[statusId];
            target.statusEffects.splice(idx, 1);
            if (!silent) log('battle.statusCured', { target: target.name, status: statusDef.name });
        }
    };

    const processTurnStatuses = (character) => {
        if (!character || !character.statusEffects) return;

        // Iterate backwards to allow removal
        for (let i = character.statusEffects.length - 1; i >= 0; i--) {
            const status = character.statusEffects[i];
            const statusDef = statusDb[status.id];

            if (statusDef && statusDef.effects) {
                statusDef.effects.forEach(eff => {
                    if (eff.trigger === 'turnStart') {
                        // Pass actor as character itself for self-inflicted effects (DoT/HoT)
                        const val = processEffect(eff, character, character, null, true);

                        // Custom logs based on type
                        if (eff.type === 'damage') {
                            log('battle.statusDamage', { target: character.name, amount: val, status: statusDef.name });
                        } else if (eff.type === 'heal') {
                            log('battle.statusHeal', { target: character.name, amount: val, status: statusDef.name });
                        }
                    }
                });
            }

            // Decrement Duration
            status.duration--;
            if (status.duration <= 0) {
                character.statusEffects.splice(i, 1);
                log('battle.statusWoreOff', { target: character.name, status: statusDef.name });
            }
        }
    };

    const checkCrowdControl = (character) => {
        if (!character || !character.statusEffects) return false;

        for (const status of character.statusEffects) {
            const statusDef = statusDb[status.id];
            if (statusDef && statusDef.effects) {
                for (const eff of statusDef.effects) {
                    if (eff.trigger === 'checkAction' && eff.type === 'stun') {
                        if (Math.random() < (eff.chance || 1.0)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

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

    const applyDamage = (target, amount, silent = false) => {
        target.currentHp = Math.max(0, (target.currentHp || target.hp) - amount);
        if (target.hp !== undefined) target.hp = target.currentHp;

        if (!silent) {
            log('battle.damage', { target: target.name, amount: amount });
            if (target.isDefending) {
                log('battle.defended');
            }
        }

        // Check if a front-row party member died and needs switching
        if (target.currentHp <= 0) {
            const slotIndex = partySlots.value.findIndex(s => s.front && s.front.id === target.id);
            if (slotIndex !== -1) {
                const slot = partySlots.value[slotIndex];
                if (slot.back && slot.back.currentHp > 0) {
                    if (!silent) log('battle.fell', { target: target.name, backup: slot.back.name });
                    performSwitch(slotIndex);
                }
            }
        }
        return amount;
    };

    const applyHeal = (target, amount, silent = false) => {
        if (!target) return 0;
        if (target.currentHp <= 0) {
            if (!silent) log('battle.incapacitated', { target: target.name });
            return 0;
        }

        const oldHp = target.currentHp;
        target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
        const healed = target.currentHp - oldHp;

        if (!silent) log('battle.recoveredHp', { target: target.name, amount: healed });
        return healed;
    };

    const checkBattleStatus = () => {
        const allEnemiesDead = enemies.value.every(e => e.hp <= 0);
        if (allEnemiesDead) {
            battleState.value = 'victory';
            log('battle.victory');
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
