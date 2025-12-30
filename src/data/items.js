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
    name: "Potion",
    type: "Consumable",
    icon: "🧪",
    subText: "Restores 50 HP",
    footerLeft: "Restores HP",
    description: "A basic medicinal brew made from herbs. Restores a small amount of health. Essential for any adventurer."
  },
  1002: {
    id: 1002,
    name: "High Potion",
    type: "Consumable",
    icon: "🧪",
    subText: "Restores 150 HP",
    footerLeft: "Restores HP++",
    description: "A potent medicinal brew. Restores a moderate amount of health."
  },
  1003: {
    id: 1003,
    name: "Ether",
    type: "Consumable",
    icon: "🧪",
    subText: "Restores 20 MP",
    footerLeft: "Restores MP",
    description: "A magical liquid that restores mental energy. Slightly bitter taste."
  },
  1004: {
    id: 1004,
    name: "Antidote",
    type: "Consumable",
    icon: "🌱",
    subText: "Cures Poison",
    footerLeft: "Cures Poison",
    description: "An herbal antidote used to treat poison. Works instantly."
  },
  1005: {
    id: 1005,
    name: "Tent",
    type: "Consumable",
    icon: "⛺",
    subText: "Full Party Restore",
    footerLeft: "Full Rest",
    description: "A portable shelter. Allows the entire party to rest and fully recover HP and MP at save points."
  },
  1006: {
    id: 1006,
    name: "Phoenix Down",
    type: "Consumable",
    icon: "🪶",
    subText: "Revive",
    footerLeft: "Revive Ally",
    description: "Tail feather of a legendary bird. Revives a KO'd ally with small amount of HP."
  },

  // Weapons (2000-2999)
  2001: {
    id: 2001,
    name: "Iron Sword",
    type: "Weapon",
    icon: "⚔️",
    subText: "ATK +15",
    footerLeft: "Basic Sword",
    description: "A standard issue iron sword. Reliable and sturdy."
  },
  2002: {
    id: 2002,
    name: "Steel Saber",
    type: "Weapon",
    icon: "🗡️",
    subText: "ATK +35",
    footerLeft: "Sharp Edge",
    description: "A sharp blade forged from steel. Cuts through light armor with ease."
  },
  2003: {
    id: 2003,
    name: "Mythril Dagger",
    type: "Weapon",
    icon: "🗡️",
    subText: "ATK +25, SPD +5",
    footerLeft: "Lightweight",
    description: "A beautifully crafted dagger made of Mythril. Very light and easy to handle."
  },
  2004: {
    id: 2004,
    name: "Wooden Staff",
    type: "Weapon",
    icon: "🦯",
    subText: "MAG +10",
    footerLeft: "Mage Tool",
    description: "A simple staff carved from oak. Channels magical energy slightly."
  },

  // Armor (3000-3999)
  3001: {
    id: 3001,
    name: "Leather Vest",
    type: "Armor",
    icon: "👕",
    subText: "DEF +10",
    footerLeft: "Light Armor",
    description: "A vest made of tanned leather. Offers basic protection."
  },
  3002: {
    id: 3002,
    name: "Chainmail",
    type: "Armor",
    icon: "🛡️",
    subText: "DEF +25",
    footerLeft: "Medium Armor",
    description: "Armor made of interlocking metal rings. Good protection against slashing attacks."
  },
  3003: {
    id: 3003,
    name: "Silk Robe",
    type: "Armor",
    icon: "👘",
    subText: "DEF +5, MAG +15",
    footerLeft: "Mage Armor",
    description: "A robe woven from enchanted silk. Boosts magical power but offers little physical protection."
  },

  // Accessories (4000-4999)
  4001: {
    id: 4001,
    name: "Power Ring",
    type: "Accessory",
    icon: "💍",
    subText: "STR +5",
    footerLeft: "Strength",
    description: "A ring set with a red gemstone. The wearer feels a surge of strength."
  },
  4002: {
    id: 4002,
    name: "Protect Ring",
    type: "Accessory",
    icon: "💍",
    subText: "DEF +5",
    footerLeft: "Defense",
    description: "A ring set with a blue gemstone. It emits a faint protective aura."
  },

  // Key Items (9000-9999)
  9001: {
    id: 9001,
    name: "World Map",
    type: "Key Item",
    icon: "🗺️",
    subText: "Dahna Region",
    footerLeft: "Navigation",
    description: "A detailed map of the known world. Essential for travel."
  },
  9002: {
    id: 9002,
    name: "Rusty Key",
    type: "Key Item",
    icon: "🗝️",
    subText: "Old Iron Key",
    footerLeft: "Unlocks Door",
    description: "An old, rusty key found in the ruins. It might open a nearby door."
  }
};
