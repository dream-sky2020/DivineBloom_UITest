import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAudioStore } from './audio';
import i18n from '@/i18n'; // Assuming alias @ points to src

const STORAGE_KEY = 'game_settings_v1';

export const useSettingsStore = defineStore('settings', () => {
    const audioStore = useAudioStore();

    // --- State ---
    const language = ref('zh'); // Default language
    const battleSpeed = ref(1);
    const textSpeed = ref('normal');
    const autoSave = ref(true);

    // --- Actions ---

    // Load settings from localStorage
    const initSettings = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // Restore generic settings
                if (data.language) language.value = data.language;
                if (data.battleSpeed) battleSpeed.value = data.battleSpeed;
                if (data.textSpeed) textSpeed.value = data.textSpeed;
                if (typeof data.autoSave === 'boolean') autoSave.value = data.autoSave;

                // Restore Audio
                if (data.audio) {
                    audioStore.masterVolume = data.audio.master ?? 80;
                    audioStore.bgmVolume = data.audio.bgm ?? 60;
                    audioStore.sfxVolume = data.audio.sfx ?? 100;
                    // Trigger audio update manually or rely on store watchers if they are active
                    // AudioStore's watcher handles sync to AudioManager
                }
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }

        // Apply Side Effects
        applyLanguage();
    };

    // Save settings to localStorage
    const saveSettings = () => {
        const data = {
            language: language.value,
            battleSpeed: battleSpeed.value,
            textSpeed: textSpeed.value,
            autoSave: autoSave.value,
            audio: {
                master: audioStore.masterVolume,
                bgm: audioStore.bgmVolume,
                sfx: audioStore.sfxVolume
            }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const applyLanguage = () => {
        if (i18n && i18n.global) {
             i18n.global.locale.value = language.value;
        }
    };

    const setLanguage = (lang) => {
        language.value = lang;
        applyLanguage();
    };

    // --- Watchers ---
    // Watch for changes in settings state to auto-save
    watch(
        [language, battleSpeed, textSpeed, autoSave],
        () => {
            saveSettings();
        },
        { deep: true }
    );

    // Watch Audio Store changes to auto-save
    // Note: This creates a dependency where Settings monitors Audio. 
    // Alternatively, Audio could save itself, but we want a single file.
    watch(
        () => [audioStore.masterVolume, audioStore.bgmVolume, audioStore.sfxVolume],
        () => {
            saveSettings();
        }
    );

    return {
        // State
        language,
        battleSpeed,
        textSpeed,
        autoSave,

        // Actions
        initSettings,
        setLanguage
    };
});

