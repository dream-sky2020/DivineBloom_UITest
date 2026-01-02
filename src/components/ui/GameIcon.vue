<template>
  <span class="game-icon" :class="[iconClass, { 'is-image': isImage }]">
    <img v-if="isImage" :src="resolvedIcon" :alt="name" class="icon-img" />
    <template v-else>{{ resolvedIcon }}</template>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { getIcon, isImageIcon } from '@/utils/iconMap';

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  // 可选：传入额外的 class
  iconClass: {
    type: String,
    default: ''
  }
});

const resolvedIcon = computed(() => getIcon(props.name));
const isImage = computed(() => isImageIcon(resolvedIcon.value));
</script>

<style scoped>
.game-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
}

.icon-img {
  width: 1em;
  height: 1em;
  object-fit: contain;
}
</style>

