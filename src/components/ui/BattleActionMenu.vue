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
        <button class="action-btn run" @click="$emit('action', 'run')">
          <GameIcon class="icon" name="icon_run" />
          <span class="label">{{ t('battle.actionRun') }}</span>
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

<style scoped src="@styles/components/ui/BattleActionMenu.css"></style>

