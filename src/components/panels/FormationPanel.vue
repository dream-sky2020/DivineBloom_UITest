<template>
  <div class="formation-panel" @click.self="clearSelection">
    <div class="formation-header">
        <p class="formation-instruction" v-t="'formation.instruction'"></p>
    </div>

    <div class="formation-grid-container">
        
        <div class="formation-row front-row">
            <FormationPartySlot 
                v-for="i in 4" 
                :key="'front-' + (i-1)"
                :index="i-1"
                :character="slots[i-1]"
                :isSelected="selectedIndex === (i-1)"
                :isTarget="targetIndex === (i-1)"
                @select="onSlotSelect"
                @drop="onSlotDrop"
                @hover-enter="onSlotHoverEnter"
                @hover-leave="onSlotHoverLeave"
            />
        </div>

        <div class="formation-row back-row">
             <FormationPartySlot 
                v-for="i in 4" 
                :key="'back-' + (i-1+4)"
                :index="i-1+4"
                :character="slots[i-1+4]"
                :isSelected="selectedIndex === (i-1+4)"
                :isTarget="targetIndex === (i-1+4)"
                @select="onSlotSelect"
                @drop="onSlotDrop"
                @hover-enter="onSlotHoverEnter"
                @hover-leave="onSlotHoverLeave"
            />
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormationPartySlot from '@/components/ui/FormationPartySlot.vue';
import { charactersDb as characters } from '@/data/characters'; 

// Initialize slots (8 positions: 0-3 Front, 4-7 Back)
const slots = ref(new Array(8).fill(null));
const selectedIndex = ref(-1);
const targetIndex = ref(-1); // New: Track which slot is the potential target

onMounted(() => {
    // Mock Data Loading
    if (characters && Object.keys(characters).length > 0) {
        const charKeys = Object.keys(characters);
        slots.value[0] = { ...characters[charKeys[0]], currentHp: 500, maxHp: 500, currentMp: 100, maxMp: 100, role: 'warrior' };
        if (charKeys[1]) slots.value[1] = { ...characters[charKeys[1]], currentHp: 300, maxHp: 300, currentMp: 200, maxMp: 200, role: 'mage' };
        if (charKeys[2]) slots.value[4] = { ...characters[charKeys[2]], currentHp: 400, maxHp: 400, currentMp: 50, maxMp: 50, role: 'ranger' }; 
    }
    enforceFormationRules();
});

const onSlotSelect = (index) => {
    if (selectedIndex.value === -1) {
        if (slots.value[index]) {
            selectedIndex.value = index;
        }
    } else if (selectedIndex.value === index) {
        selectedIndex.value = -1;
        targetIndex.value = -1;
    } else {
        performMove(selectedIndex.value, index);
        selectedIndex.value = -1;
        targetIndex.value = -1;
    }
};

const onSlotDrop = ({ from, to }) => {
    performMove(from, to);
    selectedIndex.value = -1;
    targetIndex.value = -1;
};

const onSlotHoverEnter = (index) => {
    // Only highlight as target if we are dragging OR we have something selected
    if (selectedIndex.value !== -1 && selectedIndex.value !== index) {
        
        // PREDICTION LOGIC:
        // If target is in Back Row (4-7) AND corresponding Front Row is empty (and not the one moving in),
        // highlight the Front Row instead because the character will slide there.
        
        let actualTargetIndex = index;
        
        if (index >= 4) { // Is Back Row
            const col = index - 4;
            const frontIdx = col;
            
            // Check if Front is empty OR will become empty because we are moving the front character to the back
            // 1. If Front is currently empty, any character dropped in Back will slide to Front.
            // 2. If the moving character IS the Front character of this column, swapping to Back will leave Front empty, causing a slide back to Front.
            
            if (!slots.value[frontIdx] || selectedIndex.value === frontIdx) {
                actualTargetIndex = frontIdx;
            }
        }

        targetIndex.value = actualTargetIndex;
    }
};

const onSlotHoverLeave = (index) => {
    // We clear targetIndex regardless of which index triggered leave, 
    // because we might have redirected the highlight to a different index (actualTargetIndex).
    // Simply checking if targetIndex.value === index might fail if we highlighted the Front row instead.
    
    // However, to avoid flickering if we move mouse strictly between the "Back Slot" and "Front Slot",
    // we should be careful. 
    // But generally, 'leave' fires before 'enter' of next element.
    // Let's just clear it. The next 'enter' will set it correctly.
    targetIndex.value = -1;
};

const clearSelection = () => {
    // Optional: Clear selection if clicking background
    // selectedIndex.value = -1;
    // targetIndex.value = -1;
};

const performMove = (fromIndex, toIndex) => {
    const temp = slots.value[fromIndex];
    slots.value[fromIndex] = slots.value[toIndex];
    slots.value[toIndex] = temp;
    enforceFormationRules();
};

const enforceFormationRules = () => {
    for (let col = 0; col < 4; col++) {
        const frontIdx = col;
        const backIdx = col + 4;
        
        if (!slots.value[frontIdx] && slots.value[backIdx]) {
            slots.value[frontIdx] = slots.value[backIdx];
            slots.value[backIdx] = null;
        }
    }
};

</script>

<style scoped src="@styles/components/panels/FormationPanel.css"></style>
