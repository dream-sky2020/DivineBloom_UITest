<template>
  <div class="game-grid custom-scrollbar" :style="{ gridTemplateColumns: `repeat(${currentColumns}, 1fr)` }">
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="grid-item"
      :class="[
        mode, 
        { 'active': selectedIndex === index },
        { 'empty': !item || item.isEmpty },
        { 'locked': item && item.isLocked }
      ]"
      @click="handleSelect(index, item)"
      @mouseenter="hoveredIndex = index"
      @mouseleave="hoveredIndex = -1"
    >
      <!-- Mode: Icon Only -->
      <template v-if="mode === 'icon'">
        <div class="icon-wrapper">
          <GameIcon class="main-icon" :name="item?.icon || (item?.isEmpty ? 'icon_box' : 'icon_unknown')" />
          <div v-if="item && item.count && item.count > 1" class="icon-badge">{{ item.count }}</div>
        </div>
        
        <!-- Hover Tooltip for Icon Mode -->
          <div v-if="hoveredIndex === index && item && !item.isEmpty" class="hover-tooltip">
          <div class="tooltip-header">
            <span class="tooltip-title">{{ getLocalizedText(item.name) }}</span>
            <span v-if="item.subText" class="tooltip-sub">{{ getLocalizedText(item.subText) }}</span>
          </div>
          <div class="tooltip-body">{{ getLocalizedText(item.description) }}</div>
        </div>
      </template>

      <!-- Mode: List (Single Row) -->
      <template v-else-if="mode === 'list'">
        <div class="list-content">
          <div class="list-left">
            <GameIcon class="list-icon" :name="item?.icon || 'icon_box'" />
            <div class="list-info-group">
              <span class="list-title">{{ item?.name ? getLocalizedText(item.name) : t('common.emptySlot') }}</span>
              <span v-if="item?.subText" class="list-sub">{{ getLocalizedText(item.subText) }}</span>
            </div>
          </div>
          <div class="list-right">
            <span class="list-value">{{ item?.footerRight ? t(item.footerRight) : (item?.isEmpty ? '--' : '') }}</span>
          </div>
        </div>
        <div v-if="selectedIndex === index" class="selection-bar"></div>
      </template>

      <!-- Mode: Simple (Inventory Card Style) -->
      <template v-else-if="mode === 'simple'">
        <div class="card-header">
          <GameIcon class="card-icon" :name="item?.icon || 'icon_box'" />
          <span class="card-title">{{ item?.name ? getLocalizedText(item.name) : t('common.emptySlot') }}</span>
        </div>
        <div class="card-footer">
          <span class="footer-left">{{ item?.footerLeft ? t(item.footerLeft) : (item?.isEmpty ? '---' : '') }}</span>
          <span class="footer-right">{{ item?.footerRight ? t(item.footerRight) : (item?.isEmpty ? '--' : '') }}</span>
        </div>
        <div v-if="selectedIndex === index" class="selection-triangle"></div>
      </template>

      <!-- Mode: Detailed (Skills Card Style) -->
      <template v-else-if="mode === 'detailed'">
        <div class="card-header">
          <div class="card-icon-box" :class="{ 'grayscale': item?.isLocked }">
            <GameIcon :name="item?.icon || 'icon_unknown'" />
          </div>
          <div class="card-info">
             <div class="card-title" :class="{ 'text-yellow': item?.highlight }">
               {{ item?.name ? getLocalizedText(item.name) : t('common.unknown') }}
             </div>
             <div class="card-sub">{{ item?.subText ? getLocalizedText(item.subText) : '---' }}</div>
          </div>
        </div>
        <div class="card-footer">
          <span class="footer-left" :class="item?.footerLeftClass">{{ item?.footerLeft ? t(item.footerLeft) : '--' }}</span>
          <span class="footer-right" :class="item?.footerRightClass">{{ item?.footerRight ? t(item.footerRight) : '--' }}</span>
        </div>
        <div v-if="item?.tag" class="status-tag">{{ item.tag }}</div>
        <div v-if="item?.isLocked" class="lock-overlay">🔒</div>
        <div v-if="selectedIndex === index" class="selection-border"></div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import GameIcon from '@/components/ui/GameIcon.vue';

const { t, locale } = useI18n();

const getLocalizedText = (input) => {
  if (!input) return '';
  if (typeof input === 'object') {
    return input[locale.value] || input['en'] || input['zh'] || Object.values(input)[0] || '';
  }
  return t(input);
};

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'simple', // 'simple', 'detailed', 'icon', 'list'
    validator: (value) => ['simple', 'detailed', 'icon', 'list'].includes(value)
  },
  columns: {
    type: Number,
    default: 4
  },
  modelValue: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const selectedIndex = ref(props.modelValue);
const hoveredIndex = ref(-1);

// Force 1 column for list mode, otherwise use prop
const currentColumns = computed(() => {
  return props.mode === 'list' ? 1 : props.columns;
});

const handleSelect = (index, item) => {
  if (item && item.isLocked) return; 
  selectedIndex.value = index;
  emit('update:modelValue', index);
  emit('select', item);
};
</script>

<style scoped src="@styles/components/ui/GameDataGrid.css"></style>
