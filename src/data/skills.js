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
  103: {
    id: 103,
    name: {
      zh: '碧绿的尖刺爆炸',
      'zh-TW': '碧綠的尖刺爆炸',
      en: 'Emerald Spike Explosion',
      ja: 'エメラルドスパイク',
      ko: '에메랄드 스파이크'
    },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "allOtherUnits",
    effects: [
      { type: "damage", value: 1.2, scaling: "atk" },
      { type: "applyStatus", status: 1, chance: 0.4, duration: 3 }, // Poison
      { type: "applyStatus", status: 6, chance: 0.4, duration: 3 }, // Slow
      { type: "applyStatus", status: 5, chance: 0.4, duration: 3 }  // Bleed
    ],
    icon: "icon_spike_explosion",
    cost: "40 MP",
    subText: {
      zh: '全场伤害/异常状态',
      'zh-TW': '全場傷害/異常狀態',
      en: 'Field Dmg/Debuffs',
      ja: '全域ダメージ/状態異常',
      ko: '광역 피해/상태이상'
    },
    description: {
      zh: '对除自己以外的所有队友和敌人造成物理伤害，并有概率附加中毒、缓速和流血状态。',
      'zh-TW': '對除自己以外的所有隊友和敵人造成物理傷害，並有機率附加中毒、緩速和流血狀態。',
      en: 'Deals physical damage to all other allies and enemies, chance to poison, slow, and bleed.',
      ja: '自分以外の敵味方全員に物理ダメージを与え、確率で毒・スロウ・出血を付与する。',
      ko: '자신을 제외한 모든 아군과 적에게 물리 피해를 입히고, 확률적으로 중독, 감속, 출혈 상태를 부여한다.'
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
  204: {
    id: 204,
    name: {
      zh: '平等的疫碧雨',
      'zh-TW': '平等的疫碧雨',
      en: 'Equal Plague Rain',
      ja: '平等の疫病雨',
      ko: '평등한 역병 비'
    },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.water",
    targetType: "allUnits",
    effects: [
      { type: "plague_rain", value: 200 } // value for heal amount
    ],
    icon: "icon_plague_rain",
    cost: "50 MP",
    subText: {
      zh: '敌我全体中毒/再生/治疗',
      'zh-TW': '敵我全體中毒/再生/治療',
      en: 'Global Poison/Regen/Heal',
      ja: '敵味方全体毒/再生/回復',
      ko: '피아 전체 중독/재생/치유'
    },
    description: {
      zh: '降下带有疫病与恩赐的大雨，使场上所有单位中毒并获得再生，同时恢复生命值。',
      'zh-TW': '降下帶有疫病與恩賜的大雨，使場上所有單位中毒並獲得再生，同時恢復生命值。',
      en: 'Rains down plague and grace, poisoning and granting regen to all units, while restoring HP.',
      ja: '疫病と恩恵をもたらす雨を降らせ、全ユニットを毒と再生状態にし、HPを回復する。',
      ko: '역병과 은총을 담은 비를 내려 모든 유닛을 중독 및 재생 상태로 만들고 HP를 회복시킨다.'
    }
  },

  205: {
    id: 205,
    name: {
      zh: '将神之敌困于人间地狱',
      'zh-TW': '將神之敵困於人間地獄',
      en: 'Trapping God\'s Enemy in Living Hell',
      ja: '神の敵を生き地獄に',
      ko: '신의 적을 생지옥에 가두다'
    },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.dark",
    targetType: "deadEnemy",
    effects: [
      { type: "revive_enemy", value: 0.5, duration: 20 }
    ],
    icon: "icon_hell_revival",
    cost: "100 MP",
    subText: {
      zh: '复活敌方并施加诅咒',
      'zh-TW': '復活敵方並施加詛咒',
      en: 'Revive Enemy w/ Curse',
      ja: '敵蘇生/呪い',
      ko: '적 부활/저주'
    },
    description: {
      zh: '复活一名敌方单位，并使其陷入包含中毒、燃烧、麻痹、冰封、流血及攻防降低在内的地狱状态，持续20回合。',
      'zh-TW': '復活一名敵方單位，並使其陷入包含中毒、燃燒、麻痺、冰封、流血及攻防降低在內的地獄狀態，持續20回合。',
      en: 'Revives an enemy and inflicts them with hellish statuses including poison, burn, paralysis, freeze, bleed, and lowered stats for 20 turns.',
      ja: '敵1体を蘇生し、毒、火傷、麻痺、凍結、出血、ステータス低下を含む地獄の状態異常を20ターン付与する。',
      ko: '적 한 명을 부활시키고 중독, 화상, 마비, 동결, 출혈 및 능력치 감소를 포함한 지옥의 상태이상을 20턴 동안 부여한다.'
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

  304: {
    id: 304,
    name: {
      zh: '群体复活',
      'zh-TW': '群體復活',
      en: 'Mass Resurrection',
      ja: 'アレイズ',
      ko: '광역 부활'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "allDeadAllies",
    effects: [
      { type: "revive", value: 0.5 }
    ],
    icon: "icon_revive_all",
    cost: "80 MP",
    subText: {
      zh: '群体复活',
      'zh-TW': '群體復活',
      en: 'Mass Revive',
      ja: '全体蘇生',
      ko: '전체 부활'
    },
    description: {
      zh: '复活所有倒下的队友并恢复中量生命值。',
      'zh-TW': '復活所有倒下的隊友並恢復中量生命值。',
      en: 'Revives all fallen allies with a moderate amount of HP.',
      ja: '倒れた仲間全員を蘇生し、HPを中量回復する。',
      ko: '쓰러진 아군 전원을 부활시키고 중량의 HP를 회복시킨다.'
    }
  },
  305: {
    id: 305,
    name: {
      zh: '群体治疗术',
      'zh-TW': '群體治療術',
      en: 'Mass Heal',
      ja: 'ヒールオール',
      ko: '매스 힐'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "allAllies",
    effects: [
      { type: "heal_all", value: 500 }
    ],
    icon: "icon_heal_all",
    cost: "45 MP",
    subText: {
      zh: '群体治疗',
      'zh-TW': '群體治療',
      en: 'AoE Heal',
      ja: '全体回復',
      ko: '전체 치유'
    },
    description: {
      zh: '恢复己方全体成员的生命值。',
      'zh-TW': '恢復己方全體成員的生命值。',
      en: 'Restores HP to all allies.',
      ja: '味方全員のHPを回復する。',
      ko: '아군 전원의 HP를 회복시킨다.'
    }
  },
  306: {
    id: 306,
    name: {
      zh: '前进吧我的盟友',
      'zh-TW': '前進吧我的盟友',
      en: 'Forward, My Allies!',
      ja: '進め、我が盟友よ',
      ko: '전진하라, 나의 맹우여'
    },
    type: "skillTypes.active",
    category: "skillCategories.support",
    targetType: "allOtherAllies",
    effects: [
      { type: "buff", stat: "spd", value: 1.3, duration: 3 } // Haste
    ],
    icon: "icon_forward_allies",
    cost: "30 MP",
    subText: {
      zh: '盟友全体加速',
      'zh-TW': '盟友全體加速',
      en: 'Ally Speed Up',
      ja: '味方全体速度上昇',
      ko: '아군 전체 속도 증가'
    },
    description: {
      zh: '激励除自己以外的所有队友，提升他们的行动速度。',
      'zh-TW': '激勵除自己以外的所有隊友，提升他們的行動速度。',
      en: 'Inspires all allies except self, increasing their action speed.',
      ja: '自分以外の味方全員を鼓舞し、行動速度を上昇させる。',
      ko: '자신을 제외한 모든 아군을 격려하여 행동 속도를 증가시킨다.'
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
