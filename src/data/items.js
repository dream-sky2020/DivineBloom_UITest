// src/data/items.js

/**
 * 静态物品数据库
 * ID 规则: 
 * 1000-1999: 消耗品 (Consumables)
 * 2000-2999: 武器 (Weapons)
 * 3000-3999: 防具 (Armor)
 * 4000-4999: 饰品 (Accessories)
 * 9000-9999: 关键道具 (Key Items)
 */
export const itemsDb = {
  // Consumables (1000-1999)
  1001: {
    id: 1001,
    name: {
      zh: '回复药水',
      'zh-TW': '回復藥水',
      en: 'Potion',
      ja: 'ポーション',
      ko: '포션'
    },
    type: "itemTypes.consumable",
    targetType: "ally",
    effects: [
      { type: "heal", value: 50 }
    ],
    icon: "icon_potion",
    subText: {
      zh: 'HP +50',
      'zh-TW': 'HP +50',
      en: 'HP +50',
      ja: 'HP +50',
      ko: 'HP +50'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '恢复少量生命值的药水。',
      'zh-TW': '恢復少量生命值的藥水。',
      en: 'Restores a small amount of HP.',
      ja: 'HPを少量回復する薬。',
      ko: 'HP를 소량 회복하는 물약.'
    }
  },
  1002: {
    id: 1002,
    name: {
      zh: '高级回复药水',
      'zh-TW': '高級回復藥水',
      en: 'Hi-Potion',
      ja: 'ハイポーション',
      ko: '하이 포션'
    },
    type: "itemTypes.consumable",
    targetType: "ally",
    effects: [
      { type: "heal", value: 200 }
    ],
    icon: "icon_potion",
    subText: {
      zh: 'HP +200',
      'zh-TW': 'HP +200',
      en: 'HP +200',
      ja: 'HP +200',
      ko: 'HP +200'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '恢复中量生命值的药水。',
      'zh-TW': '恢復中量生命值的藥水。',
      en: 'Restores a moderate amount of HP.',
      ja: 'HPを中量回復する薬。',
      ko: 'HP를 중량 회복하는 물약.'
    }
  },
  1003: {
    id: 1003,
    name: {
      zh: '魔法药水',
      'zh-TW': '魔法藥水',
      en: 'Ether',
      ja: 'エーテル',
      ko: '에테르'
    },
    type: "itemTypes.consumable",
    targetType: "ally",
    effects: [
      { type: "recoverMp", value: 50 }
    ],
    icon: "icon_potion",
    subText: {
      zh: 'MP +50',
      'zh-TW': 'MP +50',
      en: 'MP +50',
      ja: 'MP +50',
      ko: 'MP +50'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '恢复少量魔法值的药水。',
      'zh-TW': '恢復少量魔法值的藥水。',
      en: 'Restores a small amount of MP.',
      ja: 'MPを少量回復する薬。',
      ko: 'MP를 소량 회복하는 물약.'
    }
  },
  1004: {
    id: 1004,
    name: {
      zh: '解毒草',
      'zh-TW': '解毒草',
      en: 'Antidote',
      ja: '毒消し草',
      ko: '해독초'
    },
    type: "itemTypes.consumable",
    targetType: "ally",
    effects: [
      { type: "cureStatus", status: "poison" }
    ],
    icon: "icon_herb",
    subText: {
      zh: '治疗中毒',
      'zh-TW': '治療中毒',
      en: 'Cures Poison',
      ja: '毒を治す',
      ko: '독 치료'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '用于解除中毒状态的草药。',
      'zh-TW': '用於解除中毒狀態的草藥。',
      en: 'An herb used to cure poison.',
      ja: '毒状態を解除する草。',
      ko: '중독 상태를 해제하는 약초.'
    }
  },
  1005: {
    id: 1005,
    name: {
      zh: '野营帐篷',
      'zh-TW': '野營帳篷',
      en: 'Tent',
      ja: 'テント',
      ko: '텐트'
    },
    type: "itemTypes.consumable",
    targetType: "allAllies",
    effects: [
      { type: "fullRestore" }
    ],
    icon: "icon_tent",
    subText: {
      zh: '完全恢复',
      'zh-TW': '完全恢復',
      en: 'Full Recovery',
      ja: '全回復',
      ko: '완전 회복'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '在存档点使用，完全恢复队伍状态。',
      'zh-TW': '在存檔點使用，完全恢復隊伍狀態。',
      en: 'Use at save points to fully recover party.',
      ja: 'セーブポイントで使用し、パーティを全回復する。',
      ko: '세이브 포인트에서 사용하여 파티를 완전히 회복한다.'
    }
  },
  1006: {
    id: 1006,
    name: {
      zh: '凤凰之羽',
      'zh-TW': '鳳凰之羽',
      en: 'Phoenix Down',
      ja: 'フェニックスの尾',
      ko: '피닉스의 깃털'
    },
    type: "itemTypes.consumable",
    targetType: "deadAlly",
    effects: [
      { type: "revive", value: 0.2 }
    ],
    icon: "icon_feather",
    subText: {
      zh: '复活',
      'zh-TW': '復活',
      en: 'Revive',
      ja: '蘇生',
      ko: '부활'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '复活一名无法战斗的队友。',
      'zh-TW': '復活一名無法戰鬥的隊友。',
      en: 'Revives a KO\'d ally.',
      ja: '戦闘不能の仲間を蘇生する。',
      ko: '전투 불능이 된 동료를 부활시킨다.'
    }
  },
  1007: {
    id: 1007,
    name: {
      zh: '火焰炸弹',
      'zh-TW': '火焰炸彈',
      en: 'Fire Bomb',
      ja: 'ファイアボム',
      ko: '화염 폭탄'
    },
    type: "itemTypes.consumable",
    targetType: "enemy",
    effects: [
      { type: "damage", element: "fire", value: 300 }
    ],
    icon: "icon_bomb",
    subText: {
      zh: '火焰伤害',
      'zh-TW': '火焰傷害',
      en: 'Fire Dmg',
      ja: '炎ダメージ',
      ko: '화염 피해'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '对一名敌人造成固定的火焰伤害。',
      'zh-TW': '對一名敵人造成固定的火焰傷害。',
      en: 'Deals fixed fire damage to one enemy.',
      ja: '敵単体に固定の炎ダメージを与える。',
      ko: '적 한 명에게 고정 화염 피해를 준다.'
    }
  },

  1008: {
    id: 1008,
    name: {
      zh: '凤凰之尾·群',
      'zh-TW': '鳳凰之尾·群',
      en: 'Phoenix Down All',
      ja: 'フェニックスの尾・全',
      ko: '피닉스의 깃털·전'
    },
    type: "itemTypes.consumable",
    targetType: "allDeadAllies",
    effects: [
      { type: "revive", value: 0.5 }
    ],
    icon: "icon_feather_all",
    subText: {
      zh: '群体复活',
      'zh-TW': '群體復活',
      en: 'Mass Revive',
      ja: '全体蘇生',
      ko: '전체 부활'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '复活所有无法战斗的队友。',
      'zh-TW': '復活所有無法戰鬥的隊友。',
      en: 'Revives all KO\'d allies.',
      ja: '戦闘不能の仲間全員を蘇生する。',
      ko: '전투 불능이 된 동료 전원을 부활시킨다.'
    }
  },
  1009: {
    id: 1009,
    name: {
      zh: '大范围喷溅治疗药水',
      'zh-TW': '大範圍噴濺治療藥水',
      en: 'Splashing Healing Potion',
      ja: 'スプラッシュポーション',
      ko: '스플래시 포션'
    },
    type: "itemTypes.consumable",
    targetType: "allAllies",
    effects: [
      { type: "heal_all", value: 300 }
    ],
    icon: "icon_potion_splash",
    subText: {
      zh: '群体回复',
      'zh-TW': '群體回復',
      en: 'Mass Heal',
      ja: '全体回復',
      ko: '전체 회복'
    },
    footerLeft: "itemTypes.consumable",
    description: {
      zh: '恢复所有队友的生命值。',
      'zh-TW': '恢復所有隊友的生命值。',
      en: 'Restores HP to all allies.',
      ja: '味方全員のHPを回復する。',
      ko: '아군 전원의 HP를 회복시킨다.'
    }
  },

  // Weapons (2000-2999)
  2001: {
    id: 2001,
    name: {
      zh: '铁剑',
      'zh-TW': '鐵劍',
      en: 'Iron Sword',
      ja: '鉄の剣',
      ko: '철검'
    },
    type: "itemTypes.weapon",
    icon: "icon_sword",
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
  2002: {
    id: 2002,
    name: {
      zh: '秘银匕首',
      'zh-TW': '秘銀匕首',
      en: 'Mythril Dagger',
      ja: 'ミスリルダガー',
      ko: '미스릴 단검'
    },
    type: "itemTypes.weapon",
    icon: "icon_dagger",
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
  2003: {
    id: 2003,
    name: {
      zh: '勇者之剑',
      'zh-TW': '勇者之劍',
      en: 'Hero Sword',
      ja: '勇者の剣',
      ko: '용사의 검'
    },
    type: "itemTypes.weapon",
    icon: "icon_dagger",
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
  2004: {
    id: 2004,
    name: {
      zh: '古木法杖',
      'zh-TW': '古木法杖',
      en: 'Elder Staff',
      ja: '古木の杖',
      ko: '고목의 지팡이'
    },
    type: "itemTypes.weapon",
    icon: "icon_staff",
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

  // Armor (3000-3999)
  3001: {
    id: 3001,
    name: {
      zh: '皮甲',
      'zh-TW': '皮甲',
      en: 'Leather Armor',
      ja: '皮の鎧',
      ko: '가죽 갑옷'
    },
    type: "itemTypes.armor",
    icon: "icon_armor",
    subText: {
      zh: 'DEF +5',
      'zh-TW': 'DEF +5',
      en: 'DEF +5',
      ja: '防御 +5',
      ko: '방어 +5'
    },
    footerLeft: "itemTypes.armor",
    description: {
      zh: '基础的防护装备，便于行动。',
      'zh-TW': '基礎的防護裝備，便於行動。',
      en: 'Basic protective gear that allows easy movement.',
      ja: '動きやすい基本的な防具。',
      ko: '움직이기 편한 기초적인 방어구.'
    }
  },
  3002: {
    id: 3002,
    name: {
      zh: '铁盾',
      'zh-TW': '鐵盾',
      en: 'Iron Shield',
      ja: '鉄の盾',
      ko: '철방패'
    },
    type: "itemTypes.armor",
    icon: "icon_shield",
    subText: {
      zh: 'DEF +8',
      'zh-TW': 'DEF +8',
      en: 'DEF +8',
      ja: '防御 +8',
      ko: '방어 +8'
    },
    footerLeft: "itemTypes.armor",
    description: {
      zh: '坚固的铁制盾牌。',
      'zh-TW': '堅固的鐵製盾牌。',
      en: 'A sturdy iron shield.',
      ja: '頑丈な鉄の盾。',
      ko: '튼튼한 철제 방패.'
    }
  },
  3003: {
    id: 3003,
    name: {
      zh: '丝绸法袍',
      'zh-TW': '絲綢法袍',
      en: 'Silk Robe',
      ja: 'シルクのローブ',
      ko: '실크 로브'
    },
    type: "itemTypes.armor",
    icon: "icon_robe",
    subText: {
      zh: 'MDEF +10',
      'zh-TW': 'MDEF +10',
      en: 'MDEF +10',
      ja: '魔防 +10',
      ko: '마방 +10'
    },
    footerLeft: "itemTypes.armor",
    description: {
      zh: '能够抵御魔法攻击的长袍。',
      'zh-TW': '能夠抵禦魔法攻擊的長袍。',
      en: 'A robe that offers protection against magic.',
      ja: '魔法攻撃を防ぐローブ。',
      ko: '마법 공격을 막아주는 로브.'
    }
  },

  // Accessories (4000-4999)
  4001: {
    id: 4001,
    name: {
      zh: '力量戒指',
      'zh-TW': '力量戒指',
      en: 'Power Ring',
      ja: 'パワーリング',
      ko: '파워 링'
    },
    type: "itemTypes.accessory",
    icon: "icon_ring",
    subText: {
      zh: 'STR +5',
      'zh-TW': 'STR +5',
      en: 'STR +5',
      ja: '力 +5',
      ko: '힘 +5'
    },
    footerLeft: "itemTypes.accessory",
    description: {
      zh: '增强佩戴者力量的魔法戒指。',
      'zh-TW': '增強佩戴者力量的魔法戒指。',
      en: 'A magic ring that increases the wearer\'s strength.',
      ja: '装備者の力を高める魔法の指輪。',
      ko: '착용자의 힘을 높여주는 마법의 반지.'
    }
  },
  4002: {
    id: 4002,
    name: {
      zh: '守护护符',
      'zh-TW': '守護護符',
      en: 'Protection Amulet',
      ja: '守りのアミュレット',
      ko: '수호의 부적'
    },
    type: "itemTypes.accessory",
    icon: "icon_ring",
    subText: {
      zh: 'DEF +5',
      'zh-TW': 'DEF +5',
      en: 'DEF +5',
      ja: '防御 +5',
      ko: '방어 +5'
    },
    footerLeft: "itemTypes.accessory",
    description: {
      zh: '祈求平安的护身符。',
      'zh-TW': '祈求平安的護身符。',
      en: 'An amulet prayed over for safety.',
      ja: '安全を祈願したお守り。',
      ko: '안전을 기원하는 부적.'
    }
  },

  // Key Items (9000-9999)
  9001: {
    id: 9001,
    name: {
      zh: '世界地图',
      'zh-TW': '世界地圖',
      en: 'World Map',
      ja: '世界地図',
      ko: '세계 지도'
    },
    type: "itemTypes.keyItem",
    icon: "icon_map",
    subText: {
      zh: '重要物品',
      'zh-TW': '重要物品',
      en: 'Key Item',
      ja: '重要アイテム',
      ko: '중요 아이템'
    },
    footerLeft: "itemTypes.keyItem",
    description: {
      zh: '描绘了整个世界地理的地图。',
      'zh-TW': '描繪了整個世界地理的地圖。',
      en: 'A map depicting the geography of the entire world.',
      ja: '全世界の地理を描いた地図。',
      ko: '전 세계의 지리가 그려진 지도.'
    }
  },
  9002: {
    id: 9002,
    name: {
      zh: '遗迹钥匙',
      'zh-TW': '遺跡鑰匙',
      en: 'Ruins Key',
      ja: '遺跡の鍵',
      ko: '유적의 열쇠'
    },
    type: "itemTypes.keyItem",
    icon: "icon_key",
    subText: {
      zh: '任务物品',
      'zh-TW': '任務物品',
      en: 'Quest Item',
      ja: 'クエストアイテム',
      ko: '퀘스트 아이템'
    },
    footerLeft: "itemTypes.keyItem",
    description: {
      zh: '开启古代遗迹大门的神秘钥匙。',
      'zh-TW': '開啟古代遺跡大門的神秘鑰匙。',
      en: 'A mysterious key that opens the gate to ancient ruins.',
      ja: '古代遺跡の扉を開く謎の鍵。',
      ko: '고대 유적의 문을 여는 신비한 열쇠.'
    }
  }
};
