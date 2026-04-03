import React, { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Zap, Flame, Timer, Settings, RotateCcw, Play, Pause, BarChart3, ChevronRight, Trophy } from 'lucide-react';
import { Quest } from '../../types';

export const HeroHeader: FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-8 flex items-center gap-8"
  >
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1">
        <div className="w-full h-full rounded-full bg-card-dark flex items-center justify-center overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=HeroicFox" 
            alt="Avatar" 
            className="w-16 h-16"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-accent-yellow text-bg-dark text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-card-dark">
        LVL 12
      </div>
    </div>

    <div className="flex-1">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Heroic Fox</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Next level unlocks: Title "Journeyman"</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-white/80">450 / 1000 XP</span>
        </div>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '45%' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        />
      </div>
    </div>
  </motion.div>
);

export const QuestItem: FC<{ quest: Quest }> = ({ quest }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="bg-card-dark/40 hover:bg-card-dark/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${quest.completed ? 'border-accent-green bg-accent-green/10' : 'border-white/10'}`}>
        {quest.completed ? <CheckCircle2 size={20} className="text-accent-green" /> : <Circle size={20} className="text-white/20" />}
      </div>
      <div>
        <h4 className={`font-bold ${quest.completed ? 'text-white/40 line-through' : 'text-white'}`}>{quest.title}</h4>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{quest.category}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
        <Zap size={14} className="fill-current" />
        +{quest.xp} XP
      </div>
      <div className="flex items-center gap-2 text-accent-yellow text-xs font-bold">
        <Flame size={14} className="fill-current" />
        +{quest.gold} Gold
      </div>
    </div>
  </motion.div>
);

export const StatCard: FC<{ label: string; value: string | number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{label}</span>
    <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

export const FocusSession: FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };
  const setTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / initialTime) * 364;

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-accent-purple/20 to-transparent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-accent-purple" />
          <span className="font-bold text-sm">Focus Session</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const mins = prompt("Enter minutes:", "25");
              if (mins) setTimer(parseInt(mins));
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
            <motion.circle 
              cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" 
              strokeDasharray="364"
              animate={{ strokeDashoffset: 364 - progress }}
              transition={{ duration: 0.5 }}
              className="text-accent-purple" 
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold tracking-tighter">{formatTime(timeLeft)}</span>
            <span className="text-[10px] text-white/40 font-bold uppercase">remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[25, 50, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => setTimer(mins)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                initialTime === mins * 60 
                  ? 'bg-accent-purple text-bg-dark border-accent-purple' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={resetTimer}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/60 hover:text-white"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={toggleTimer}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-accent-purple text-bg-dark'}`}
          >
            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <div className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export const WorkProgress: FC = () => (
  <div className="glass-card p-8">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center">
          <BarChart3 size={18} className="text-accent-green" />
        </div>
        <span className="font-black text-lg tracking-tight">Work Progress</span>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
        <ChevronRight size={20} className="text-white/20" />
      </button>
    </div>
    
    <div className="grid grid-cols-2 gap-8 items-center">
      <div className="flex justify-center">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full h-full rounded-full border-[10px] border-accent-purple/10 border-t-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]" />
          </div>
          <div className="absolute inset-4 flex items-center justify-center">
             <div className="w-full h-full rounded-full border-[10px] border-accent-green/10 border-t-accent-green shadow-[0_0_15px_rgba(34,197,94,0.2)]" />
          </div>
          <div className="absolute inset-8 flex items-center justify-center">
             <div className="w-full h-full rounded-full border-[10px] border-accent-yellow/10 border-t-accent-yellow shadow-[0_0_15px_rgba(234,179,8,0.2)]" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
          <div>
            <p className="text-xl font-black leading-none tracking-tight">43.3 hrs</p>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Total Focus</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <div>
            <p className="text-xl font-black leading-none tracking-tight">58 tasks</p>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Completed</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rounded-full bg-accent-yellow shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
          <div>
            <p className="text-xl font-black leading-none tracking-tight">6.3 hrs</p>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Daily Avg</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ActiveGuild: FC = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-6">
      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Active Guild</span>
      <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
    </div>
    
    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-card-dark flex items-center justify-center border border-white/10">
        <Trophy size={24} className="text-accent-yellow" />
      </div>
      <div>
        <h4 className="font-bold text-sm">Frontend Wizards</h4>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Rank 43 | 8 Members</p>
      </div>
    </div>
    
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Weekly Boss Progress</span>
        <span className="text-[10px] font-bold text-white/60">12.5k / 20k XP</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-accent-blue w-[62%] rounded-full" />
      </div>
    </div>
  </div>
);
