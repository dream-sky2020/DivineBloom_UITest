// src/data/status.js

/**
 * 状态效果数据库 (Buffs/Debuffs)
 * ID 规则:
 * 1-99: 异常状态 (Debuffs)
 * 100-199: 增益状态 (Buffs)
 */
export const statusDb = {
  // Debuffs
  1: {
    id: 1,
    name: "Poison",
    type: "Debuff",
    icon: "☠️",
    subText: "DoT",
    description: "Takes damage at the start of each turn. Persists after battle."
  },
  2: {
    id: 2,
    name: "Burn",
    type: "Debuff",
    icon: "🔥",
    subText: "DoT",
    description: "Takes Fire damage each turn. Lowers Attack power."
  },
  3: {
    id: 3,
    name: "Freeze",
    type: "Debuff",
    icon: "🧊",
    subText: "Stun",
    description: "Cannot act. Taking Physical damage will shatter the ice and deal double damage."
  },
  4: {
    id: 4,
    name: "Paralysis",
    type: "Debuff",
    icon: "⚡",
    subText: "Chance Stun",
    description: "25% chance to be unable to act each turn."
  },

  // Buffs
  101: {
    id: 101,
    name: "Regen",
    type: "Buff",
    icon: "✨",
    subText: "Heal",
    description: "Restores a small amount of HP at the start of each turn."
  },
  102: {
    id: 102,
    name: "Attack Up",
    type: "Buff",
    icon: "⚔️",
    subText: "ATK +",
    description: "Increases Physical Attack power."
  },
  103: {
    id: 103,
    name: "Haste",
    type: "Buff",
    icon: "⏩",
    subText: "SPD +",
    description: "Increases Speed, allowing turns to come around faster."
  }
};

