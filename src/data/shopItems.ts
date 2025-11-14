// src/data/shopItems.ts
export type ShopItemType = 'food' | 'item' | 'upgrade';

export interface ShopItem {
  id: string;
  name: string;
  type: ShopItemType;
  price: number;
  description: string;
  effect?: {
    energy?: number;
    inventorySizeIncrease?: number;
    speedMultiplier?: number;
  };
}

export const shopItems: ShopItem[] = [
  {
    id: 'sandwich',
    name: 'Sandwich',
    type: 'food',
    price: 10,
    description: 'A tasty sandwich. Restores energy (+20).',
    effect: { energy: 20 },
  },
  {
    id: 'coffee',
    name: 'Coffee',
    type: 'food',
    price: 5,
    description: 'Quick caffeine boost. Restores energy (+10).',
    effect: { energy: 10 },
  },
  {
    id: 'first_aid',
    name: 'First Aid Kit',
    type: 'item',
    price: 40,
    description: 'A kit that can be used later to restore energy when consumed.',
  },
  {
    id: 'backpack',
    name: 'Backpack',
    type: 'upgrade',
    price: 200,
    description: 'Increases inventory capacity by 5.',
    effect: { inventorySizeIncrease: 5 },
  },
  {
    id: 'running_shoes',
    name: 'Running Shoes',
    type: 'upgrade',
    price: 150,
    description: 'Increases movement speed slightly.',
    effect: { speedMultiplier: 1.12 },
  },
];
