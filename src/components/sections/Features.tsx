import { motion, AnimatePresence } from "motion/react";
import { Check, Users, Zap, Sword, Trophy, Folder, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const NOTIFICATIONS = [
  { id: 1, name: "Lena Hoffman", action: "Marked UI quest as approved", time: "Just now", avatar: "https://ui-avatars.com/api/?name=Lena+Hoffman&background=random" },
  { id: 2, name: "Julian Perez", action: "Commented on boss battle", time: "2m ago", avatar: "https://ui-avatars.com/api/?name=Julian+Perez&background=random" },
  { id: 3, name: "Caitlyn Brooks", action: "Added a new loot file", time: "5m ago", avatar: "https://ui-avatars.com/api/?name=Caitlyn+Brooks&background=random" },
  { id: 4, name: "Marcus Thorne", action: "Joined the Focus Guild", time: "12m ago", avatar: "https://ui-avatars.com/api/?name=Marcus+Thorne&background=random" },
  { id: 5, name: "Sarah Chen", action: "Completed Daily Quest", time: "20m ago", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=random" },
  { id: 6, name: "Alex Rivera", action: "Started a new raid", time: "45m ago", avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random" },
];

export default function Features() {
  const [activeNotifications, setActiveNotifications] = useState(NOTIFICATIONS.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotifications(prev => {
        // Find the index of the current "newest" notification
        const currentIndex = NOTIFICATIONS.findIndex(n => n.id === prev[0].id);
        // Get the next one in the sequence
        const nextIndex = (currentIndex + 1) % NOTIFICATIONS.length;
        const nextNotif = NOTIFICATIONS[nextIndex];
        
        // To avoid duplicates, we take the next notification and 
        // the previous ones that aren't the same as the next one
        const filteredPrev = prev.filter(n => n.id !== nextNotif.id);
        return [nextNotif, ...filteredPrev.slice(0, 2)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Everything you need to <br />
            <span className="text-white/30">stay ahead each day</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/40 text-lg"
          >
            Explore the powerful tools that enhance productivity, streamline questing, and help your guild stay organized every day.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {/* Card 1: Daily Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 p-8 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 flex flex-col h-full group hover:bg-[#1a1a1a] transition-all"
          >
            <div className="relative h-48 mb-8 bg-white/[0.02] rounded-3xl overflow-hidden flex items-end justify-center gap-2 p-6 border border-white/5">
              <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                <Zap className="w-3 h-3 text-black fill-black" />
                <span className="text-[10px] font-black text-black uppercase">Productivity boosted!</span>
              </div>
              {[40, 60, 45, 90, 55, 70, 50].map((h, i) => (
                <motion.div
                  key={`bar-${i}`}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className={`w-full rounded-t-lg ${i === 3 ? 'bg-white' : 'bg-white/10'}`}
                />
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Your daily progress, at a glance</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              See how focus time, completed quests, and key actions build momentum.
            </p>
          </motion.div>

          {/* Card 2: Sync with Guild */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-4 p-8 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 flex flex-col h-full group hover:bg-[#1a1a1a] transition-all overflow-hidden"
          >
            <div className="h-48 mb-8 bg-white/[0.02] rounded-3xl p-6 flex flex-col gap-3 border border-white/5 relative">
              <AnimatePresence mode="popLayout">
                {activeNotifications.map((item) => (
                  <motion.div 
                    key={`notif-${item.id}`}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 shrink-0"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-bold text-white">{item.name}</span>
                        <span className="text-[8px] text-white/30">{item.time}</span>
                      </div>
                      <p className="text-[9px] text-white/50 truncate">{item.action}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Stay in sync with your guild</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Track comments, quest updates, and raids as they happen, without switching tools.
            </p>
          </motion.div>

          {/* Card 3: Big Bosses Summarized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 lg:col-span-4 p-8 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 flex flex-col h-full group hover:bg-[#1a1a1a] transition-all"
          >
            <div className="h-48 mb-8 bg-white/[0.02] rounded-3xl relative flex items-center justify-center overflow-hidden border border-white/5">
              <div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] animate-pulse-scale" 
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                  <div 
                    className="px-3 py-1.5 bg-white/10 rounded-full border border-white/10 text-[8px] font-bold text-white flex items-center gap-2 animate-opacity-cycle"
                  >
                    <Zap className="w-2.5 h-2.5 text-white" /> 3 new messages
                  </div>
                </div>
                <button
                  className="px-6 py-3 bg-white text-black rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Summarize
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Big bosses, summarized</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Turn multiple sub-tasks, messages, and deadlines into one clear battle plan.
            </p>
          </motion.div>

          {/* Card 4: Loot Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-6 p-8 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 flex flex-col h-full group hover:bg-[#1a1a1a] transition-all"
          >
            <div className="h-64 mb-8 bg-white/[0.02] rounded-3xl flex items-center justify-center relative overflow-hidden border border-white/5">
              <div
                className="relative animate-float"
              >
                <Folder className="w-32 h-32 text-white opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Loot, right where work happens</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Attach rewards and items directly to quests so motivation never gets lost.
            </p>
          </motion.div>

          {/* Card 5: Momentum Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-6 p-8 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 flex flex-col h-full group hover:bg-[#1a1a1a] transition-all"
          >
            <div className="h-64 mb-8 bg-white/[0.02] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border border-white/5">
              <div className="absolute top-6 right-6 bg-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                <Trophy className="w-3 h-3 text-black fill-black" />
                <span className="text-[10px] font-black text-black uppercase">Milestone Reached!</span>
              </div>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="96" cy="96" r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="502.4"
                    initial={{ strokeDashoffset: 502.4 }}
                    whileInView={{ strokeDashoffset: 502.4 * (1 - 0.41) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-white"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">41%</span>
                  <div className="mt-2 px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white/60">
                    +4% vs. last month
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Momentum you can measure</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Track progress over time and see how wins compound into real-world results.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

