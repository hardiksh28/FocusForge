import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sword } from "lucide-react";
import Background from "../components/layout/Background";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login, just push to hub for demonstration
    navigate('/hub');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <Background />
      
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Realm
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] bg-opacity-90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <Sword className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back, Hero</h1>
          <p className="text-white/40 text-sm">Log in to resume your quest log</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="hero@guild.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-forge-primary hover:text-white transition-colors">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
          >
            Enter The Forge
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            Don't have a character yet?{' '}
            <Link to="/register" className="text-white font-bold hover:text-forge-primary transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
