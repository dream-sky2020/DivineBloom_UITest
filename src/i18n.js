import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zh from './locales/zh'
import zhTW from './locales/zh-TW'
import ja from './locales/ja'
import ko from './locales/ko'
import ui from './locales/ui'

// Helper to transform "Key -> Locale -> Text" to "Locale -> Key -> Text"
function transformUiToMessages(uiData) {
  const messages = {};
  const supportedLocales = ['en', 'zh', 'zh-TW', 'ja', 'ko'];

  function traverse(currentObj, path = []) {
    for (const key in currentObj) {
      const value = currentObj[key];
      // Check if this value is a translation leaf (contains locale keys)
      const isLeaf = typeof value === 'object' && value !== null && 
        supportedLocales.some(locale => locale in value);

      if (isLeaf) {
        for (const locale in value) {
          if (!messages[locale]) messages[locale] = {};
          
          let currentLevel = messages[locale];
          for (let i = 0; i < path.length; i++) {
            const pathKey = path[i];
            if (!currentLevel[pathKey]) currentLevel[pathKey] = {};
            currentLevel = currentLevel[pathKey];
          }
          currentLevel[key] = value[locale];
        }
      } else if (typeof value === 'object' && value !== null) {
        traverse(value, [...path, key]);
      }
    }
  }

  traverse(uiData);
  return messages;
}

// Simple deep merge helper
function deepMerge(target, source) {
  if (!source) return target;
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const uiMessages = transformUiToMessages(ui);

// Merge existing locale files with the new ui messages
// We start with the existing files as base, and overwrite/extend with ui.js content
const messages = {
  en: deepMerge(en, uiMessages.en),
  zh: deepMerge(zh, uiMessages.zh),
  'zh-TW': deepMerge(zhTW, uiMessages['zh-TW']),
  ja: deepMerge(ja, uiMessages.ja),
  ko: deepMerge(ko, uiMessages.ko)
};

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh',  // 默认语言
  fallbackLocale: 'en',
  messages
})

export default i18n
