import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { charactersDb } from '@schema/characters';
import { skillsDb } from '@schema/skills';
import { itemsDb } from '@schema/items';
import { useInventoryStore } from './inventory';
import { usePartyStore } from './party';

// --- Battle System Facade Integration ---
import { battleFacade } from '@/game/battle';
// ----------------------------------------

// ECS Integration
import { world2d, world } from '@world2d';
import { createLogger } from '@/utils/logger';

const logger = createLogger('BattleStore');

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
    const boostLevel = ref(0); // Manually controlled BP usage for the current turn
    const triggeredEnemyUuid = ref(null);
    const lastBattleResult = ref(null); // { result: 'victory'|'defeat'|'flee', enemyUuid: string }
    const waitingForInput = ref(false); // Controls UI visibility
    const pendingAction = ref(null); // { type, id, targetType, data }
    const validTargetIds = ref([]);

    // --- Register Callbacks to Facade ---
    battleFacade.registerCallbacks({
        log: (key, params) => log(key, params),
        onDamage: (data) => {
            // Future: Trigger UI floating text here
        }
    });

    // --- Getters ---
    const activeCharacter = computed(() => {
        if (activeUnit.value && activeUnit.value.isPlayer) {
            return activeUnit.value;
        }
        return null;
    });

    const isPlayerTurn = computed(() => {
        return !!activeCharacter.value && atbPaused.value;
    });

    const enemiesDisplay = computed(() => {
        return enemies.value.map(enemy => battleFacade.getUnitDisplayData(enemy, {
            activeUnit: activeUnit.value,
            validTargetIds: validTargetIds.value
        }));
    });

    const partySlotsDisplay = computed(() => {
        return partySlots.value.map(slot => ({
            front: battleFacade.getUnitDisplayData(slot.front, {
                activeUnit: activeUnit.value,
                validTargetIds: validTargetIds.value
            }),
            back: battleFacade.getUnitDisplayData(slot.back, {
                activeUnit: activeUnit.value,
                validTargetIds: validTargetIds.value
            })
        }));
    });

    const battleItems = computed(() => {
        return inventoryStore.getAllItems.filter(item => item.type === 'itemTypes.consumable');
    });

    // --- Actions ---

    const checkSkillUsability = (skillId) => {
        if (!activeCharacter.value) return false;
        const skill = skillsDb[skillId];
        if (!skill) return false;
        return battleFacade.canUseSkill(activeCharacter.value, skill, getContext());
    };

    const setPendingAction = (action) => {
        pendingAction.value = action;
        if (action && action.targetType) {
            validTargetIds.value = battleFacade.target.getValidTargetIds({
                partySlots: partySlots.value,
                enemies: enemies.value,
                actor: activeUnit.value
            }, action.targetType);
        } else {
            validTargetIds.value = [];
        }
    };

    const adjustBoost = (delta) => {
        if (!activeUnit.value || !activeUnit.value.isPlayer) return;

        let newLevel;
        if (delta === 'reset') {
            newLevel = 0;
        } else {
            newLevel = boostLevel.value + delta;
        }

        const maxBoost = 3; 
        const currentEnergy = activeUnit.value.energy || 0;
        newLevel = Math.max(0, Math.min(newLevel, currentEnergy, maxBoost));
        boostLevel.value = newLevel;
    };

    // Build Context for Mechanics
    const getContext = () => ({
        log,
        performSwitch,
        partySlots: partySlots.value,
        enemies: enemies.value,
        turnCount: turnCount.value,
        // Item Cost Support
        checkItem: (itemId, amount) => {
            const item = inventoryStore.inventoryState.find(i => i.id === itemId);
            return item && item.count >= amount;
        },
        consumeItem: (itemId, amount) => {
            inventoryStore.removeItem(itemId, amount);
        },
        // Passive Effect Executor
        executeEffect: (effect, target, actor, skill) => {
            battleFacade.effect.processEffect(effect, target, actor, skill, getContext(), true);
        }
    });

    // Helper to find any party member
    const findPartyMemberWrapper = (id) => battleFacade.target.findPartyMember(partySlots.value, id);

    // Initialize Battle
    const initBattle = (enemyList, enemyUuid = null) => {
        // Reset state
        turnCount.value = 1;
        battleLog.value = [];
        activeUnit.value = null;
        atbPaused.value = false;
        waitingForInput.value = false;
        triggeredEnemyUuid.value = enemyUuid;
        lastBattleResult.value = null;

        // Setup Enemies
        if (enemyList) {
            enemies.value = enemyList.map(e => {
                if (e.id && charactersDb[e.id]) {
                    const base = battleFacade.createUnit(e.id, false);
                    return { ...base, ...e, atb: 0, isPlayer: false, actionCount: 0 };
                }
                return { ...e, atb: 0, isPlayer: false, actionCount: 0 };
            });
        } else {
            // Default Mock Enemies
            enemies.value = [
                battleFacade.createUnit('character_emperor_shenwu', false),
                battleFacade.createUnit('character_shahryar', false),
                battleFacade.createUnit('character_hefietian', false),
                battleFacade.createUnit('character_yibitian', false)
            ].filter(e => e !== null);
        }

        // Setup Party
        partyStore.initParty();
        partySlots.value = partyStore.formation.map(slot => ({
            front: battleFacade.hydrateUnit(partyStore.getCharacterState(slot.front), true),
            back: battleFacade.hydrateUnit(partyStore.getCharacterState(slot.back), true)
        }));

        battleState.value = 'active';
        log('battle.started');

        // Process Battle Start Passives
        const context = getContext();
        [...partySlots.value.map(s => s.front), ...partySlots.value.map(s => s.back), ...enemies.value].forEach(unit => {
            if (unit) battleFacade.skill.processPassiveTrigger(unit, 'battle_start', context);
        });
    };

    // ATB Tick
    const updateATB = (dt) => {
        if (battleState.value !== 'active' || atbPaused.value) return;

        const MAX_ATB = 100;
        const MAX_BP = 6;
        const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

        const unitEntries = [];
        enemies.value.forEach(e => {
            if (!isDead(e)) unitEntries.push({ unit: e, isBackRow: false });
        });
        partySlots.value.forEach(slot => {
            if (slot.front && !isDead(slot.front)) unitEntries.push({ unit: slot.front, isBackRow: false });
            if (slot.back && !isDead(slot.back)) unitEntries.push({ unit: slot.back, isBackRow: true });
        });

        for (const { unit, isBackRow } of unitEntries) {
            const tick = battleFacade.time.calculateAtbTick(unit, dt);

            if (isBackRow) {
                unit.atb = (unit.atb || 0) + tick;
            } else {
                unit.atb = Math.min(MAX_ATB, (unit.atb || 0) + tick);
            }

            if (unit.atb >= MAX_ATB) {
                if (isBackRow) {
                    unit.atb -= MAX_ATB;
                    unit.energy = Math.min(MAX_BP, (unit.energy || 0) + 2);
                } else if (!atbPaused.value) {
                    unit.atb = MAX_ATB;
                    unit.energy = Math.min(MAX_BP, (unit.energy || 0) + 1);
                    startTurn(unit);
                    return;
                }
            }
        }
    };

    const startTurn = (unit) => {
        atbPaused.value = true;
        activeUnit.value = unit;
        unit.isDefending = false;
        boostLevel.value = 0;

        const context = getContext();
        const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

        battleFacade.skill.processPassiveTrigger(unit, 'turn_start', context);
        battleFacade.effect.processTurnStatuses(unit, context);

        if (isDead(unit)) {
            endTurn(unit);
            return;
        }

        const cannotMove = battleFacade.status.checkCrowdControl(unit);
        if (cannotMove) {
            log('battle.cannotMove', { name: unit.name });
            battleFacade.skill.processPassiveTrigger(unit, 'on_cc_skip', context);
            setTimeout(() => endTurn(unit), 1000);
            return;
        }

        if (!unit.isPlayer) {
            processEnemyTurn(unit);
        } else {
            waitingForInput.value = true;
        }
    };

    const endTurn = (unit) => {
        unit.atb = -25;
        activeUnit.value = null;
        atbPaused.value = false;
        waitingForInput.value = false;
        boostLevel.value = 0;
        checkBattleStatus();
    };

    const processEnemyTurn = async (enemy) => {
        const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

        setTimeout(() => {
            if (isDead(enemy)) {
                endTurn(enemy);
                return;
            }

            if (typeof enemy.actionCount === 'undefined') enemy.actionCount = 0;
            enemy.actionCount++;

            const context = {
                actor: enemy,
                party: partySlots.value,
                enemies: enemies.value,
                turnCount: turnCount.value,
                log // important for logging actions
            };

            const action = battleFacade.getEnemyAction(enemy.id, context);

            if (!action || action.type === 'wait') {
                endTurn(enemy);
                return;
            }

            // Using Facade to execute action
            // Note: Enemy actions typically don't use manual boost, so no energyMult override
            const result = battleFacade.executeAction(enemy, action, getContext());

            if (result && result.consumeTurn === false) {
                processEnemyTurn(enemy);
            } else {
                endTurn(enemy);
            }
        }, 1000);
    };

    // Player Actions
    const playerAction = async (actionType, payload = null) => {
        if (!activeUnit.value || !activeUnit.value.isPlayer) return;

        waitingForInput.value = false;
        const actor = activeUnit.value;
        let consumeTurn = true;
        let actionExecuted = false;

        // Calculate Energy Multiplier
        let energyMult = 1.0;
        let consumedEnergy = 0;
        if (boostLevel.value > 0) {
            energyMult = 1.0 + (boostLevel.value * 0.5);
            consumedEnergy = boostLevel.value;
            log('battle.energyConsume', { name: actor.name, energy: consumedEnergy });
        }

        const context = { ...getContext(), energyMult };

        // Normalize payload to Standard Action Format
        let action = { type: actionType };
        
        if (typeof payload === 'object' && payload !== null) {
            action = { ...action, ...payload };
        } else {
            action.skillId = payload; // legacy support
        }

        // Special handling before execution
        if (actionType === 'item') {
            if (!action.itemId) return;
            inventoryStore.removeItem(action.itemId, 1);
            const item = itemsDb[action.itemId];
            if (item && item.consumeTurn === false) consumeTurn = false;
            
            log('battle.useItem', { user: actor.name, item: item.name });
            battleFacade.handleItemEffect(action.itemId, action.targetId, actor, context);
            actionExecuted = true;

        } else if (actionType === 'skill') {
            const skill = skillsDb[action.skillId];
            if (!battleFacade.canUseSkill(actor, skill, getContext())) {
                log('battle.notEnoughMp');
                return; 
            }
            // Pay Cost
            battleFacade.skill.paySkillCost(actor, skill, getContext());
            
            // Deduct Energy
             if (consumedEnergy > 0) {
                actor.energy = Math.max(0, (actor.energy || 0) - consumedEnergy);
            }
            
            const result = battleFacade.executeAction(actor, action, context);
            consumeTurn = result.consumeTurn;
            actionExecuted = true;

        } else if (actionType === 'attack') {
            if (consumedEnergy > 0) {
                actor.energy = Math.max(0, (actor.energy || 0) - consumedEnergy);
            }
            const result = battleFacade.executeAction(actor, action, context);
            consumeTurn = result.consumeTurn;
            actionExecuted = true;

        } else if (actionType === 'defend') {
            actor.isDefending = true;
            log('battle.defending', { name: actor.name });
            actionExecuted = true;

        } else if (actionType === 'switch') {
            const slotIndex = partySlots.value.findIndex(s => s.front && s.front.id === actor.id);
            if (slotIndex !== -1) {
                const slot = partySlots.value[slotIndex];
                if (slot && slot.back && slot.back.currentHp > 0) {
                    performSwitch(slotIndex);
                    actionExecuted = true;
                } else {
                    log('battle.cannotSwitch');
                    return;
                }
            }

        } else if (actionType === 'skip') {
            actor.energy = Math.min(6, (actor.energy || 0) + 1);
            log('battle.skipTurn', { name: actor.name });
            actionExecuted = true;

        } else if (actionType === 'reorganize') {
            log('battle.reorganize', { name: actor.name });
            actionExecuted = true;

        } else if (actionType === 'run') {
            runAway();
            return;
        }

        if (actionExecuted) {
            if (consumeTurn) {
                endTurn(actor);
            } else {
                waitingForInput.value = true;
            }
        }
    };

    const performSwitch = (slotIndex) => {
        const slot = partySlots.value[slotIndex];
        if (slot && slot.back) {
            const temp = slot.front;
            slot.front = slot.back;
            slot.back = temp;

            if (slot.front) slot.front.isDefending = false;
            if (slot.front.atb === undefined) slot.front.atb = 0;
            slot.front.isPlayer = true;

            log('battle.switchIn', { name: slot.front.name });
        }
    };

    const notifyECS = (resultType, drops = []) => {
        if (!triggeredEnemyUuid.value) return;

        try {
            const globalEntity = world.with('globalManager').first;

            if (globalEntity) {
                const resultData = {
                    win: resultType === 'victory',
                    fled: resultType === 'flee',
                    drops: drops,
                    exp: 0
                };
                logger.info('Setting BattleResult on GlobalEntity:', triggeredEnemyUuid.value, resultData);
                world.addComponent(globalEntity, 'battleResult', {
                    uuid: triggeredEnemyUuid.value,
                    result: resultData
                });
            } else {
                logger.warn('GlobalEntity not found, cannot push battle result!');
            }
        } catch (e) {
            logger.error('Failed to create external event:', e);
        }
    };

    const checkBattleStatus = () => {
        const isDead = (u) => u && u.statusEffects && u.statusEffects.some(s => s.id === 'status_dead');

        const allEnemiesDead = enemies.value.every(e => isDead(e));
        if (allEnemiesDead) {
            battleState.value = 'victory';
            lastBattleResult.value = { result: 'victory', enemyUuid: triggeredEnemyUuid.value };
            log('battle.victory');

            const allDrops = []
            enemies.value.forEach(enemy => {
                const drops = battleFacade.calculateDrops(enemy)
                if (drops.length > 0) {
                    allDrops.push(drops)
                }
            })
            const finalDrops = battleFacade.loot.mergeDrops(allDrops)

            finalDrops.forEach(drop => {
                inventoryStore.addItem(drop.itemId, drop.qty)
                const item = itemsDb[drop.itemId]
                if (item) {
                    log('battle.foundLoot', { item: item.name, qty: drop.qty })
                }
            })

            partyStore.updatePartyAfterBattle(partySlots.value);
            notifyECS('victory', finalDrops);
            return true;
        }

        const allPlayersDead = partySlots.value.every(s =>
            (!s.front || isDead(s.front)) &&
            (!s.back || isDead(s.back))
        );
        if (allPlayersDead) {
            battleState.value = 'defeat';
            lastBattleResult.value = { result: 'defeat', enemyUuid: triggeredEnemyUuid.value };
            log('battle.defeat');
            notifyECS('defeat');
            return true;
        }
        return false;
    };

    const runAway = () => {
        battleState.value = 'flee';
        lastBattleResult.value = { result: 'flee', enemyUuid: triggeredEnemyUuid.value };
        log('battle.runAway');
        notifyECS('flee');
    };

    const reset = () => {
        turnCount.value = 1;
        battleState.value = 'idle';
        battleLog.value = [];
        activeUnit.value = null;
        atbPaused.value = false;
        enemies.value = [];
        partySlots.value = [];
    };

    const clearLog = () => {
        battleLog.value = [];
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
        boostLevel,
        waitingForInput,
        pendingAction,
        validTargetIds,
        enemiesDisplay,
        partySlotsDisplay,

        // Getters
        activeCharacter,
        isPlayerTurn,
        battleItems,

        // Actions
        initBattle,
        playerAction,
        setPendingAction,
        checkSkillUsability,
        updateATB,
        runAway,
        lastBattleResult,
        adjustBoost,
        clearLog,
        reset
    };
});
