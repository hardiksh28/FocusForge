import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileMenuOpen(false);
    } else {
      setHidden(false);
    }
  });

  const navLinks = ["Mission", "Features"];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-12 py-6 pointer-events-none">
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="flex items-center justify-between w-full max-w-7xl bg-[#111] bg-opacity-90 border border-white/10 px-6 md:px-8 py-4 rounded-full pointer-events-auto shadow-2xl relative"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-pure-black m-[0.15em] rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <span className="relative z-10 text-[10px] font-black text-white">F</span>
          </div>
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-white">
            FocusForge
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ y: -2, color: "#fff" }}
              whileTap={{ y: 0 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-white/70 transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Link 
            to="/login"
            className="hidden xs:block text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="px-4 md:px-6 py-2 md:py-2.5 bg-white text-black text-xs md:text-sm font-bold rounded-full transition-all shadow-lg hover:scale-105 hover:bg-[#3B82F6] hover:text-white"
          >
            Start questing
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-2xl"
            >
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-lg font-bold text-white hover:text-forge-primary transition-colors py-2 border-b border-white/5"
                >
                  {item}
                </a>
              ))}
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-white hover:text-forge-accent transition-colors py-2 border-b border-white/5"
                >
                  Login
                </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}


