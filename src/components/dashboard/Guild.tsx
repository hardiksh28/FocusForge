import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Users, Crown, Swords, Plus, Search, Copy, Check, Star, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

// ─── TYPES ───────────────────────────────────────────────
interface GuildMember {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  points: number;
}

// ─── INVITE MODAL ────────────────────────────────────────
const InviteModal: FC<{ isOpen: boolean; onClose: () => void; onInvite: (name: string) => void }> = ({ isOpen, onClose, onInvite }) => {
  const [searchName, setSearchName] = useState('');

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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-forge-card border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">Invite Member</h2>
              <p className="text-white/40 text-xs mt-1">Found another hero? Add them by username.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter username..."
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-forge-accent/40 transition-colors"
                />
              </div>
              <button
                onClick={() => { onInvite(searchName); setSearchName(''); }}
                className="w-full py-3 bg-forge-accent text-white font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Send Invite
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── MEMBER CARD ─────────────────────────────────────────
const MemberCard: FC<{ member: GuildMember; isOwner: boolean; index: number }> = ({ member, isOwner, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-forge-card flex items-center justify-center text-xl border border-white/10">
          {member.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{member.username}</span>
            {isOwner && <Crown size={12} className="text-amber-500" />}
          </div>
          <span className="text-[9px] font-black tracking-widest uppercase text-white/30">
            Lvl {member.level}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-white/80">{member.xp.toLocaleString()}</p>
        <p className="text-[9px] text-white/20 font-bold uppercase">XP</p>
      </div>
    </motion.div>
  );
};

// ─── MAIN GUILD PAGE ─────────────────────────────────────
export const GuildPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [guildData, setGuildData] = useState<any>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [damageAmount, setDamageAmount] = useState(500);

  const fetchGuild = async () => {
    try {
      const data = await api.guild.getMy();
      setGuildData(data);
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuild();
  }, []);

  const handleCreate = async () => {
    if (!guildName.trim()) return;
    try {
      await api.guild.create(guildName);
      fetchGuild();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleInvite = async (username: string) => {
    try {
      await api.guild.invite(username);
      fetchGuild();
      setIsInviteOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAttack = async () => {
    try {
      const res = await api.guild.attackBoss(damageAmount);
      alert(res.message);
      fetchGuild();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave? Owners will disband the guild.")) return;
    try {
      await api.guild.leave();
      fetchGuild();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20">Loading Guild...</div>;

  // ─── NO GUILD STATE ──────────────────────────────────────
  if (!guildData?.guild) {
    return (
      <div className="max-w-xl mx-auto py-20 flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
          <Shield size={48} className="text-white/20" />
        </div>
        <h1 className="text-4xl font-black mb-4">You are not in a Guild</h1>
        <p className="text-white/40 text-center mb-10 leading-relaxed font-medium">
          Combat procrastination together. Create a guild to compete on the leaderboard and battle legendary bosses every week.
        </p>

        <div className="w-full glass-card p-8 bg-gradient-to-br from-forge-accent/10 to-transparent">
          <h2 className="text-xl font-bold mb-6">Create Your Guild</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              placeholder="Enter guild name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-forge-accent/40 transition-colors"
            />
            <button
              onClick={handleCreate}
              className="px-8 bg-white text-black font-bold rounded-xl hover:scale-[1.03] transition-transform"
            >
              Found Guild
            </button>
          </div>
          <p className="text-[10px] text-white/20 mt-4 font-bold uppercase tracking-widest text-center">
            Max 5 heroes per guild
          </p>
        </div>
      </div>
    );
  }

  // ─── GUILD DASHBOARD STATE ───────────────────────────────
  const { guild, members, isOwner } = guildData;
  const progressPercent = ((20000 - guild.boss_hp_remaining) / 20000) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 pb-20">
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} onInvite={handleInvite} />

      <div className="relative rounded-[2.5rem] border border-white/5 overflow-hidden bg-forge-card p-10 flex items-center justify-between">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-forge-accent/20 to-forge-secondary/40 border border-white/10 flex items-center justify-center shadow-xl">
            <Shield size={48} className="text-white drop-shadow-glow" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-500">
                Guild Shield Active
              </span>
              <span className="text-[10px] font-bold text-white/30">{members.length}/5 Members</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight">{guild.name}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all text-sm shadow-lg shadow-white/5"
          >
            + Invite Member
          </button>
          <button
            onClick={handleLeave}
            className="px-8 py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/20 transition-all text-sm"
          >
            {isOwner ? 'Disband Guild' : 'Leave Guild'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Boss Battle */}
        <div className="col-span-2 glass-card p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-500 font-bold">
              <Target size={20} />
              <span className="tracking-tight">Weekly Boss Battle</span>
            </div>
            <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
              <Clock size={14} /> Resets Monday
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-6 font-display">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-8xl drop-shadow-glow">
              {guild.boss_hp_remaining <= 0 ? '💀' : '🐉'}
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl font-black">{guild.boss_hp_remaining <= 0 ? 'Dragon Defeated!' : 'The Procrastination Dragon'}</h3>
              <p className="text-white/40 text-sm mt-1">{guild.boss_hp_remaining <= 0 ? 'Good job, heroes! Gold claimed.' : 'Contribute XP to deal damage and earn gold.'}</p>
            </div>
          </div>

          {guild.boss_hp_remaining > 0 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-white/30">Boss Vitality</span>
                  <span className="text-red-400">{guild.boss_hp_remaining.toLocaleString()} HP Left</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex-1">
                  <p className="text-xs font-bold text-white/50 mb-4 uppercase tracking-wider">Invest XP to Attack</p>
                  <div className="flex gap-2">
                    {[100, 500, 1000].map(val => (
                      <button
                        key={val}
                        onClick={() => setDamageAmount(val)}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border ${damageAmount === val ? 'bg-forge-accent text-white border-forge-accent' : 'bg-white/5 text-white/40 border-white/5'}`}
                      >
                        {val} XP
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAttack}
                  className="px-10 py-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl flex flex-col items-center gap-1 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                >
                  <Swords size={28} />
                  <span className="uppercase text-[10px] tracking-widest">Strike</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
              Reward: <span className="text-accent-yellow">+5 Gold Each</span>
            </div>
          </div>
        </div>

        {/* Member Roster */}
        <div className="glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-white/50 font-bold mb-2">
            <Users size={18} />
            <span>Guild Members</span>
          </div>
          <div className="flex flex-col gap-3">
            {members.map((member: any, i: number) => (
              <MemberCard key={member.id} member={member} isOwner={member.id === guild.owner_id} index={i} />
            ))}
            {members.length < 5 && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-3xl text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Open Slot
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
