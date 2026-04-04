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

  // Animated sliding indicator (Desktop only)
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
    <>
      {/* Top Bar (Universal) */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50"
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onViewChange('hub')}
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl border border-white/20 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] overflow-hidden">
              <span className="text-white font-black text-sm md:text-base relative z-10">F</span>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white hidden sm:block">
              Focus<span className="text-white/50">Forge</span>
            </span>
          </motion.div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <div className="h-5 w-px bg-white/10 mx-4" />
            <div ref={navRef} className="relative flex items-center gap-1">
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
        </div>

        {/* Right: Stats & Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-2 md:px-3.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold border border-blue-500/15">
            <Zap size={10} className="fill-current hidden xs:block" />
            <span>{xp.toLocaleString()} <span className="opacity-50">XP</span></span>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-2 md:px-3.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold border border-amber-500/15">
            <Flame size={10} className="fill-current hidden xs:block" />
            <span>{gold.toLocaleString()} <span className="opacity-50">G</span></span>
          </div>

          <button onClick={onLogout} className="p-2 text-white/30 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pointer-events-none">
        <div className="bg-[#111]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-around pointer-events-auto shadow-2xl">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = currentView === key;
            return (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                  isActive ? 'text-forge-accent' : 'text-white/40'
                }`}
              >
                <Icon size={20} className={isActive ? 'fill-forge-accent/20' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute -bottom-1 w-1 h-1 bg-forge-accent rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
