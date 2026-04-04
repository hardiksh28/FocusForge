import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Flame, Sparkles, Lock, Star, Rocket, Gift, Ghost } from 'lucide-react';
import { api } from '../../lib/api';

export const ForgePage: FC = () => {
  const [userData, setUserData] = useState<any>(null);

  const fetchUser = async () => {
    try {
      const user = await api.auth.me();
      setUserData(user);
    } catch (e) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forge-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-12 max-w-3xl">
        
        {/* Animated Icon Portal */}
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-48 h-48 rounded-[40px] border-2 border-dashed border-forge-accent/20 flex items-center justify-center relative"
          >
            <div className="absolute inset-4 rounded-[30px] border border-forge-accent/10 animate-pulse" />
            <Sparkles className="w-20 h-20 text-forge-accent" />
          </motion.div>
          
          {/* Floating Orbs */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className={`absolute w-3 h-3 rounded-full bg-forge-accent/40 blur-sm`}
              style={{
                top: `${20 + i * 20}%`,
                left: i % 2 === 0 ? '-20%' : '110%'
              }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              THE FORGE
            </h1>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-forge-accent/50" />
              <span className="text-forge-accent font-black tracking-[0.3em] text-sm uppercase">Coming Soon</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-forge-accent/50" />
            </div>
          </motion.div>

          <p className="text-white/30 text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Our master blacksmiths are currently smelting new legendary <span className="text-white/60">Avatars</span>, <span className="text-white/60">Titles</span>, and <span className="text-white/60">Global Themes</span>. 
            Prepare your XP and Gold for the first drop.
          </p>
        </div>

        {/* Currency Display (Restored Stable Logic) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 shadow-inner">
              <Zap size={18} className="text-blue-400 fill-blue-400" />
              <span className="font-black text-xl text-white">{(userData?.xp || 0).toLocaleString()}</span>
              <span className="text-white/30 text-xs font-black uppercase tracking-widest ml-1">XP</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl px-6 py-3 shadow-inner">
              <Flame size={18} className="text-accent-yellow fill-accent-yellow" />
              <span className="font-black text-xl text-white">{(userData?.gold || 0).toLocaleString()}</span>
              <span className="text-accent-yellow/40 text-xs font-black uppercase tracking-widest ml-1">Gold</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar Mockup */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
            <span>Smelting Progress</span>
            <span>85%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-forge-accent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

      </div>

      {/* Decorative Icons in background */}
      <div className="absolute top-20 left-20 opacity-5 rotate-12"><Rocket size={120} /></div>
      <div className="absolute bottom-20 right-20 opacity-5 -rotate-12"><Gift size={120} /></div>
      <div className="absolute top-40 right-40 opacity-[0.02]"><Ghost size={80} /></div>
    </motion.div>
  );
};
