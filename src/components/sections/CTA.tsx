import { motion } from "motion/react";
import { Sword } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-display text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight text-white mb-8"
        >
          Ready to <br />
          <span className="text-white/30">Level Up?</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/40 font-medium mb-12 tracking-tight"
        >
          Join 50,000+ heroes who have already forged their focus. Your quest begins now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/register');
            }}
            className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-white text-black font-bold text-lg sm:text-xl rounded-full overflow-hidden transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              START YOUR QUEST <Sword className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
