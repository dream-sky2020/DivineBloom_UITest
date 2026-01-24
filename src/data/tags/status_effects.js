/**
 * 基础战斗效果标签
 */
export default {
    'status_healing': {
        id: 'status_healing',
        name: { zh: '治疗', en: 'Healing', 'zh-TW': '治療', ja: '回復', ko: '치유' },
        description: { zh: '涉及生命恢复的效果。', en: 'Effects involving HP restoration.', 'zh-TW': '涉及生命恢復的效果。', ja: 'HP回復に関する効果。', ko: '생명력 회복과 관련된 효과.' },
        color: '#00ff88'
    },
    'status_buff': {
        id: 'status_buff',
        name: { zh: '增益', 'zh-TW': '增益', en: 'Buff', ja: '強化', ko: '버프' },
        description: { zh: '提升能力的正面效果。', en: 'Positive effects that increase abilities.', 'zh-TW': '提升能力的正面效果。', ja: '能力を高めるポジティブな効果。', ko: '능력을 향상시키는 긍정적인 효과.' },
        color: '#00aaff'
    },
    'status_debuff': {
        id: 'status_debuff',
        name: { zh: '减益', 'zh-TW': '減益', en: 'Debuff', ja: '弱体', ko: '디버프' },
        description: { zh: '降低能力的负面效果。', en: 'Negative effects that decrease abilities.', 'zh-TW': '降低能力的負面效果。', ja: '能力を低下させるネガティブな効果。', ko: '능력을 저하시키는 부정적인 효과.' },
        color: '#ff6600'
    },
    'status_revive': {
        id: 'status_revive',
        name: { zh: '复活', 'zh-TW': '復活', en: 'Revive', ja: '蘇生', ko: '부활' },
        description: { zh: '使死亡或濒死的单位恢复生命。', en: 'Restores life to dead or dying units.', 'zh-TW': '使死亡或瀕死的單位恢復生命。', ja: '死亡または瀕死のユニットを復活させる。', ko: '사망하거나 빈사 상태인 유닛을 부활시킴.' },
        color: '#ffffcc'
    },
    'status_elemental': {
        id: 'status_elemental',
        name: { zh: '元素', en: 'Elemental', 'zh-TW': '元素', ja: '元素', ko: '원소' },
        description: { zh: '与自然元素力量相关的效果。', en: 'Effects related to natural elemental powers.', 'zh-TW': '與自然元素力量相關的效果。', ja: '自然の元素の力に関連する効果。', ko: '자연 원소의 힘과 관련된 효과.' },
        color: '#00ffff'
    }
}
