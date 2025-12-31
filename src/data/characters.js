// src/data/characters.js

/**
 * 角色数据库 (Characters)
 * 记录角色初始状态和基本信息
 */
export const charactersDb = {
  1: {
    id: 1,
    name: {
      zh: '烈焰剑士',
      'zh-TW': '烈焰劍士',
      en: 'Flame Swordsman',
      ja: 'フレイムソードマン',
      ko: '플레임 소드맨'
    },
    role: "roles.swordsman",
    element: "elements.fire",
    weaponType: "weapons.sword",
    initialStats: {
      hp: 500,
      mp: 50,
      str: 18,
      def: 12,
      mag: 8,
      spd: 10
    },
    description: {
      zh: '擅长使用火焰剑技的战士。',
      'zh-TW': '擅長使用火焰劍技的戰士。',
      en: 'A warrior skilled in flame sword techniques.',
      ja: '炎の剣技を得意とする戦士。',
      ko: '화염 검 기술에 능숙한 전사.'
    }
  },
  2: {
    id: 2,
    name: {
      zh: '烈火枪手',
      'zh-TW': '烈火槍手',
      en: 'Blaze Gunner',
      ja: 'ブレイズガンナー',
      ko: '블레이즈 거너'
    },
    role: "roles.gunner",
    element: "elements.fire", // Also uses astral energy
    weaponType: "weapons.rifle",
    initialStats: {
      hp: 380,
      mp: 120,
      str: 14,
      def: 10,
      mag: 20,
      spd: 14
    },
    description: {
      zh: '拥有爆炸性火力的远程攻击者。',
      'zh-TW': '擁有爆炸性火力的遠程攻擊者。',
      en: 'A long-range attacker with explosive power.',
      ja: '爆発的な火力を持つ遠距離攻撃者。',
      ko: '폭발적인 화력을 가진 원거리 공격자.'
    }
  },
  3: {
    id: 3,
    name: {
      zh: '风暴贤者',
      'zh-TW': '風暴賢者',
      en: 'Tempest Mage',
      ja: 'テンペストメイジ',
      ko: '템페스트 메이지'
    },
    role: "roles.mage",
    element: "elements.windLight",
    weaponType: "weapons.book",
    initialStats: {
      hp: 300,
      mp: 200,
      str: 6,
      def: 8,
      mag: 25,
      spd: 12
    },
    description: {
      zh: '精通风与光属性魔法的大师。',
      'zh-TW': '精通風與光屬性魔法的大師。',
      en: 'A master of wind and light magic.',
      ja: '風と光の魔法を極めた達人。',
      ko: '바람과 빛의 마법을 마스터한 현자.'
    }
  },
  4: {
    id: 4,
    name: {
      zh: '圣光斗士',
      'zh-TW': '聖光鬥士',
      en: 'Holy Brawler',
      ja: 'ホーリーブローラー',
      ko: '홀리 브롤러'
    },
    role: "roles.brawler",
    element: "elements.light",
    weaponType: "weapons.gauntlets",
    initialStats: {
      hp: 550,
      mp: 60,
      str: 22,
      def: 10,
      mag: 5,
      spd: 18
    },
    description: {
      zh: '受到光之祝福的近战格斗家。',
      'zh-TW': '受到光之祝福的近戰格鬥家。',
      en: 'A melee fighter blessed by light.',
      ja: '光の加護を受けた近接格闘家。',
      ko: '빛의 축복을 받은 근접 격투가.'
    }
  }
};
