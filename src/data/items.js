// src/data/items.js

/**
 * 静态物品数据库
 * ID 规则: 
 * 1000-1999: 消耗品 (Consumables)
 * 2000-2999: 武器 (Weapons)
 * 3000-3999: 防具 (Armor)
 * 9000-9999: 关键道具 (Key Items)
 */
export const itemsDb = {
  // Consumables
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

  // Weapons
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

  // Armor
  3001: {
    id: 3001,
    name: "Leather Vest",
    type: "Armor",
    icon: "👕",
    subText: "DEF +10",
    footerLeft: "Light Armor",
    description: "A vest made of tanned leather. Offers basic protection."
  },

  // Key Items
  9001: {
    id: 9001,
    name: "World Map",
    type: "Key Item",
    icon: "🗺️",
    subText: "Dahna Region",
    footerLeft: "Navigation",
    description: "A detailed map of the known world. Essential for travel."
  }
};

