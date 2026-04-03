import React, { FC } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Users } from 'lucide-react';

export const GuildPage: FC = () => {
  const members = [
    { name: 'Heroic Fox', role: 'GUILD MASTER', level: 12, avatar: '🦊', color: 'bg-orange-500/20' },
    { name: 'Shadow Cat', role: 'OFFICER', level: 15, avatar: '🐱', color: 'bg-purple-500/20' },
    { name: 'Wise Owl', role: 'MEMBER', level: 8, avatar: '🦉', color: 'bg-blue-500/20' },
    { name: 'Lone Wolf', role: 'MEMBER', level: 9, avatar: '🐺', color: 'bg-gray-500/20' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 pb-20"
    >
      <div className="glass-card p-10 flex items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-900/40 border border-white/10 flex items-center justify-center shadow-2xl">
            <Shield size={64} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/40">
                Rank 43 Worldwide
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight">Frontend Wizards</h1>
            <p className="text-white/40 max-w-xl font-medium leading-relaxed">
              A guild dedicated to mastering the art of React, CSS, and creating buttery smooth user interfaces. We battle procrastination together.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all shadow-xl shadow-white/5">
            Invite Members
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
            Guild Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 glass-card p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="flex items-center gap-3 text-red-400 font-bold">
            <Target size={20} />
            <span className="tracking-tight">Weekly Boss Battle</span>
          </div>

          <div className="flex flex-col items-center gap-6 py-8">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              🐲
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl font-black">The Procrastination Dragon</h3>
              <p className="text-white/40 text-sm font-medium mt-1">Defeat by accumulating 20,000 Group XP before Sunday.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end text-sm font-bold">
              <span className="text-white/40 uppercase tracking-widest text-[10px]">Boss HP</span>
              <span className="text-red-400">7,500 / 20,000 XP remaining</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '37.5%' }}
                className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20">
              Reward: <span className="text-purple-400">Epic 'Dragon Slayer' Chat Badge</span> & <span className="text-accent-yellow">500 Gold Each</span>
            </p>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/60 font-bold">
              <Users size={20} />
              <span className="tracking-tight">Roster (4/10)</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {members.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${member.color} flex items-center justify-center text-2xl border border-white/10`}>
                    {member.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{member.name}</span>
                    <span className={`text-[9px] font-black tracking-widest uppercase ${member.role === 'GUILD MASTER' ? 'text-blue-400' : member.role === 'OFFICER' ? 'text-purple-400' : 'text-white/30'}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-white/40">
                  Lvl {member.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
