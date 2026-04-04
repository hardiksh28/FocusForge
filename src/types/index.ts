import React from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  gold: number;
  points: number;
  total_focus_seconds: number;
  is_timer_running: boolean;
  timer_start_time: string | null;
  session_type: 'focus' | 'break';
  guild_id: string | null;
  last_daily_claim: string | null;
  active_theme: string;
  owned_themes: string[];
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  category: string;
  xp: number;
  gold: number;
  completed: boolean;
  created_at: string;
}

export interface Guild {
  id: string;
  name: string;
  owner_id: string;
  boss_hp_remaining: number;
  boss_week_start: string;
  created_at: string;
}

export interface ForgeItem {
  id: string;
  title: string;
  description: string;
  category: 'TITLE' | 'AVATAR' | 'THEME' | 'BADGE' | 'EFFECT';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}
