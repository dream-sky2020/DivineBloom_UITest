// src/stores/inventory.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { itemsDb } from '@/data/items';

export const useInventoryStore = defineStore('inventory', () => {
  // State: 仅存储物品 ID 和数量
  // 结构: [{ id: 1001, count: 15 }, { id: 2001, count: 1 }]
  const inventoryState = ref([
    // Consumables (1001-1600)
    { id: 1001, count: 99 },
    { id: 1002, count: 99 },
    { id: 1003, count: 99 },
    { id: 1101, count: 99 },
    { id: 1201, count: 99 },
    { id: 1202, count: 99 },
    { id: 1301, count: 99 },
    { id: 1302, count: 99 },
    { id: 1401, count: 99 },
    { id: 1402, count: 99 },
    { id: 1403, count: 99 },
    { id: 1404, count: 99 },
    { id: 1501, count: 99 },
    // Weapons (2001-2003)
    { id: 2001, count: 99 },
    { id: 2002, count: 99 },
    { id: 2003, count: 99 },
    // Armor (3001-3003)
    { id: 3001, count: 99 },
    { id: 3002, count: 99 },
    { id: 3003, count: 99 },
    // Accessories (4001-4002)
    { id: 4001, count: 99 },
    { id: 4002, count: 99 },
    // Key Items (9001-9002)
    { id: 9001, count: 99 },
    { id: 9002, count: 99 }
  ]);

  // Actions
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
    getItemsByCategory
  };
});

