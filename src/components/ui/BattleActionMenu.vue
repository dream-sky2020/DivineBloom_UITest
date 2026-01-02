<template>
  <div class="battle-ui-layer" v-if="activeCharacter">
     
     <!-- Skill Selection Overlay -->
     <div class="skill-menu-overlay" v-if="showSkillMenu">
       <div class="skill-menu-panel">
          <div class="skill-header">
            <h3>{{ t('battle.skillsOf', { name: getLocalizedText(activeCharacter.name) }) }}</h3>
            <button class="close-btn" @click="$emit('close-skill-menu')">×</button>
          </div>
          <div class="skill-list">
             <div 
               v-for="skill in characterSkills" 
               :key="skill.id" 
               class="skill-item"
               :class="{ 'disabled': skill.mpCost > activeCharacter.currentMp }"
               @click="$emit('select-skill', skill)"
             >
                <GameIcon class="skill-icon" :name="skill.icon" />
                <div class="skill-details">
                  <span class="skill-name">{{ getLocalizedText(skill.name) }}</span>
                  <span class="skill-desc">{{ getLocalizedText(skill.subText) }}</span>
                </div>
                <span class="skill-cost">{{ skill.cost }}</span>
             </div>
             <div v-if="characterSkills.length === 0" class="no-skills">
               {{ t('battle.noSkills') }}
             </div>
          </div>
       </div>
     </div>

     <!-- Item Selection Overlay -->
     <div class="skill-menu-overlay" v-else-if="showItemMenu">
       <div class="skill-menu-panel">
          <div class="skill-header">
            <h3>{{ t('battle.bagConsumables') }}</h3>
            <button class="close-btn" @click="$emit('close-item-menu')">×</button>
          </div>
          <div class="skill-list">
             <div 
               v-for="item in battleItems" 
               :key="item.id" 
               class="skill-item"
               @click="$emit('select-item', item)"
             >
                <GameIcon class="skill-icon" :name="item.icon" />
                <div class="skill-details">
                  <span class="skill-name">{{ getLocalizedText(item.name) }}</span>
                  <span class="skill-desc">{{ getLocalizedText(item.description) }}</span>
                </div>
                <span class="skill-cost">x{{ item.count }}</span>
             </div>
             <div v-if="battleItems.length === 0" class="no-skills">
               {{ t('battle.emptyBag') }}
             </div>
          </div>
       </div>
     </div>

     <!-- Action Menu - Centered or near character -->
     <div class="action-ring" v-else>
        <button class="action-btn attack" @click="$emit('action', 'attack')">
          <GameIcon class="icon" name="icon_sword" />
          <span class="label">{{ t('battle.actionAttack') }}</span>
        </button>
        <button class="action-btn skill" @click="$emit('open-skill-menu')">
          <GameIcon class="icon" name="icon_magic" />
          <span class="label">{{ t('battle.actionSkill') }}</span>
        </button>
        <button class="action-btn defend" @click="$emit('action', 'defend')">
          <GameIcon class="icon" name="icon_shield" />
          <span class="label">{{ t('battle.actionDefend') }}</span>
        </button>
        <button class="action-btn item" @click="$emit('open-item-menu')">
          <GameIcon class="icon" name="icon_backpack" />
          <span class="label">{{ t('battle.actionItem') }}</span>
        </button>
        <button class="action-btn switch" :class="{ 'disabled': !canSwitch }" @click="$emit('action', 'switch')">
          <GameIcon class="icon" name="icon_switch" />
          <span class="label">{{ t('battle.actionSwitch') }}</span>
        </button>
         <button class="action-btn skip" @click="$emit('action', 'skip')">
          <GameIcon class="icon" name="icon_skip" />
          <span class="label">{{ t('battle.actionSkip') }}</span>
        </button>
        <button class="action-btn bloom" @click="$emit('action', 'bloom')">
          <GameIcon class="icon" name="icon_flower" />
          <span class="label">{{ t('battle.actionBloom') }}</span>
        </button>
     </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import GameIcon from '@/components/ui/GameIcon.vue';

const props = defineProps({
  activeCharacter: Object,
  showSkillMenu: Boolean,
  showItemMenu: Boolean,
  characterSkills: {
    type: Array,
    default: () => []
  },
  battleItems: {
    type: Array,
    default: () => []
  },
  canSwitch: Boolean
});

defineEmits([
  'action',
  'open-skill-menu',
  'close-skill-menu',
  'open-item-menu',
  'close-item-menu',
  'select-skill',
  'select-item'
]);

const { t, locale } = useI18n();

const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[locale.value] || obj.en || obj.zh || '';
};
</script>

<style scoped>
/* Battle Action Menu */
.battle-ui-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-ring {
  display: flex;
  gap: 1rem;
  background: rgba(0,0,0,0.8);
  padding: 1.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: none;
  background: #1e293b;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  gap: 5px;
}

.action-btn:hover {
  transform: translateY(-5px);
  background: #334155;
}

.action-btn .icon {
  font-size: 1.8rem;
}

.action-btn .label {
  font-size: 0.9rem;
}

/* Specific button styles */
.attack:hover { background: #ef4444; }
.skill:hover { background: #8b5cf6; }
.defend:hover { background: #3b82f6; }
.item:hover { background: #10b981; }
.bloom:hover { background: #ec4899; box-shadow: 0 0 20px #ec4899; }
.switch:hover { background: #f59e0b; }
.skip:hover { background: #64748b; }

.action-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
}

.skill-menu-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 60;
    width: 600px;
    background: rgba(15, 23, 42, 0.95);
    border: 2px solid #475569;
    border-radius: 1rem;
    padding: 1rem;
    color: white;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #334155;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

.close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    cursor: pointer;
}

.skill-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
}

.skill-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    background: #1e293b;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.skill-item:hover {
    background: #334155;
    transform: translateX(5px);
}

.skill-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
}

.skill-icon {
    font-size: 1.5rem;
}

.skill-details {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.skill-name {
    font-weight: bold;
    color: #f1f5f9;
}

.skill-desc {
    font-size: 0.8rem;
    color: #94a3b8;
}

.skill-cost {
    font-family: monospace;
    color: #60a5fa;
    font-weight: bold;
}

.no-skills {
    text-align: center;
    padding: 2rem;
    color: #64748b;
}
</style>

