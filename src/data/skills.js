// src/data/skills.js

/**
 * 技能数据库
 * ID 规则:
 * 100-199: 物理攻击技能 (Physical)
 * 200-299: 魔法攻击技能 (Magic)
 * 300-399: 治疗/辅助技能 (Support)
 * 400-499: 被动技能 (Passive)
 */
export const skillsDb = {
  // Physical Skills
  101: {
    id: 101,
    name: {
      zh: '强力斩击',
      'zh-TW': '強力斬擊',
      en: 'Power Slash',
      ja: 'パワースラッシュ',
      ko: '파워 슬래시'
    },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "enemy",
    effects: [
      { type: "damage", value: 1.5, scaling: "atk" },
      { type: "applyStatus", status: 5, chance: 0.3, duration: 3 }
    ],
    icon: "icon_sword",
    cost: "5 MP",
    subText: {
      zh: '单体物理伤害/流血',
      'zh-TW': '單體物理傷害/流血',
      en: 'Phys Dmg/Bleed',
      ja: '単体物理/出血',
      ko: '단일 물리/출혈'
    },
    description: {
      zh: '对一名敌人造成强力的物理伤害，有几率造成流血。',
      'zh-TW': '對一名敵人造成強力的物理傷害，有機率造成流血。',
      en: 'Deals powerful physical damage, chance to bleed.',
      ja: '敵単体に強力な物理ダメージを与え、出血させることがある。',
      ko: '적 한 명에게 강력한 물리 피해를 주고 출혈을 일으킬 수 있다.'
    }
  },
  102: {
    id: 102,
    name: {
      zh: '回旋斩',
      'zh-TW': '迴旋斬',
      en: 'Spinning Slash',
      ja: '回転斬り',
      ko: '회전 베기'
    },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 0.8, scaling: "atk" },
      { type: "applyStatus", status: 5, chance: 0.2, duration: 2 }
    ],
    icon: "icon_impact",
    cost: "15 MP",
    subText: {
      zh: '群体物理伤害/流血',
      'zh-TW': '群體物理傷害/流血',
      en: 'AoE Phys Dmg/Bleed',
      ja: '全体物理/出血',
      ko: '전체 물리/출혈'
    },
    description: {
      zh: '挥舞武器攻击所有敌人，有低几率造成流血。',
      'zh-TW': '揮舞武器攻擊所有敵人，有低機率造成流血。',
      en: 'Attacks all enemies, small chance to bleed.',
      ja: '武器を振り回して敵全体を攻撃する。低確率で出血させる。',
      ko: '무기를 휘둘러 적 전체를 공격한다. 낮은 확률로 출혈을 일으킨다.'
    }
  },

  // Magic Skills
  201: {
    id: 201,
    name: {
      zh: '火球术',
      'zh-TW': '火球術',
      en: 'Fireball',
      ja: 'ファイアボール',
      ko: '파이어볼'
    },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.fire",
    targetType: "enemy",
    effects: [
      { type: "damage", value: 1.3, scaling: "mag", element: "elements.fire" }
    ],
    icon: "icon_fire",
    cost: "10 MP",
    subText: {
      zh: '单体火焰伤害',
      'zh-TW': '單體火焰傷害',
      en: 'Single Target Fire Dmg',
      ja: '単体火属性ダメージ',
      ko: '단일 화염 피해'
    },
    description: {
      zh: '发射火球攻击一名敌人，有几率造成烧伤。',
      'zh-TW': '發射火球攻擊一名敵人，有機率造成燒傷。',
      en: 'Launches a fireball at one enemy, chance to burn.',
      ja: '火の玉を放ち敵単体を攻撃する。火傷効果あり。',
      ko: '화염구를 발사하여 적 한 명을 공격한다. 화상 확률 있음.'
    }
  },
  202: {
    id: 202,
    name: {
      zh: '冰锥术',
      'zh-TW': '冰錐術',
      en: 'Ice Shard',
      ja: 'アイスシャード',
      ko: '아이스 샤드'
    },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.ice",
    targetType: "enemy",
    effects: [
      { type: "damage", value: 1.2, scaling: "mag", element: "elements.ice" },
      { type: "applyStatus", status: 3, chance: 0.2, duration: 1 }, // Freeze
      { type: "applyStatus", status: 6, chance: 0.3, duration: 3 }  // Slow
    ],
    icon: "icon_ice",
    cost: "12 MP",
    subText: {
      zh: '单体冰冻伤害/冻结/减速',
      'zh-TW': '單體冰凍傷害/凍結/減速',
      en: 'Ice Dmg/Freeze/Slow',
      ja: '単体氷/凍結/スロウ',
      ko: '단일 얼음/동결/감속'
    },
    description: {
      zh: '召唤锋利的冰锥攻击敌人，有几率冻结敌人或降低其速度。',
      'zh-TW': '召喚鋒利的冰錐攻擊敵人，有機率凍結敵人或降低其速度。',
      en: 'Summons sharp ice shards, chance to freeze or lower speed.',
      ja: '鋭い氷の破片で攻撃する。凍結または速度低下の効果がある。',
      ko: '날카로운 얼음 조각을 소환하여 공격한다. 동결 또는 속도 감소 확률이 있다.'
    }
  },
  203: {
    id: 203,
    name: {
      zh: '闪电链',
      'zh-TW': '閃電鏈',
      en: 'Chain Lightning',
      ja: 'チェーンライトニング',
      ko: '체인 라이트닝'
    },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.lightning",
    // Changed to enemy to allow selecting the start of the chain
    targetType: "enemy",
    chain: 3, // Bounce 3 times
    decay: 0.85, // 85% damage per bounce
    effects: [
      { type: "damage", value: 1.1, scaling: "mag", element: "elements.lightning" },
      { type: "applyStatus", status: 4, chance: 0.3, duration: 2 }
    ],
    icon: "icon_lightning",
    cost: "25 MP",
    subText: {
      zh: '弹射雷电/麻痹',
      'zh-TW': '彈射雷電/麻痺',
      en: 'Bounce Lightning/Paralysis',
      ja: '連鎖雷属性ダメージ',
      ko: '연쇄 번개 피해'
    },
    description: {
      zh: '释放一道在敌人之间跳跃的闪电，有几率造成麻痹。',
      'zh-TW': '釋放一道在敵人之間跳躍的閃電，有機率造成麻痺。',
      en: 'Unleashes a bolt of lightning that jumps between enemies, chance to paralyze.',
      ja: '敵の間を跳ね回る稲妻を放つ。',
      ko: '적들 사이를 튕겨 다니는 번개를 방출한다.'
    }
  },

  // Support Skills
  301: {
    id: 301,
    name: {
      zh: '治愈术',
      'zh-TW': '治癒術',
      en: 'Heal',
      ja: 'ヒール',
      ko: '힐'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "ally",
    effects: [
      { type: "heal", value: 500 }
    ],
    icon: "icon_heal",
    cost: "20 MP",
    subText: {
      zh: '单体治疗',
      'zh-TW': '單體治療',
      en: 'Single Target Heal',
      ja: '単体回復',
      ko: '단일 치유'
    },
    description: {
      zh: '恢复己方单体目标的生命值。',
      'zh-TW': '恢復己方單體目標的生命值。',
      en: 'Restores HP to a single ally.',
      ja: '味方単体のHPを回復する。',
      ko: '아군 한 명의 HP를 회복시킨다.'
    }
  },
  302: {
    id: 302,
    name: {
      zh: '护盾术',
      'zh-TW': '護盾術',
      en: 'Shield',
      ja: 'プロテス',
      ko: '쉴드'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "allAllies",
    effects: [
      { type: "buff", stat: "def", value: 1.5, duration: 3 }
    ],
    icon: "icon_shield",
    cost: "30 MP",
    subText: {
      zh: '增加防御',
      'zh-TW': '增加防禦',
      en: 'Increase Defense',
      ja: '防御力アップ',
      ko: '방어력 증가'
    },
    description: {
      zh: '在短时间内提高己方全体的防御力。',
      'zh-TW': '在短時間內提高己方全體的防禦力。',
      en: 'Temporarily increases defense for all allies.',
      ja: '短時間、味方全員の防御力を高める。',
      ko: '短い時間、味方全員の防御力を高める。'
    }
  },
  303: {
    id: 303,
    name: {
      zh: '复活术',
      'zh-TW': '復活術',
      en: 'Resurrection',
      ja: 'レイズ',
      ko: '부활'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "deadAlly",
    effects: [
      { type: "revive", value: 0.2 }
    ],
    icon: "icon_revive",
    cost: "40 MP",
    subText: {
      zh: '复活队友',
      'zh-TW': '復活隊友',
      en: 'Revive Ally',
      ja: '蘇生',
      ko: '아군 부활'
    },
    description: {
      zh: '复活一名倒下的队友并恢复少量生命值。',
      'zh-TW': '復活一名倒下的隊友並恢復少量生命值。',
      en: 'Revives a fallen ally with a small amount of HP.',
      ja: '倒れた仲間を蘇生し、HPを少量回復する。',
      ko: '쓰러진 아군을 부활시키고 소량의 HP를 회복시킨다.'
    }
  },

  // Passive Skills
  401: {
    id: 401,
    name: {
      zh: '攻击强化',
      'zh-TW': '攻擊強化',
      en: 'Attack Up',
      ja: '攻撃力強化',
      ko: '공격력 강화'
    },
    type: "skillTypes.passive",
    category: "skillCategories.passive",
    icon: "icon_strength",
    cost: "--",
    subText: {
      zh: '被动效果',
      'zh-TW': '被動效果',
      en: 'Passive Effect',
      ja: 'パッシブ効果',
      ko: '패시브 효과'
    },
    description: {
      zh: '永久提升角色的物理攻击力。',
      'zh-TW': '永久提升角色的物理攻擊力。',
      en: 'Permanently increases physical attack power.',
      ja: 'キャラクターの物理攻撃力を永続的に上昇させる。',
      ko: '캐릭터의 물리 공격력을 영구적으로 상승시킨다.'
    }
  },
  402: {
    id: 402,
    name: {
      zh: '法力再生',
      'zh-TW': '法力再生',
      en: 'Mana Regen',
      ja: '魔力再生',
      ko: '마나 재생'
    },
    type: "skillTypes.passive",
    category: "skillCategories.passive",
    icon: "icon_mana",
    cost: "--",
    subText: {
      zh: '被动效果',
      'zh-TW': '被動效果',
      en: 'Passive Effect',
      ja: 'パッシブ効果',
      ko: '패시브 효과'
    },
    description: {
      zh: '每回合自动恢复少量魔法值。',
      'zh-TW': '每回合自動恢復少量魔法值。',
      en: 'Automatically restores a small amount of MP each turn.',
      ja: '毎ターンMPを少量自動回復する。',
      ko: '매 턴마다 소량의 MP를 자동으로 회복한다.'
    }
  },

  // Boss Skills (1000+)
  // Emperor Shenwu (101)
  1001: {
    id: 1001,
    name: { zh: '雷霆轰击', 'zh-TW': '雷霆轟擊', en: 'Thunder Strike', ja: '落雷', ko: '뇌전' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.lightning",
    targetType: "single", // AI Logic overrides this usually, but good to have
    effects: [
      { type: "damage", value: 1.6, scaling: "mag", element: "elements.lightning" },
      { type: "applyStatus", status: 4, duration: 2, chance: 1.0 } // Paralysis
    ]
  },
  1002: {
    id: 1002,
    name: { zh: '极寒暴风雪', 'zh-TW': '極寒暴風雪', en: 'Blizzard', ja: 'ブリザード', ko: '눈보라' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.ice",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.3, scaling: "mag", element: "elements.ice" },
      { type: "applyStatus", status: 3, duration: 1, chance: 0.3 }, // Freeze
      { type: "applyStatus", status: 6, duration: 3, chance: 0.5 }  // Slow
    ]
  },

  // Shahryar (102)
  1003: {
    id: 1003,
    name: { zh: '精准刺击', 'zh-TW': '精準刺擊', en: 'Precision Stab', ja: '精密突き', ko: '정밀 찌르기' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.5, scaling: "str" },
      { type: "applyStatus", status: 5, duration: 3 } // Bleed
    ]
  },
  1004: {
    id: 1004,
    name: { zh: '圆月斩', 'zh-TW': '圓月斬', en: 'Full Moon Slash', ja: '円月斬り', ko: '원월참' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.0, scaling: "str" },
      { type: "applyStatus", status: 5, duration: 3 } // Bleed
    ]
  },

  // Hefietian (103)
  1005: {
    id: 1005,
    name: { zh: '烈焰之剑', 'zh-TW': '烈焰之劍', en: 'Flaming Sword', ja: '烈火の剣', ko: '화염의 검' },
    type: "skillTypes.active",
    category: "skillCategories.physical", // Originally str scaling, likely physical with fire element visual
    element: "elements.fire",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.8, scaling: "str", element: "elements.fire" },
      { type: "applyStatus", status: 2, duration: 3 } // Burn
    ]
  },
  1006: {
    id: 1006,
    name: { zh: '燎原烈火', 'zh-TW': '燎原烈火', en: 'Prairie Fire', ja: '燎原の炎', ko: '요원의 불길' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.fire",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.2, scaling: "mag", element: "elements.fire" },
      { type: "applyStatus", status: 2, duration: 3 } // Burn
    ]
  }
};
