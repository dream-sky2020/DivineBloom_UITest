<template>
  <div class="panel-container">
    <div class="system-card">
      <h2 class="title">SYSTEM</h2>

      <div class="settings-list">
        
        <!-- Audio Section -->
        <div class="settings-section">
          <h3 class="section-title">{{ $t('system.volume') }}</h3>

          <div class="setting-row">
            <span class="setting-label">{{ $t('system.language') }}</span>
            <div class="toggle-group">
                <button :class="{ active: $i18n.locale === 'en' }" @click="$i18n.locale = 'en'">ENG</button>
                <button :class="{ active: $i18n.locale === 'zh' }" @click="$i18n.locale = 'zh'">中文</button>
            </div>
          </div>
          
          <div class="setting-row">
            <span class="setting-label">{{ $t('systemSettings.masterVolume') }}</span>
            <input type="range" class="setting-slider" v-model.number="audioStore.masterVolume" min="0" max="100">
            <span class="setting-value">{{ audioStore.masterVolume }}%</span>
          </div>
          
          <div class="setting-row">
            <span class="setting-label">{{ $t('systemSettings.music') }}</span>
            <input type="range" class="setting-slider" v-model.number="audioStore.bgmVolume" min="0" max="100">
            <span class="setting-value">{{ audioStore.bgmVolume }}%</span>
          </div>
          
          <div class="setting-row">
            <span class="setting-label">{{ $t('systemSettings.soundEffects') }}</span>
            <input type="range" class="setting-slider" v-model.number="audioStore.sfxVolume" min="0" max="100">
            <span class="setting-value">{{ audioStore.sfxVolume }}%</span>
          </div>
        </div>

        <!-- Gameplay Section -->
        <div class="settings-section">
          <h3 class="section-title" v-t="'systemSettings.gameplay'"></h3>
          
          <div class="setting-row">
            <span class="setting-label" v-t="'systemSettings.textSpeed'"></span>
             <div class="toggle-group">
                <button :class="{ active: settings.textSpeed === 'slow' }" @click="settings.textSpeed = 'slow'" v-t="'systemSettings.speeds.slow'"></button>
                <button :class="{ active: settings.textSpeed === 'normal' }" @click="settings.textSpeed = 'normal'" v-t="'systemSettings.speeds.normal'"></button>
                <button :class="{ active: settings.textSpeed === 'fast' }" @click="settings.textSpeed = 'fast'" v-t="'systemSettings.speeds.fast'"></button>
             </div>
          </div>
          
          <div class="setting-row">
            <span class="setting-label" v-t="'systemSettings.autoSave'"></span>
            <label class="switch">
              <input type="checkbox" v-model="settings.autoSave">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
         <!-- Actions -->
        <div class="action-buttons">
            <button class="sys-btn danger" v-t="'systemSettings.toTitle'"></button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAudioStore } from '@/stores/audio';

const audioStore = useAudioStore();

// 初始化音频（确保音量设置生效）
onMounted(() => {
  audioStore.initAudio();
});

const settings = reactive({
  textSpeed: 'normal',
  autoSave: true
});
</script>

<style scoped src="@styles/components/panels/SystemPanel.css"></style>

