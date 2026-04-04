import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../lib/api';
import { CheckCircle2, Circle, Zap, Flame, Timer, Settings, RotateCcw, Play, Pause, BarChart3, ChevronRight, Trophy, X, Plus } from 'lucide-react';
import { Quest } from '../../types';

export const HeroHeader: FC<{ user?: any }> = ({ user }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left"
  >
    <div className="relative">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-forge-accent to-forge-secondary p-1">
        <div className="w-full h-full rounded-full bg-forge-card flex items-center justify-center overflow-hidden text-4xl md:text-5xl">
          {user?.avatar?.startsWith('http') ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            user?.avatar || '🦊'
          )}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-forge-card shadow-lg">
        LVL {user?.level || 1}
      </div>
    </div>

    <div className="flex-1 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-4 gap-2 md:gap-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">{user?.username || 'Hero'}</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Next level: "Journeyman"</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-white/80">{user?.xp || 0} / {(user?.level || 1) * 1000} XP</span>
        </div>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-forge-accent rounded-full shadow-[0_0_20px_var(--forge-glow)]"
        />
      </div>
    </div>
  </motion.div>
);

export const DailySignIn: FC<{ user?: any; onClaim: () => void }> = ({ user, onClaim }) => {
  const [claimed, setClaimed] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?.last_daily_claim === today) {
      setClaimed(true);
    }
  }, [user, today]);

  const handleClaim = async () => {
    try {
      await api.auth.claimDaily();
      setClaimed(true);
      onClaim();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-accent-yellow/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-accent-yellow" />
          <span className="font-bold text-sm">Daily Reward</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${claimed ? 'bg-accent-green/20 border-accent-green/40' : 'bg-accent-yellow/20 border-accent-yellow/40 animate-pulse'}`}>
          <Flame size={24} className={claimed ? 'text-accent-green' : 'text-accent-yellow'} />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-bold">{claimed ? 'Reward Claimed!' : 'Daily Gold Available'}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Claim 1 Gold every day</p>
        </div>

        <button
          disabled={claimed}
          onClick={handleClaim}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
            claimed 
              ? 'bg-white/5 text-white/20 cursor-not-allowed' 
              : 'bg-accent-yellow text-black hover:scale-[1.02] shadow-lg shadow-yellow-500/10'
          }`}
        >
          {claimed ? 'Tomorrow' : 'Claim 1 Gold'}
        </button>
      </div>
    </div>
  );
};

export const QuestItem: FC<{ quest: Quest; onComplete: (id: string) => void }> = ({ quest, onComplete }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="bg-forge-card/40 hover:bg-forge-card/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer group"
    onClick={() => !quest.completed && onComplete(quest.id)}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${quest.completed ? 'border-accent-green bg-accent-green/10' : 'border-white/10 group-hover:border-forge-accent/50'}`}>
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
    </div>
  </motion.div>
);

export const StatCard: FC<{ label: string; value: string | number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className="glass-card p-4 md:p-6 flex flex-col items-center justify-center text-center">
    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 md:mb-2">{label}</span>
    <span className={`text-3xl md:text-4xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

// ─── ADD QUEST MODAL ─────────────────────────────────────
export const AddQuestModal: FC<{ isOpen: boolean; onClose: () => void; onAdd: (data: { title: string; category: string; xp: number }) => void }> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [xp, setXp] = useState(50);

  const categories = ['General', 'Coding', 'Study', 'Fitness', 'Creative', 'Work'];
  const xpOptions = [25, 50, 100, 200];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), category, xp });
    setTitle('');
    setCategory('General');
    setXp(50);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-forge-card border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
              <X size={18} />
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-accent-green/10 border border-accent-green/20 rounded-xl mb-4">
                <Plus size={20} className="text-accent-green" />
              </div>
              <h2 className="text-2xl font-bold">New Quest</h2>
              <p className="text-white/40 text-sm mt-1">Define a new quest to track your progress</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Quest Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete React tutorial"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-accent-green/40 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                        category === cat
                          ? 'bg-accent-green/20 text-accent-green border-accent-green/40'
                          : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                  <Zap size={12} className="text-blue-400" /> XP Reward
                </label>
                <div className="flex gap-2">
                  {xpOptions.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setXp(val)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${
                        xp === val
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Preview</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{title || 'Quest Title'}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase">{category}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-blue-400">+{xp} XP</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent-green text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Create Quest
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── FOCUS SESSION TIMER ─────────────────────────────────
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
      // Timer finished naturally — stop on backend too
      api.timer.stop().catch(() => {});
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = async () => {
    try {
      if (!isActive) {
        await api.timer.start();
      } else {
        await api.timer.pause();
      }
      setIsActive(!isActive);
    } catch (e) {
      console.error(e);
    }
  };

  const resetTimer = async () => {
    try {
      // Only call stop if timer is active on backend
      if (isActive) {
        await api.timer.stop();
      }
    } catch (e) {
      // Ignore errors — timer might not be running on backend
      console.log('Timer reset (backend may not have active timer)');
    }
    // Always reset the UI regardless of backend state
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

// ─── WORK PROGRESS (LIVE DATA) ───────────────────────────
export const WorkProgress: FC<{ user?: any; questsCompleted?: number }> = ({ user, questsCompleted = 0 }) => {
  const totalFocusSeconds = user?.total_focus_seconds || 0;
  const totalFocusHrs = (totalFocusSeconds / 3600).toFixed(1);
  const dailyAvgHrs = totalFocusSeconds > 0 ? (totalFocusSeconds / 3600 / 7).toFixed(1) : '0.0'; // avg over last 7 days approximation

  // Progress ring percentages (capped at 100%)
  const focusPct = Math.min((totalFocusSeconds / (100 * 3600)) * 100, 100); // 100 hrs = full ring
  const tasksPct = Math.min((questsCompleted / 100) * 100, 100); // 100 tasks = full ring
  const avgPct = Math.min((parseFloat(dailyAvgHrs) / 8) * 100, 100); // 8 hrs/day = full ring

  return (
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
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <div className="relative w-32 h-32 md:w-36 md:h-36">
            {/* Same SVG code, but relative to container size */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="66" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="10" />
              <circle cx="72" cy="72" r="66" fill="none" stroke="rgb(168,85,247)" strokeWidth="10" 
                strokeDasharray={`${2 * Math.PI * 66}`}
                strokeDashoffset={`${2 * Math.PI * 66 * (1 - focusPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="10" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(34,197,94)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - tasksPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <svg className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(234,179,8,0.1)" strokeWidth="10" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgb(234,179,8)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - avgPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center gap-4 group">
            <div className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.4)] flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-black leading-none tracking-tight">{totalFocusHrs} hrs</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Total Focus</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-3 h-3 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.4)] flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-black leading-none tracking-tight">{questsCompleted} tasks</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-3 h-3 rounded-full bg-accent-yellow shadow-[0_0_8px_rgba(234,179,8,0.4)] flex-shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-black leading-none tracking-tight">{dailyAvgHrs} hrs</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] mt-1">Daily Avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
