import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Crown, Palette, Shield, Sparkles, Star, Eye, Flame, Lock, Check, Layout } from 'lucide-react';
import { api } from '../../lib/api';
import { useTheme, ThemeType } from '../../context/ThemeContext';

interface ForgeReward {
  id: string;
  title: string;
  description: string;
  category: 'TITLE' | 'AVATAR' | 'THEME' | 'BADGE' | 'EFFECT';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  currency: 'XP' | 'GOLD';
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  themeKey?: ThemeType;
}

const rarityConfig = {
  COMMON:    { border: 'border-gray-500/30',   bg: 'bg-gray-500/10',   text: 'text-gray-400',   glow: '' },
  UNCOMMON:  { border: 'border-green-500/30',  bg: 'bg-green-500/10',  text: 'text-green-400',  glow: '' },
  RARE:      { border: 'border-blue-500/30',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
  EPIC:      { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' },
  LEGENDARY: { border: 'border-amber-500/30',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]' },
};

const categoryIcons = {
  TITLE: '🏷️',
  AVATAR: '👤',
  THEME: '🎨',
  BADGE: '🛡️',
  EFFECT: '✨',
};

const ForgeCard: FC<{ 
  item: ForgeReward; 
  userXp: number; 
  userGold: number;
  owned: boolean; 
  active?: boolean;
  onBuy: () => void;
  onApply?: () => void;
}> = ({ item, userXp, userGold, owned, active, onBuy, onApply }) => {
  const rarity = rarityConfig[item.rarity];
  const canAfford = item.currency === 'XP' ? userXp >= item.price : userGold >= item.price;
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl border ${rarity.border} ${rarity.glow} overflow-hidden bg-forge-bg group`}
    >
      {item.rarity === 'LEGENDARY' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-forge-accent/5 to-transparent animate-pulse pointer-events-none" />
      )}

      <div className={`relative h-40 flex items-center justify-center bg-gradient-to-br ${item.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 left-6 w-1 h-1 rounded-full bg-white/30 animate-ping" />
          <div className="absolute top-8 right-10 w-1 h-1 rounded-full bg-white/20 animate-ping" />
        </div>

        <div className="relative z-10 transform group-hover:scale-125 transition-transform duration-500">
          {item.icon}
        </div>

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
          <span>{categoryIcons[item.category]}</span>
          {item.category}
        </div>

        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${rarity.border} ${rarity.bg} ${rarity.text}`}>
          {item.rarity}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-base text-white mb-1">{item.title}</h4>
          <p className="text-[11px] text-white/35 leading-relaxed">{item.description}</p>
        </div>

        {owned ? (
          item.category === 'THEME' ? (
            <button
              onClick={onApply}
              disabled={active}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                active 
                  ? 'bg-accent-green/20 border border-accent-green/30 text-accent-green' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              {active ? <Check size={16} /> : <Palette size={16} />}
              {active ? 'Applied' : 'Apply Theme'}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green font-bold text-sm">
              <Check size={16} /> Owned
            </div>
          )
        ) : showConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={() => { onBuy(); setShowConfirm(false); }}
              className="flex-1 py-3 rounded-xl bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/30 text-accent-green font-bold text-sm transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-bold text-sm transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => canAfford && setShowConfirm(true)}
            disabled={!canAfford}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              canAfford
                ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                : 'bg-white/[0.02] border border-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {!canAfford && <Lock size={13} />}
            <span>{item.price.toLocaleString()}</span>
            {item.currency === 'XP' ? (
              <Zap size={13} className="text-blue-400 fill-blue-400" />
            ) : (
              <Flame size={13} className="text-accent-yellow fill-accent-yellow" />
            )}
            <span>{item.currency}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

const categories = ['ALL', 'THEME', 'TITLE', 'AVATAR', 'BADGE', 'EFFECT'] as const;

export const ForgePage: FC = () => {
  const { activeTheme, setTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [userData, setUserData] = useState<any>(null);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());

  const fetchUser = async () => {
    try {
      const user = await api.auth.me();
      setUserData(user);
      setOwnedItems(new Set([...(user.owned_themes || [])]));
      if (user.active_theme) setTheme(user.active_theme as ThemeType);
    } catch (e) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const rewards: ForgeReward[] = [
    // THEMES (GOLD BASED)
    {
      id: 'solar-light', title: 'Solar Masterpiece', description: 'Clean, professional light-mode aesthetic with a technical grid and solar glows.',
      category: 'THEME', rarity: 'LEGENDARY', price: 5, currency: 'GOLD',
      gradient: 'from-orange-100 to-indigo-100', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      icon: <Star className="text-amber-500 w-12 h-12" />, themeKey: 'solar-light'
    },
    {
      id: 'cyber-dark', title: 'Cyber Nexus', description: 'Deep space purple with neon magenta energy. The ultimate metaverse look.',
      category: 'THEME', rarity: 'LEGENDARY', price: 5, currency: 'GOLD',
      gradient: 'from-[#020005] to-[#0A0515]', glow: 'shadow-[0_0_40px_rgba(255,0,255,0.4)]',
      icon: <Sparkles className="text-fuchsia-500 w-12 h-12" />, themeKey: 'cyber-dark'
    },
    {
      id: 'th_starfield', title: 'Starfield (Default)', description: 'The classic FocusForge void. Twinkling stars and infinite darkness.',
      category: 'THEME', rarity: 'COMMON', price: 0, currency: 'GOLD',
      gradient: 'from-gray-900 to-black', glow: '',
      icon: <Star className="text-white w-12 h-12" />, themeKey: 'starfield'
    },
    {
      id: 'neon', title: 'Neon Cyberpunk', description: 'Electric cyan and neon pink accents. For the night city dwellers.',
      category: 'THEME', rarity: 'EPIC', price: 2, currency: 'GOLD',
      gradient: 'from-cyan-900 to-fuchsia-900', glow: 'shadow-[0_0_30px_rgba(217,70,239,0.2)]',
      icon: <Layout className="text-cyan-400 w-12 h-12" />, themeKey: 'neon'
    },
    {
      id: 'forest', title: 'Forest Depths', description: 'Soothing emerald greens and gold. Find peace in nature.',
      category: 'THEME', rarity: 'RARE', price: 2, currency: 'GOLD',
      gradient: 'from-emerald-900 to-green-950', glow: '',
      icon: <Palette className="text-green-400 w-12 h-12" />, themeKey: 'forest'
    },
    {
      id: 'crimson', title: 'Crimson Blaze', description: 'Fired up red and orange theme. Keep your passion burning.',
      category: 'THEME', rarity: 'EPIC', price: 2, currency: 'GOLD',
      gradient: 'from-red-900 to-orange-950', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      icon: <Flame className="text-red-500 w-12 h-12" />, themeKey: 'crimson'
    },
    {
      id: 'royal', title: 'Royal Amethyst', description: 'Deep purple and golden highlights. For those who demand luxury.',
      category: 'THEME', rarity: 'LEGENDARY', price: 2, currency: 'GOLD',
      gradient: 'from-purple-900 to-amber-950', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.25)]',
      icon: <Crown className="text-amber-500 w-12 h-12" />, themeKey: 'royal'
    },
    // TITLES (XP BASED)
    {
      id: 't1', title: 'The Focused One', description: 'A prestigious title displayed next to your name.',
      category: 'TITLE', rarity: 'UNCOMMON', price: 200, currency: 'XP',
      gradient: 'from-emerald-600/30 to-teal-900/40', glow: '',
      icon: <span className="text-5xl">🎯</span>
    },
    // ... other titles/avatars/badges (kept for future but simplified for now)
  ];

  const filteredRewards = activeCategory === 'ALL' ? rewards : rewards.filter(r => r.category === activeCategory);

  const handleBuy = async (item: ForgeReward) => {
    try {
      if (item.category === 'THEME') {
        await api.auth.buyTheme(item.themeKey!, item.price);
      }
      // For XP items, we'd need a backend route or update user xp
      await fetchUser();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleApply = async (theme: ThemeType) => {
    try {
      await api.auth.updateTheme(theme);
      setTheme(theme);
      await fetchUser();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 pb-20"
    >
      <div className="text-center flex flex-col gap-4 max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black tracking-tight"
        >
          The Reward Forge
        </motion.h1>
        <p className="text-white/40 font-medium">
          Spend Gold earned from daily sign-ins and boss battles on premium themes.
        </p>
        
        <div className="flex items-center gap-4 mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
            <Zap size={16} className="text-blue-400 fill-blue-400" />
            <span className="font-bold text-white">{(userData?.xp || 0).toLocaleString()}</span>
            <span className="text-white/40 text-sm font-bold uppercase tracking-wider ml-1">XP</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-5 py-2">
            <Flame size={16} className="text-accent-yellow fill-accent-yellow" />
            <span className="font-bold text-white">{(userData?.gold || 0).toLocaleString()}</span>
            <span className="text-accent-yellow/60 text-sm font-bold uppercase tracking-wider ml-1">Gold</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${
              activeCategory === cat
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/[0.02] text-white/30 border-white/5 hover:bg-white/5 hover:text-white/50'
            }`}
          >
            {cat !== 'ALL' && <span className="mr-1.5">{categoryIcons[cat as keyof typeof categoryIcons]}</span>}
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRewards.map(item => (
            <ForgeCard
              key={item.id}
              item={item}
              userXp={userData?.xp || 0}
              userGold={userData?.gold || 0}
              owned={ownedItems.has(item.themeKey || item.id) || item.price === 0}
              active={activeTheme === item.themeKey}
              onBuy={() => handleBuy(item)}
              onApply={() => item.themeKey && handleApply(item.themeKey)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-16 text-white/20 font-bold">
          No rewards in this category yet.
        </div>
      )}
    </motion.div>
  );
};
