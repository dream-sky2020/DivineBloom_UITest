export default {
  // --- Standard Ammo (6001-6099) ---
  item_ammo_standard: {
    id: "item_ammo_standard",
    name: {
      zh: '通用子弹',
      'zh-TW': '通用子彈',
      en: 'Standard Ammo',
      ja: '通常弾',
      ko: '일반 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo",
    subText: {
      zh: '基础弹药',
      'zh-TW': '基礎彈藥',
      en: 'Basic Ammo',
      ja: '基本弾薬',
      ko: '기본 탄약'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '适用于大多数枪械的标准子弹。',
      'zh-TW': '適用於大多數槍械的標準子彈。',
      en: 'Standard ammunition suitable for most firearms.',
      ja: '多くの銃器に適した標準的な弾薬。',
      ko: '대부분의 총기에 적합한 표준 탄약.'
    }
  },
  item_ammo_accelerated: {
    id: "item_ammo_accelerated",
    name: {
      zh: '二次推进加速子弹',
      'zh-TW': '二次推進加速子彈',
      en: 'Accelerated Ammo',
      ja: '加速弾',
      ko: '가속 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_speed",
    subText: {
      zh: '射速/命中提升',
      'zh-TW': '射速/命中提升',
      en: 'SPD/Hit Rate Up',
      ja: '速度/命中率アップ',
      ko: '속도/명중률 상승'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '通过二次推进技术大幅提高飞行速度的子弹。',
      'zh-TW': '通過二次推進技術大幅提高飛行速度的子彈。',
      en: 'Ammo with secondary propulsion for greatly increased velocity.',
      ja: '二次推進技術により飛翔速度を大幅に高めた弾丸。',
      ko: '2차 추진 기술로 비행 속도를 크게 높인 탄약.'
    }
  },

  // --- Elemental Ammo (6100-6199) ---
  item_ammo_flame: {
    id: "item_ammo_flame",
    name: {
      zh: '火焰子弹',
      'zh-TW': '火焰子彈',
      en: 'Flame Ammo',
      ja: '火炎弾',
      ko: '화염 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_fire",
    subText: {
      zh: '火焰伤害',
      'zh-TW': '火焰傷害',
      en: 'Fire Damage',
      ja: '炎ダメージ',
      ko: '화염 피해'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '击中目标后会发生燃烧的特种子弹。',
      'zh-TW': '擊中目標後會發生燃燒的特種子彈。',
      en: 'Special ammo that ignites upon impact.',
      ja: '着弾時に燃焼する特殊弾。',
      ko: '목표에 명중하면 연소하는 특수 탄약.'
    }
  },

  // --- Effect Ammo (6200-6299) ---
  item_ammo_cursed: {
    id: "item_ammo_cursed",
    name: {
      zh: '诅咒子弹',
      'zh-TW': '詛咒子彈',
      en: 'Cursed Ammo',
      ja: '呪いの弾丸',
      ko: '저주받은 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_curse",
    subText: {
      zh: '附加诅咒',
      'zh-TW': '附加詛咒',
      en: 'Inflicts Curse',
      ja: '呪い付与',
      ko: '저주 부여'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '刻有诅咒符文的子弹，能削弱敌人的能力。',
      'zh-TW': '刻有詛咒符文的子彈，能削弱敵人的能力。',
      en: 'Ammo inscribed with cursed runes to weaken enemies.',
      ja: '呪いのルーンが刻まれた弾丸。敵の能力を弱める。',
      ko: '저주 룬이 새겨진 탄약, 적의 능력을 약화시킨다.'
    }
  },
  item_ammo_explosive: {
    id: "item_ammo_explosive",
    name: {
      zh: '爆炸子弹',
      'zh-TW': '爆炸子彈',
      en: 'Explosive Ammo',
      ja: '炸裂弾',
      ko: '폭발 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_bomb",
    subText: {
      zh: '范围伤害',
      'zh-TW': '範圍傷害',
      en: 'Area Damage',
      ja: '範囲ダメージ',
      ko: '범위 피해'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '弹头装有微型炸药，造成小范围爆炸伤害。',
      'zh-TW': '彈頭裝有微型炸藥，造成小範圍爆炸傷害。',
      en: 'Ammo tipped with micro-explosives for small area damage.',
      ja: '弾頭に微細な爆薬を搭載し、小範囲の爆発ダメージを与える。',
      ko: '탄두에 소형 폭약이 장착되어 소범위 폭발 피해를 준다.'
    }
  },
  item_ammo_homing: {
    id: "item_ammo_homing",
    name: {
      zh: '追踪子弹',
      'zh-TW': '追蹤子彈',
      en: 'Homing Ammo',
      ja: '追尾弾',
      ko: '유도 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_homing",
    subText: {
      zh: '必定命中',
      'zh-TW': '必定命中',
      en: 'Sure Hit',
      ja: '必中',
      ko: '필중'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '能够自动修正弹道追踪目标的智能子弹。',
      'zh-TW': '能夠自動修正彈道追蹤目標的智能子彈。',
      en: 'Smart ammo that automatically corrects trajectory to track targets.',
      ja: '弾道を自動修正して標的を追尾するスマート弾。',
      ko: '탄도를 자동으로 수정하여 목표를 추적하는 스마트 탄약.'
    }
  },
  item_ammo_armor_piercing: {
    id: "item_ammo_armor_piercing",
    name: {
      zh: '穿甲子弹',
      'zh-TW': '穿甲子彈',
      en: 'Armor-Piercing Ammo',
      ja: '徹甲弾',
      ko: '철갑탄'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_pierce",
    subText: {
      zh: '无视防御',
      'zh-TW': '無視防禦',
      en: 'Ignore Def',
      ja: '防御無視',
      ko: '방어 무시'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '专门用于击穿重型护甲的强化弹芯子弹。',
      'zh-TW': '專門用於擊穿重型護甲的強化彈芯子彈。',
      en: 'Reinforced core ammo designed to penetrate heavy armor.',
      ja: '重装甲を貫通するために設計された強化弾芯弾。',
      ko: '중장갑을 뚫기 위해 설계된 강화 탄심 탄약.'
    }
  },
  item_ammo_corrosive: {
    id: "item_ammo_corrosive",
    name: {
      zh: '腐蚀子弹',
      'zh-TW': '腐蝕子彈',
      en: 'Corrosive Ammo',
      ja: '腐食弾',
      ko: '부식 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_acid",
    subText: {
      zh: '防御降低',
      'zh-TW': '防禦降低',
      en: 'Def Down',
      ja: '防御ダウン',
      ko: '방어력 감소'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '含有强酸物质，能腐蚀敌人的护甲。',
      'zh-TW': '含有強酸物質，能腐蝕敵人的護甲。',
      en: 'Contains acid that corrodes enemy armor.',
      ja: '強酸性物質を含み、敵の装甲を腐食させる。',
      ko: '강산성 물질을 함유하여 적의 장갑을 부식시킨다.'
    }
  },

  // --- Magic Ammo (6300-6399) ---
  item_ammo_enchanted: {
    id: "item_ammo_enchanted",
    name: {
      zh: '魔化子弹',
      'zh-TW': '魔化子彈',
      en: 'Enchanted Ammo',
      ja: '魔化弾',
      ko: '마화 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_magic",
    subText: {
      zh: '魔法伤害',
      'zh-TW': '魔法傷害',
      en: 'Magic Dmg',
      ja: '魔法ダメージ',
      ko: '마법 피해'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '灌注了魔力的子弹，造成魔法属性伤害。',
      'zh-TW': '灌注了魔力的子彈，造成魔法屬性傷害。',
      en: 'Ammo infused with magic, dealing magic damage.',
      ja: '魔力を注入した弾丸。魔法属性のダメージを与える。',
      ko: '마력을 주입한 탄약, 마법 속성 피해를 준다.'
    }
  },
  item_ammo_purifying: {
    id: "item_ammo_purifying",
    name: {
      zh: '净化子弹',
      'zh-TW': '淨化子彈',
      en: 'Purifying Ammo',
      ja: '浄化弾',
      ko: '정화 탄약'
    },
    type: "itemTypes.ammo",
    icon: "icon_ammo_holy",
    subText: {
      zh: '对不死特效',
      'zh-TW': '對不死特效',
      en: 'Anti-Undead',
      ja: '対アンデッド',
      ko: '대언데드'
    },
    footerLeft: "itemTypes.ammo",
    description: {
      zh: '经过圣水浸泡的子弹，对不死生物有奇效。',
      'zh-TW': '經過聖水浸泡的子彈，對不死生物有奇效。',
      en: 'Ammo soaked in holy water, effective against undead.',
      ja: '聖水に浸した弾丸。アンデッドに効果的。',
      ko: '성수에 담근 탄약, 언데드에게 효과적이다.'
    }
  }
}
