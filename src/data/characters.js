// src/data/characters.js

/**
 * 角色数据库 (Characters)
 * 记录角色初始状态和基本信息
 */
export const charactersDb = {
  1: {
    id: 1,
    name: "Alphen",
    role: "Swordsman",
    element: "Fire",
    weaponType: "Sword",
    initialStats: {
      hp: 500,
      mp: 50,
      str: 18,
      def: 12,
      mag: 8,
      spd: 10
    },
    description: "A mysterious swordsman who has lost his memories and ability to feel pain. Wields a blazing sword."
  },
  2: {
    id: 2,
    name: "Shionne",
    role: "Gunner",
    element: "Fire", // Also uses astral energy
    weaponType: "Rifle",
    initialStats: {
      hp: 380,
      mp: 120,
      str: 14,
      def: 10,
      mag: 20,
      spd: 14
    },
    description: "A woman afflicted with 'Thorns' that cause pain to anyone she touches. An excellent marksman and healer."
  },
  3: {
    id: 3,
    name: "Rinwell",
    role: "Mage",
    element: "Wind/Light",
    weaponType: "Book",
    initialStats: {
      hp: 300,
      mp: 200,
      str: 6,
      def: 8,
      mag: 25,
      spd: 12
    },
    description: "A young mage who is the last of her clan. Can cast powerful astral artes but is physically weak."
  },
  4: {
    id: 4,
    name: "Law",
    role: "Brawler",
    element: "Light",
    weaponType: "Gauntlets",
    initialStats: {
      hp: 550,
      mp: 60,
      str: 22,
      def: 10,
      mag: 5,
      spd: 18
    },
    description: "A hot-blooded martial artist who fights with his fists and feet. Exceptionally fast and hits hard."
  }
};

