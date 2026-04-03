import React, { FC } from 'react';
import { LayoutDashboard, Hammer, Users, Zap, Flame, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'hub' | 'forge' | 'guild';
  onViewChange: (view: 'hub' | 'forge' | 'guild') => void;
  xp: number;
  gold: number;
  onLogout: () => void;
}

export const DashboardNavbar: FC<NavbarProps> = ({ currentView, onViewChange, xp, gold, onLogout }) => (
  <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-bg-dark/50 backdrop-blur-xl sticky top-0 z-50">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('hub')}>
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
          <span className="text-white font-black text-lg">F</span>
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">FocusForge</span>
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-2" />
      
      <div className="flex items-center gap-6 text-sm font-medium text-white/60">
        <button 
          onClick={() => onViewChange('hub')}
          className={`flex items-center gap-2 transition-colors ${currentView === 'hub' ? 'text-white' : 'hover:text-white'}`}
        >
          <LayoutDashboard size={16} /> Hub
        </button>
        <button 
          onClick={() => onViewChange('forge')}
          className={`flex items-center gap-2 transition-colors ${currentView === 'forge' ? 'text-white' : 'hover:text-white'}`}
        >
          <Hammer size={16} /> Forge
        </button>
        <button 
          onClick={() => onViewChange('guild')}
          className={`flex items-center gap-2 transition-colors ${currentView === 'guild' ? 'text-white' : 'hover:text-white'}`}
        >
          <Users size={16} /> Guild
        </button>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
          <Zap size={14} className="fill-current" />
          {xp} XP
        </div>
        <div className="flex items-center gap-2 bg-accent-yellow/10 text-accent-yellow px-3 py-1 rounded-full text-xs font-bold border border-accent-yellow/20">
          <Flame size={14} className="fill-current" />
          {gold} Gold
        </div>
      </div>
      <button onClick={onLogout} className="text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2">
        Logout <LogOut size={16} />
      </button>
    </div>
  </nav>
);
