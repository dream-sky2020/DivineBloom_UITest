<template>
  <div class="top-action-bar">
       <div v-if="isSelectingTarget" class="selection-message">
           {{ t('battle.selectTarget') }}
           <button class="cancel-btn" @click="$emit('cancel-selection')">{{ t('battle.cancel') }}</button>
       </div>
       <span v-else-if="battleState === 'active' && activeCharacter">{{ getLocalizedName(activeCharacter.name) }}{{ t('battle.turn') }}</span>
       <span v-else-if="battleState === 'victory'" style="color: #fbbf24">{{ t('battle.victory') }}</span>
       <span v-else-if="battleState === 'defeat'" style="color: #9ca3af">{{ t('battle.defeat') }}</span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isSelectingTarget: Boolean,
  battleState: String,
  activeCharacter: Object
});

defineEmits(['cancel-selection']);

const { t, locale } = useI18n();

const getLocalizedName = (nameObj) => {
    if (!nameObj) return '';
    if (typeof nameObj === 'string') return nameObj;
    return nameObj[locale.value] || nameObj['en'] || nameObj['zh'] || '???';
};
</script>

<style scoped>
.top-action-bar {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 4px 8px rgba(0,0,0,0.8);
  pointer-events: none; /* Let clicks pass through */
}

.top-action-bar .selection-message, 
.top-action-bar button {
    pointer-events: auto; /* Re-enable clicks for buttons */
}

.selection-message {
    color: #fbbf24;
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: pulse 1s infinite;
}

.cancel-btn {
    padding: 0.2rem 0.8rem;
    background: #ef4444;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
}

.cancel-btn:hover {
    background: #dc2626;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}
</style>

