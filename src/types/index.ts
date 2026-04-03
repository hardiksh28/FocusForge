import React from 'react';

export interface Quest {
  id: string;
  title: string;
  category: string;
  xp: number;
  gold: number;
  completed: boolean;
}

export interface ForgeItem {
  id: string;
  title: string;
  category: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  icon: React.ReactNode;
  color: string;
}
