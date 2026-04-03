import React, { FC } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, Circle, Zap, Flame } from 'lucide-react';
import { Quest } from '../../types';

export const QuestBoardModal: FC<{ isOpen: boolean; onClose: () => void; quests: Quest[] }> = ({ isOpen, onClose, quests }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col relative z-10"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight">Quest Board</h2>
            <p className="text-white/40 font-medium">All active and completed quests for your journey.</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex flex-col gap-4">
          {quests.map(quest => (
            <div key={quest.id} className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${quest.completed ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${quest.completed ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                  {quest.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg">{quest.title}</h4>
                    <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 bg-white/5 rounded-md border border-white/10 text-white/40">
                      {quest.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-blue-400 flex items-center gap-1"><Zap size={12} /> {quest.xp} XP</span>
                    <span className="text-accent-yellow flex items-center gap-1"><Flame size={12} /> {quest.gold} Gold</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
