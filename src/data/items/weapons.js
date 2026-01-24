export default {
  item_weapon_iron_sword: {
    id: "item_weapon_iron_sword",
    name: {
      zh: '铁剑',
      'zh-TW': '鐵劍',
      en: 'Iron Sword',
      ja: '鉄の剣',
      ko: '철검'
    },
    type: "itemTypes.weapon",
    icon: "icon_sword",
    tags: ['item_weapon', 'rarity_common', 'status_phys_attr'],
    subText: {
      zh: 'ATK +10',
      'zh-TW': 'ATK +10',
      en: 'ATK +10',
      ja: '攻撃力 +10',
      ko: '공격력 +10'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: '普通的铁制长剑，适合新手使用。',
      'zh-TW': '普通的鐵製長劍，適合新手使用。',
      en: 'A standard iron sword, good for beginners.',
      ja: '初心者に適した普通の鉄の剣。',
      ko: '초보자에게 적합한 평범한 철검.'
    }
  },
  item_weapon_mythril_dagger: {
    id: "item_weapon_mythril_dagger",
    name: {
      zh: '秘银匕首',
      'zh-TW': '秘銀匕首',
      en: 'Mythril Dagger',
      ja: 'ミスリルダガー',
      ko: '미스릴 단검'
    },
    type: "itemTypes.weapon",
    icon: "icon_dagger",
    tags: ['item_weapon', 'rarity_rare', 'status_phys_attr', 'status_movement'],
    subText: {
      zh: 'ATK +8, SPD +5',
      'zh-TW': 'ATK +8, SPD +5',
      en: 'ATK +8, SPD +5',
      ja: '攻撃 +8, 速度 +5',
      ko: '공격 +8, 속도 +5'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: '用轻盈的秘银打造的匕首。',
      'zh-TW': '用輕盈的秘銀打造的匕首。',
      en: 'A dagger forged from lightweight mythril.',
      ja: '軽量なミスリルで作られた短剣。',
      ko: '가벼운 미스릴로 만들어진 단검.'
    }
  },
  item_weapon_hero_sword: {
    id: "item_weapon_hero_sword",
    name: {
      zh: '勇者之剑',
      'zh-TW': '勇者之劍',
      en: 'Hero Sword',
      ja: '勇者の剑',
      ko: '용사의 검'
    },
    type: "itemTypes.weapon",
    icon: "icon_dagger",
    tags: ['item_weapon', 'rarity_legendary', 'element_light', 'status_phys_attr'],
    subText: {
      zh: 'ATK +50',
      'zh-TW': 'ATK +50',
      en: 'ATK +50',
      ja: '攻撃力 +50',
      ko: '공격력 +50'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: '传说中勇者使用的圣剑。',
      'zh-TW': '傳說中勇者使用的聖劍。',
      en: 'A holy sword used by a legendary hero.',
      ja: '伝説の勇者が使用した聖剣。',
      ko: '전설의 용사가 사용했던 성검.'
    }
  },
  item_weapon_elder_staff: {
    id: "item_weapon_elder_staff",
    name: {
      zh: '古木法杖',
      'zh-TW': '古木法杖',
      en: 'Elder Staff',
      ja: '古木の杖',
      ko: '고목의 지팡이'
    },
    type: "itemTypes.weapon",
    icon: "icon_staff",
    tags: ['item_weapon', 'rarity_rare', 'element_wood', 'status_elemental'],
    subText: {
      zh: 'MATK +15',
      'zh-TW': 'MATK +15',
      en: 'MATK +15',
      ja: '魔攻 +15',
      ko: '마공 +15'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: '蕴含着自然魔力的古老法杖。',
      'zh-TW': '蘊含著自然魔力的古老法杖。',
      en: 'An ancient staff imbued with nature magic.',
      ja: '自然の魔力を宿した古い杖。',
      ko: '자연의 마력을 품은 오래된 지팡이.'
    }
  },

  // --- G1L0 Series (2100-2199) ---
  item_weapon_g1l0_sniper: {
    id: "item_weapon_g1l0_sniper",
    name: {
      zh: 'G1L0 狙击枪',
      'zh-TW': 'G1L0 狙擊槍',
      en: 'G1L0 Sniper Rifle',
      ja: 'G1L0 スナイパーライフル',
      ko: 'G1L0 스나이퍼 라이플'
    },
    type: "itemTypes.weapon",
    icon: "icon_sniper",
    tags: ['item_weapon', 'rarity_epic', 'status_phys_attr'],
    subText: {
      zh: 'ATK +80, 暴击率 +20%',
      'zh-TW': 'ATK +80, 暴擊率 +20%',
      en: 'ATK +80, Crit +20%',
      ja: '攻撃 +80, 会心 +20%',
      ko: '공격 +80, 치명 +20%'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: 'G1L0系列的高精度狙击步枪，能在极远距离消灭目标。',
      'zh-TW': 'G1L0系列的高精度狙擊步槍，能在極遠距離消滅目標。',
      en: 'G1L0 series high-precision sniper rifle, capable of eliminating targets from extreme distances.',
      ja: 'G1L0シリーズの高精度スナイパーライフル。極遠距離から標的を排除できる。',
      ko: 'G1L0 시리즈의 고정밀 스나이퍼 라이플, 초장거리에서 목표를 제거할 수 있다.'
    }
  },
  item_weapon_g1l0_machine_gun: {
    id: "item_weapon_g1l0_machine_gun",
    name: {
      zh: 'G1L0 机关枪',
      'zh-TW': 'G1L0 機關槍',
      en: 'G1L0 Machine Gun',
      ja: 'G1L0 マシンガン',
      ko: 'G1L0 머신건'
    },
    type: "itemTypes.weapon",
    icon: "icon_machinegun",
    tags: ['item_weapon', 'rarity_epic', 'status_phys_attr'],
    subText: {
      zh: 'ATK +60, 射速 ++',
      'zh-TW': 'ATK +60, 射速 ++',
      en: 'ATK +60, Fire Rate ++',
      ja: '攻撃 +60, 連射 ++',
      ko: '공격 +60, 연사 ++'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: 'G1L0系列的重型机关枪，提供持续的火力压制。',
      'zh-TW': 'G1L0系列的重型機關槍，提供持續的火力壓制。',
      en: 'G1L0 series heavy machine gun, providing sustained suppressive fire.',
      ja: 'G1L0シリーズの重機関銃。持続的な制圧射撃を提供する。',
      ko: 'G1L0 시리즈의 중기관총, 지속적인 화력 제압을 제공한다.'
    }
  },
  item_weapon_g1l0_pistol: {
    id: "item_weapon_g1l0_pistol",
    name: {
      zh: 'G1L0 手枪',
      'zh-TW': 'G1L0 手槍',
      en: 'G1L0 Pistol',
      ja: 'G1L0 ピストル',
      ko: 'G1L0 피스톨'
    },
    type: "itemTypes.weapon",
    icon: "icon_pistol",
    tags: ['item_weapon', 'rarity_epic', 'status_phys_attr', 'status_movement'],
    subText: {
      zh: 'ATK +30, SPD +10',
      'zh-TW': 'ATK +30, SPD +10',
      en: 'ATK +30, SPD +10',
      ja: '攻撃 +30, 速度 +10',
      ko: '공격 +30, 속도 +10'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: 'G1L0系列的战术手枪，轻便且可靠。',
      'zh-TW': 'G1L0系列的戰術手槍，輕便且可靠。',
      en: 'G1L0 series tactical pistol, lightweight and reliable.',
      ja: 'G1L0シリーズの戦術ピストル。軽量で信頼性が高い。',
      ko: 'G1L0 시리즈의 전술 권총, 가볍고 신뢰할 수 있다.'
    }
  },
  item_weapon_g1l0_shotgun: {
    id: "item_weapon_g1l0_shotgun",
    name: {
      zh: 'G1L0 霰弹枪',
      'zh-TW': 'G1L0 霰彈槍',
      en: 'G1L0 Shotgun',
      ja: 'G1L0 ショットガン',
      ko: 'G1L0 샷건'
    },
    type: "itemTypes.weapon",
    icon: "icon_shotgun",
    tags: ['item_weapon', 'rarity_epic', 'status_phys_attr'],
    subText: {
      zh: 'ATK +90, 范围攻击',
      'zh-TW': 'ATK +90, 範圍攻擊',
      en: 'ATK +90, AoE',
      ja: '攻撃 +90, 範囲攻撃',
      ko: '공격 +90, 범위 공격'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: 'G1L0系列的近战霰弹枪，具有极强的破坏力。',
      'zh-TW': 'G1L0系列的近戰霰彈槍，具有極強的破壞力。',
      en: 'G1L0 series close-quarters shotgun with devastating power.',
      ja: 'G1L0シリーズの近接用ショットガン。極めて強力な破壊力を持つ。',
      ko: 'G1L0 시리즈의 근접 산탄총, 강력한 파괴력을 지녔다.'
    }
  },
  item_weapon_g1l0_smg: {
    id: "item_weapon_g1l0_smg",
    name: {
      zh: 'G1L0 冲锋枪',
      'zh-TW': 'G1L0 衝鋒槍',
      en: 'G1L0 SMG',
      ja: 'G1L0 サブマシンガン',
      ko: 'G1L0 기관단총'
    },
    type: "itemTypes.weapon",
    icon: "icon_smg",
    tags: ['item_weapon', 'rarity_epic', 'status_phys_attr'],
    subText: {
      zh: 'ATK +45, 连击',
      'zh-TW': 'ATK +45, 連擊',
      en: 'ATK +45, Multi-hit',
      ja: '攻撃 +45, 連撃',
      ko: '공격 +45, 연타'
    },
    footerLeft: "itemTypes.weapon",
    description: {
      zh: 'G1L0系列的高速冲锋枪，适合快速突击。',
      'zh-TW': 'G1L0系列的高速衝鋒槍，適合快速突擊。',
      en: 'G1L0 series high-speed SMG, suitable for rapid assaults.',
      ja: 'G1L0シリーズの高速サブマシンガン。迅速な突撃に適している。',
      ko: 'G1L0 시리즈의 고속 기관단총, 빠른 돌격에 적합하다.'
    }
  }
}

