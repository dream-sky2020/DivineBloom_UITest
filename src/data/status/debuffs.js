export default {
  1: {
    id: 1,
    name: {
      zh: '中毒',
      'zh-TW': '中毒',
      en: 'Poison',
      ja: '毒',
      ko: '중독'
    },
    type: "statusTypes.debuff",
    icon: "icon_poison",
    subText: {
      zh: '持续伤害',
      'zh-TW': '持續傷害',
      en: 'DoT',
      ja: '継続ダメージ',
      ko: '지속 피해'
    },
    description: {
      zh: '每回合受到毒素伤害。',
      'zh-TW': '每回合受到毒素傷害。',
      en: 'Takes poison damage each turn.',
      ja: '毎ターン毒ダメージを受ける。',
      ko: '매 턴 독 피해를 입는다.'
    },
    effects: [
      { trigger: 'turnStart', type: 'damage', value: 0.05, scaling: 'maxHp' }
    ]
  },
  2: {
    id: 2,
    name: {
      zh: '烧伤',
      'zh-TW': '燒傷',
      en: 'Burn',
      ja: '火傷',
      ko: '화상'
    },
    type: "statusTypes.debuff",
    icon: "icon_fire",
    subText: {
      zh: '持续伤害',
      'zh-TW': '持續傷害',
      en: 'DoT',
      ja: '継続ダメージ',
      ko: '지속 피해'
    },
    description: {
      zh: '被火焰灼烧，防御力降低并持续受到伤害。',
      'zh-TW': '被火焰灼燒，防禦力降低並持續受到傷害。',
      en: 'Burned by fire, lowers defense and takes DoT.',
      ja: '炎に焼かれ、防御力が低下し継続ダメージを受ける。',
      ko: '화염에 불타 방어력이 감소하고 지속 피해를 입는다.'
    },
    effects: [
      { trigger: 'turnStart', type: 'damage', value: 0.08, scaling: 'maxHp' },
      { trigger: 'passive', type: 'statMod', stat: 'def', value: 0.8 }
    ]
  },
  3: {
    id: 3,
    name: {
      zh: '冻结',
      'zh-TW': '凍結',
      en: 'Freeze',
      ja: '凍結',
      ko: '동결'
    },
    type: "statusTypes.debuff",
    icon: "icon_freeze",
    subText: {
      zh: '无法行动',
      'zh-TW': '無法行動',
      en: 'Stunned',
      ja: '行動不能',
      ko: '행동 불가'
    },
    description: {
      zh: '身体被冻结，无法进行任何行动。',
      'zh-TW': '身體被凍結，無法進行任何行動。',
      en: 'Frozen solid, unable to act.',
      ja: '体が凍りつき、一切の行動ができない。',
      ko: '몸이 얼어붙어 아무런 행동도 할 수 없다.'
    },
    effects: [
      { trigger: 'checkAction', type: 'stun', chance: 1.0 }
    ]
  },
  4: {
    id: 4,
    name: {
      zh: '麻痹',
      'zh-TW': '麻痺',
      en: 'Paralysis',
      ja: '麻痺',
      ko: '마비'
    },
    type: "statusTypes.debuff",
    icon: "icon_lightning",
    subText: {
      zh: '行动受阻',
      'zh-TW': '行動受阻',
      en: 'Stun Chance',
      ja: '行動阻害',
      ko: '행동 제한'
    },
    description: {
      zh: '身体麻木，有几率无法行动。',
      'zh-TW': '身體麻木，有機率無法行動。',
      en: 'Body is numb, chance to skip turn.',
      ja: '体が痺れ、行動できないことがある。',
      ko: '몸이 마비되어 행동하지 못할 확률이 있다.'
    },
    effects: [
      { trigger: 'checkAction', type: 'stun', chance: 0.5 }
    ]
  },
  5: {
    id: 5,
    name: {
      zh: '流血',
      'zh-TW': '流血',
      en: 'Bleed',
      ja: '出血',
      ko: '출혈'
    },
    type: "statusTypes.debuff",
    icon: "icon_bleed",
    subText: {
      zh: '持续伤害',
      'zh-TW': '持續傷害',
      en: 'DoT',
      ja: '継続ダメージ',
      ko: '지속 피해'
    },
    description: {
      zh: '伤口裂开，每回合受到伤害。',
      'zh-TW': '傷口裂開，每回合受到傷害。',
      en: 'Wounds are open, taking damage each turn.',
      ja: '傷口が開き、毎ターンダメージを受ける。',
      ko: '상처가 벌어져 매 턴 피해를 입는다.'
    },
    effects: [
      { trigger: 'turnStart', type: 'damage', value: 0.1, scaling: 'maxHp' }
    ]
  },
  6: {
    id: 6,
    name: {
      zh: '减速',
      'zh-TW': '減速',
      en: 'Slow',
      ja: 'スロウ',
      ko: '감속'
    },
    type: "statusTypes.debuff",
    icon: "icon_slow",
    subText: {
      zh: '速度降低',
      'zh-TW': '速度降低',
      en: 'Speed Down',
      ja: '速度低下',
      ko: '속도 감소'
    },
    description: {
      zh: '行动速度大幅降低。',
      'zh-TW': '行動速度大幅降低。',
      en: 'Action speed is significantly decreased.',
      ja: '行動速度が大幅に低下する。',
      ko: '행동 속도가 크게 감소한다.'
    },
    effects: [
      { trigger: 'passive', type: 'statMod', stat: 'spd', value: 0.7 }
    ]
  },
  7: {
    id: 7,
    name: {
      zh: '防御降低',
      'zh-TW': '防禦降低',
      en: 'Defense Down',
      ja: '防御力低下',
      ko: '방어력 감소'
    },
    type: "statusTypes.debuff",
    icon: "icon_buff_def",
    subText: {
      zh: 'DEF -30%',
      'zh-TW': 'DEF -30%',
      en: 'DEF -30%',
      ja: '防御力 -30%',
      ko: '방어력 -30%'
    },
    description: {
      zh: '物理防御力降低。',
      'zh-TW': '物理防禦力降低。',
      en: 'Physical defense is decreased.',
      ja: '物理防御力が低下する。',
      ko: '물리 방어력이 감소한다.'
    },
    effects: [
      { trigger: 'passive', type: 'statMod', stat: 'def', value: 0.7 }
    ]
  },
  8: {
    id: 8,
    name: {
      zh: '攻击降低',
      'zh-TW': '攻擊降低',
      en: 'Attack Down',
      ja: '攻撃力低下',
      ko: '공격력 감소'
    },
    type: "statusTypes.debuff",
    icon: "icon_buff_atk",
    subText: {
      zh: 'ATK -30%',
      'zh-TW': 'ATK -30%',
      en: 'ATK -30%',
      ja: '攻撃力 -30%',
      ko: '공격력 -30%'
    },
    description: {
      zh: '物理攻击力降低。',
      'zh-TW': '物理攻擊力降低。',
      en: 'Physical attack power is decreased.',
      ja: '物理攻撃力が低下する。',
      ko: '물리 공격력이 감소한다.'
    },
    effects: [
      { trigger: 'passive', type: 'statMod', stat: 'atk', value: 0.7 }
    ]
  }
}

