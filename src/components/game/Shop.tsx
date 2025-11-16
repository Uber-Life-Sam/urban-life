// src/components/game/Shop.tsx
import React from 'react';
import { shopItems, ShopItem } from '@/data/shopItems';
import { Button } from '@/components/ui/button';

interface ShopProps {
  money: number;
  onBuy: (itemId: string) => void;
  onClose: () => void;
}

const Shop = ({ money, onBuy, onClose }: ShopProps) => {
  return (
    <div className="absolute top-8 right-8 z-60 w-96 bg-white/95 p-4 rounded-lg shadow-lg">  
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Shop</h3>
        <button onClick={onClose} className="text-sm text-muted-foreground">Close</button>
      </div>
      <div className="space-y-3 max-h-80 overflow-auto">  
        {shopItems.map((item: ShopItem) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-background/60 rounded">  
            <div className="flex-1 pr-3">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="font-semibold">${item.price}</div>
              <Button size="sm" disabled={money < item.price} onClick={() => onBuy(item.id)}>
                Buy
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
