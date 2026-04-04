import React, { FC, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Hammer, Users, Zap, Flame, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'hub' | 'forge' | 'guild';
  onViewChange: (view: 'hub' | 'forge' | 'guild') => void;
  xp: number;
  gold: number;
  onLogout: () => void;
}

const navItems = [
  { key: 'hub' as const, label: 'Hub', icon: LayoutDashboard },
  { key: 'forge' as const, label: 'Forge', icon: Hammer },
  { key: 'guild' as const, label: 'Guild', icon: Users },
];

export const DashboardNavbar: FC<NavbarProps> = ({ currentView, onViewChange, xp, gold, onLogout }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Animated sliding indicator
  useEffect(() => {
    const btn = buttonsRef.current.get(currentView);
    if (btn && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [currentView]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex items-center justify-between px-8 py-3 border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50"
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onViewChange('hub')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] overflow-hidden group-hover:border-white/40 transition-colors">
            <span className="text-white font-black text-base relative z-10">F</span>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Focus<span className="text-white/50">Forge</span>
          </span>
        </motion.div>
        
        <div className="h-5 w-px bg-white/10" />
        
        {/* Nav Items with sliding indicator */}
        <div ref={navRef} className="relative flex items-center gap-1">
          {/* Sliding background indicator */}
          <motion.div
            className="absolute h-full bg-white/10 rounded-xl"
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />

          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              ref={(el) => { if (el) buttonsRef.current.set(key, el); }}
              onClick={() => onViewChange(key)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                currentView === key ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Stats + Logout */}
      <div className="flex items-center gap-4">
        {/* XP Badge */}
        <motion.div 
          key={xp}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-500/15 backdrop-blur-sm"
        >
          <Zap size={13} className="fill-current" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={xp}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {xp.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="text-blue-400/60">XP</span>
        </motion.div>

        {/* Gold Badge */}
        <motion.div 
          key={gold}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-500/15 backdrop-blur-sm"
        >
          <Flame size={13} className="fill-current" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={gold}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {gold.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="text-amber-400/60">Gold</span>
        </motion.div>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Logout */}
        <motion.button 
          onClick={onLogout} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-medium text-white/30 hover:text-red-400 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={15} />
        </motion.button>
      </div>
    </motion.nav>
  );
};
