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
    name: "Slash",
    type: "Active",
    category: "Physical",
    icon: "⚔️",
    cost: "5 MP",
    subText: "Basic Attack",
    description: "A swift slash with a weapon. Deals 100% Physical Damage to a single enemy."
  },
  102: {
    id: 102,
    name: "Power Strike",
    type: "Active",
    category: "Physical",
    icon: "💥",
    cost: "15 MP",
    subText: "Heavy Damage",
    description: "A powerful charged attack. Deals 200% Physical Damage but has a chance to miss."
  },

  // Magic Skills
  201: {
    id: 201,
    name: "Fireball",
    type: "Active",
    category: "Magic",
    element: "Fire",
    icon: "🔥",
    cost: "10 MP",
    subText: "Fire Dmg",
    description: "Hurls a ball of fire at an enemy. Inflicts Fire Damage and may cause Burn."
  },
  202: {
    id: 202,
    name: "Ice Shard",
    type: "Active",
    category: "Magic",
    element: "Ice",
    icon: "❄️",
    cost: "12 MP",
    subText: "Ice Dmg",
    description: "Shoots sharp icicles. Deals Ice Damage and lowers target Speed."
  },
  203: {
    id: 203,
    name: "Thunder",
    type: "Active",
    category: "Magic",
    element: "Lightning",
    icon: "⚡",
    cost: "25 MP",
    subText: "AoE Lightning",
    description: "Calls down lightning to strike all enemies. Moderate Lightning Damage."
  },

  // Support Skills
  301: {
    id: 301,
    name: "Heal",
    type: "Active",
    category: "Support",
    icon: "💚",
    cost: "20 MP",
    subText: "Restore HP",
    description: "Restores a moderate amount of HP to a single ally."
  },
  302: {
    id: 302,
    name: "Protect",
    type: "Active",
    category: "Support",
    icon: "🛡️",
    cost: "30 MP",
    subText: "Buff DEF",
    description: "Increases an ally's Physical Defense for 3 turns."
  },

  // Passive Skills
  401: {
    id: 401,
    name: "Iron Skin",
    type: "Passive",
    category: "Passive",
    icon: "🦾",
    cost: "--",
    subText: "DEF Up",
    description: "Permanently increases Physical Defense by 10%."
  },
  402: {
    id: 402,
    name: "Mana Flow",
    type: "Passive",
    category: "Passive",
    icon: "💧",
    cost: "--",
    subText: "MP Regen",
    description: "Regenerates 5% of Max MP at the end of each turn."
  }
};

