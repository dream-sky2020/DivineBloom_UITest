/**
 * 战斗机制标签
 */
export default {
    'mech_aoe': {
        id: 'mech_aoe',
        name: { zh: '群体', 'zh-TW': '群體', en: 'AoE', ja: '全体', ko: '광역' },
        description: { zh: '作用于范围内多个目标的技能。', en: 'Skills that affect multiple targets within range.', 'zh-TW': '作用於範圍內多個目標的技能。', ja: '範囲内の複数のターゲットに作用するスキル。', ko: '범위 내의 여러 대상을 공격하는 스킬.' },
        color: '#ff00ff'
    },
    'mech_multi_hit': {
        id: 'mech_multi_hit',
        name: { zh: '连击', 'zh-TW': '連擊', en: 'Multi-hit', ja: '連続', ko: '연타' },
        description: { zh: '在一次行动中进行多次攻击。', en: 'Performs multiple attacks in a single action.', 'zh-TW': '在一次行動中進行多次攻擊。', ja: '1回のアクションで複数回攻撃を行う。', ko: '한 번의 행동으로 여러 번 공격함.' },
        color: '#ffaaaa'
    },
    'mech_death_trigger': {
        id: 'mech_death_trigger',
        name: { zh: '死亡触发', 'zh-TW': '死亡觸發', en: 'Death Trigger', ja: '死亡時', ko: '사망시' },
        description: { zh: '在单位死亡时触发的效果。', en: 'Effects triggered when a unit dies.', 'zh-TW': '在單位死亡時觸發的效果。', ja: 'ユニットが死亡したときにトリガーされる効果。', ko: '유닛이 사망할 때 발동되는 효과.' },
        color: '#333333'
    },
    'mech_passive': {
        id: 'mech_passive',
        name: { zh: '常驻', 'zh-TW': '常駐', en: 'Passive', ja: '常時', ko: '패시브' },
        description: { zh: '无需主动发动，持续生效的能力。', en: 'Abilities that are always active without manual activation.', 'zh-TW': '無需主動發動，持續生效的能力。', ja: '手動で発動する必要がなく、常に有効な能力。', ko: '별도의 발동 없이 지속적으로 적용되는 능력.' },
        color: '#ffffff'
    },
    'mech_quick': {
        id: 'mech_quick',
        name: { zh: '迅捷', 'zh-TW': '迅捷', en: 'Quick', ja: '迅速', ko: '신속' },
        description: { zh: '具有较高优先级或较短冷却的行动。', en: 'Actions with high priority or shorter cooldowns.', 'zh-TW': '具有較高優先級或較短冷卻的行動。', ja: '優先順位が高い、またはクールダウンが短いアクション。', ko: '높은 우선순위나 짧은 재사용 대기시간을 가진 행동.' },
        color: '#aaff00'
    }
}
