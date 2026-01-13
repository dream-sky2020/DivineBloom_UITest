export default {
  // Boss Skills (1000+)
  // Emperor Shenwu (101)
  'skill_boss_thunder_strike': {
    id: 'skill_boss_thunder_strike',
    name: { zh: '雷霆轰击', 'zh-TW': '雷霆轟擊', en: 'Thunder Strike', ja: '落雷', ko: '뇌전' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.lightning",
    targetType: "single", // AI Logic overrides this usually, but good to have
    effects: [
      { type: "damage", value: 1.6, scaling: "mag", element: "elements.lightning", minOffset: -0.7 },
      { type: "applyStatus", status: 'status_paralysis', duration: 2, chance: 1.0 } // Paralysis
    ]
  },
  'skill_boss_blizzard': {
    id: 'skill_boss_blizzard',
    name: { zh: '极寒暴风雪', 'zh-TW': '極寒暴風雪', en: 'Blizzard', ja: 'ブリザード', ko: '눈보라' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.ice",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.3, scaling: "mag", element: "elements.ice", minOffset: -0.7 },
      { type: "applyStatus", status: 'status_freeze', duration: 1, chance: 0.3 }, // Freeze
      { type: "applyStatus", status: 'status_slow', duration: 3, chance: 0.1 }  // Slow
    ]
  },

  // Shahryar (102)
  'skill_boss_precision_stab': {
    id: 'skill_boss_precision_stab',
    name: { zh: '精准刺击', 'zh-TW': '精準刺擊', en: 'Precision Stab', ja: '精密突き', ko: '정밀 찌르기' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.5, scaling: "str", minOffset: -0.5 },
      { type: "applyStatus", status: 'status_bleed', chance: 0.3,duration: 3 } // Bleed
    ]
  },
  'skill_boss_full_moon_slash': {
    id: 'skill_boss_full_moon_slash',
    name: { zh: '圆月斩', 'zh-TW': '圓月斬', en: 'Full Moon Slash', ja: '円月斬り', ko: '원월참' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.0, scaling: "str", minOffset: -0.7 },
      { type: "applyStatus", status: 'status_bleed', chance: 0.3, duration: 3 } // Bleed
    ]
  },

  // Hefietian (103)
  'skill_boss_flaming_sword': {
    id: 'skill_boss_flaming_sword',
    name: { zh: '烈焰之剑', 'zh-TW': '烈焰之劍', en: 'Flaming Sword', ja: '烈火の剣', ko: '화염의 검' },
    type: "skillTypes.active",
    category: "skillCategories.physical", // Originally str scaling, likely physical with fire element visual
    element: "elements.fire",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.8, scaling: "str", element: "elements.fire", minOffset: -0.5 },
      { type: "applyStatus", status: 'status_burn', chance: 0.3, duration: 3 } // Burn
    ]
  },
  'skill_boss_prairie_fire': {
    id: 'skill_boss_prairie_fire',
    name: { zh: '燎原烈火', 'zh-TW': '燎原烈火', en: 'Prairie Fire', ja: '燎原の炎', ko: '요원의 불길' },
    type: "skillTypes.active",
    category: "skillCategories.magic",
    element: "elements.fire",
    targetType: "allEnemies",
    effects: [
      { type: "damage", value: 1.2, scaling: "mag", element: "elements.fire", minOffset: -0.7 },
      { type: "applyStatus", status: 'status_burn', chance: 0.3, duration: 3 } // Burn
    ]
  },

  // Monster Skills (201+)
  'skill_enemy_slime_shot': {
    id: 'skill_enemy_slime_shot',
    name: { zh: '粘液喷射', 'zh-TW': '粘液噴射', en: 'Slime Shot', ja: '粘液', ko: '점액 발사' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.1, scaling: "str", minOffset: -0.5 },
      { type: "applyStatus", status: 'status_slow', chance: 0.3, duration: 2 } // Slow
    ],
    icon: "icon_slime",
    cost: "0 MP"
  },
  'skill_enemy_vampiric_bite': {
    id: 'skill_enemy_vampiric_bite',
    name: { zh: '吸血撕咬', 'zh-TW': '吸血撕咬', en: 'Vampiric Bite', ja: '吸血', ko: '흡혈' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.2, scaling: "str", minOffset: -0.5 },
      { type: "heal", value: 0.5, scaling: "damage_dealt", target: "self", minOffset: -0.5 } 
      // Drain logic handled in effects? Or just simple heal
      // For now, let's just do damage + self heal separately if system doesn't support drain.
      // Assuming simple damage for now, or maybe add drain type later.
    ],
    // Let's stick to standard damage + bleed for now to be safe
    // effects: [ { type: "damage", value: 1.2, scaling: "str" }, { type: "applyStatus", status: 5, chance: 0.3 } ]
    icon: "icon_fang",
    cost: "5 MP"
  },
  'skill_enemy_pack_bite': {
    id: 'skill_enemy_pack_bite',
    name: { zh: '群狼撕咬', 'zh-TW': '群狼撕咬', en: 'Pack Bite', ja: '群れの牙', ko: '늑대 무리' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.3, scaling: "str", minOffset: -0.5 },
      { type: "applyStatus", status: 'status_bleed', chance: 0.4, duration: 2 } // Bleed
    ],
    icon: "icon_claw",
    cost: "0 MP"
  },
  'skill_enemy_shield_bash': {
    id: 'skill_enemy_shield_bash',
    name: { zh: '盾牌猛击', 'zh-TW': '盾牌猛擊', en: 'Shield Bash', ja: 'シールドバッシュ', ko: '방패 강타' },
    type: "skillTypes.active",
    category: "skillCategories.physical",
    targetType: "single",
    effects: [
      { type: "damage", value: 1.0, scaling: "def", minOffset: -0.5 }, // Scales with Def
      { type: "applyStatus", status: 'status_freeze', chance: 0.3, duration: 1 } // Freeze (used as Stun)
    ],
    icon: "icon_shield_bash",
    cost: "10 MP"
  }
}
