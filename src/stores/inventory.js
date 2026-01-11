// src/stores/inventory.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { itemsDb } from '@/data/items';

const INITIAL_ITEMS = [
  // Consumables (1001-1600)
  { id: 1001, count: 5 }, // 调整初始数量为合理值，方便测试
  { id: 1002, count: 2 },
  { id: 2001, count: 1 },
];

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const inventoryState = ref(JSON.parse(JSON.stringify(INITIAL_ITEMS)));

  // Actions
  function reset() {
    inventoryState.value = JSON.parse(JSON.stringify(INITIAL_ITEMS));
  }

  function serialize() {
    return JSON.parse(JSON.stringify(inventoryState.value));
  }

  function loadState(data) {
    if (Array.isArray(data)) {
      inventoryState.value = data;
    }
  }

  function addItem(itemId, amount = 1) {
    const existingItem = inventoryState.value.find(item => item.id === itemId);
    if (existingItem) {
      existingItem.count += amount;
    } else {
      inventoryState.value.push({ id: itemId, count: amount });
    }
  }

  function removeItem(itemId, amount = 1) {
    const index = inventoryState.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = inventoryState.value[index];
      if (item.count > amount) {
        item.count -= amount;
      } else {
        inventoryState.value.splice(index, 1);
      }
    }
  }

  // Getters: 将 ID 转换为完整的 UI 数据对象

  // 自动填充 GameDataGrid 需要的字段 (icon, name, etc.)
  const getAllItems = computed(() => {
    return inventoryState.value.map(slot => {
      const dbItem = itemsDb[slot.id];
      if (!dbItem) return null; // 处理未知物品 ID

      return {
        ...dbItem,
        count: slot.count,
        footerRight: `x${slot.count}`, // GameDataGrid 需要的字段

        // 映射 type 到 tab 分类
        category: mapTypeToCategory(dbItem.type)
      };
    }).filter(item => item !== null);
  });

  // Helper: 映射数据类型到 Tabs
  function mapTypeToCategory(type) {
    switch (type) {
      case 'Consumable': return 'Consumables';
      case 'Weapon': return 'Weapons';
      case 'Armor': return 'Armor';
      case 'Key Item': return 'Key Items';
      default: return 'Others';
    }
  }

  // 按分类获取物品
  function getItemsByCategory(category) {
    if (category === 'All') return getAllItems.value;
    return getAllItems.value.filter(item => item.category === category);
  }

  return {
    inventoryState,
    addItem,
    removeItem,
    getAllItems,
    getItemsByCategory,
    reset,
    serialize,
    loadState
  };
});

