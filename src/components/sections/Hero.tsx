import { motion } from "motion/react";
import { Search, ArrowRight, Zap, Sword, Trophy, Users } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Spherical Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] aspect-square max-w-[1400px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-white/[0.05] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]" />
        {/* Subtle glow at the top of the sphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-white flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8">
            FOCUS FORGE
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white/50 text-lg md:text-xl font-medium mb-12 tracking-tight"
        >
          Quests, Bosses, Loot — One platform. Infinite productivity.
        </motion.p>

        {/* Search Bar Style Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#111] bg-opacity-80 border border-white/10 rounded-full p-2 pl-6 shadow-2xl transition-all hover:border-white/20">
              <Search className="w-5 h-5 text-white/30 mr-4" />
              <input 
                type="text" 
                placeholder="Create a quest to defeat the procrastination boss..."
                className="bg-transparent border-none outline-none text-white text-sm md:text-base flex-grow placeholder:text-white/40"
              />
              <button
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: <Zap className="w-3 h-3" />, label: "Quick Quest" },
            { icon: <Sword className="w-3 h-3" />, label: "Boss Battle" },
            { icon: <Trophy className="w-3 h-3" />, label: "Loot Drop" },
            { icon: <Users className="w-3 h-3" />, label: "Guild Raid" },
          ].map((tag, i) => (
            <button
              key={`tag-${i}`}
              className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:bg-white/[0.08] active:scale-95"
            >
              {tag.icon} {tag.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

