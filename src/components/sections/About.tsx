import { motion, useScroll, useTransform } from "motion/react";
import { Shield, Sword, Trophy, Users, Zap, Sparkles } from "lucide-react";
import { useRef } from "react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section id="mission" ref={containerRef} className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-8">
              <Shield className="w-3 h-3" /> Our Mission
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
              Forging a <span className="text-white/40">New Era</span> of <br />
              <span className="relative inline-block">
                Epic Focus
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-white/20 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-10 leading-relaxed max-w-xl">
              At FocusForge, we believe productivity shouldn't be a chore—it should be a journey. We're building the ultimate arena where your daily tasks become legendary quests.
            </p>
          </motion.div>

          <motion.div
            style={{ y: y2, rotate }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-12 lg:mt-0"
          >
            {/* The Cosmic Forge Visual */}
            <div className="relative aspect-square w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] mx-auto">
              {/* Outer Rings */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-white/10 border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-white/5" />
              
              {/* Central Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                  <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-transparent rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                    <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Orbiting Shards */}
              {[
                { icon: <Sword className="w-4 h-4 sm:w-5 sm:h-5" />, delay: 0, top: "10%", left: "50%" },
                { icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />, delay: 1, top: "50%", left: "90%" },
                { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, delay: 2, top: "90%", left: "50%" },
                { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, delay: 3, top: "50%", left: "10%" },
              ].map((shard, i) => (
                <div
                  key={`shard-${i}`}
                  className="absolute w-10 h-10 sm:w-14 sm:h-14 bg-[#111] bg-opacity-80 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-2xl animate-shard-float"
                  style={{ top: shard.top, left: shard.left, animationDelay: `${shard.delay}s` }}
                >
                  {shard.icon}
                </div>
              ))}
            </div>
            
            {/* Floating Badge - Fixed Visibility */}
            <div
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl z-20 animate-float"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pure-black rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black text-black uppercase">Top Rated</div>
                  <div className="text-[8px] sm:text-[10px] text-black/60 font-bold">Productivity App 2026</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
