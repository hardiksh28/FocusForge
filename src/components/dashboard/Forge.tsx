import React, { FC } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Trophy, Zap, Star } from 'lucide-react';
import { ForgeItem } from '../../types';

const ForgeCard: FC<{ item: ForgeItem }> = ({ item }) => {
  const rarityColors = {
    COMMON: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    UNCOMMON: 'bg-green-500/20 text-green-400 border-green-500/30',
    RARE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    EPIC: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    LEGENDARY: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card p-6 flex flex-col gap-6 group transition-all"
    >
      <div className={`aspect-video rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color} border border-white/5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        <div className="relative z-10 scale-150 group-hover:scale-[1.7] transition-transform duration-500">
          {item.icon}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-lg">{item.title}</h4>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border ${rarityColors[item.rarity]}`}>
            {item.rarity}
          </span>
        </div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.category}</p>
      </div>

      <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-all border border-white/5 flex items-center justify-center gap-2">
        Forge for {item.price} <Star size={14} className="text-accent-yellow fill-current" />
      </button>
    </motion.div>
  );
};

export const ForgePage: FC = () => {
  const items: ForgeItem[] = [
    { 
      id: '1', 
      title: 'Neon Cyan Theme', 
      category: 'THEME', 
      rarity: 'EPIC', 
      price: 1000, 
      color: 'from-cyan-500/20 to-cyan-900/40',
      icon: <LayoutDashboard className="text-cyan-400" size={32} />
    },
    { 
      id: '2', 
      title: 'Crimson UI Glow', 
      category: 'THEME', 
      rarity: 'RARE', 
      price: 500, 
      color: 'from-red-500/20 to-red-900/40',
      icon: <LayoutDashboard className="text-red-400" size={32} />
    },
    { 
      id: '3', 
      title: 'Mystic Forest Badge', 
      category: 'BADGE', 
      rarity: 'UNCOMMON', 
      price: 250, 
      color: 'from-green-500/20 to-green-900/40',
      icon: <Trophy className="text-green-400" size={32} />
    },
    { 
      id: '4', 
      title: 'Golden Crown', 
      category: 'AVATAR', 
      rarity: 'LEGENDARY', 
      price: 2500, 
      color: 'from-yellow-500/20 to-yellow-900/40',
      icon: <span className="text-4xl">👑</span>
    },
    { 
      id: '5', 
      title: 'Dark Mode+', 
      category: 'THEME', 
      rarity: 'COMMON', 
      price: 100, 
      color: 'from-gray-500/20 to-gray-900/40',
      icon: <LayoutDashboard className="text-gray-400" size={32} />
    },
    { 
      id: '6', 
      title: 'Sparkle Effect', 
      category: 'VISUAL', 
      rarity: 'RARE', 
      price: 750, 
      color: 'from-blue-500/20 to-blue-900/40',
      icon: <Zap className="text-blue-400" size={32} />
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12 pb-20"
    >
      <div className="text-center flex flex-col gap-4 max-w-2xl mx-auto">
        <h1 className="text-6xl font-black tracking-tight">The Reward Forge</h1>
        <p className="text-white/40 font-medium">
          Spend your hard-earned gold and crystals to customize your character and UI.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {items.map(item => (
          <ForgeCard key={item.id} item={item} />
        ))}
      </div>
    </motion.div>
  );
};
