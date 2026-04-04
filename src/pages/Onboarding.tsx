import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import { Sword, Sparkles } from "lucide-react";
import { StarBackground as Background } from "../components/dashboard/Background";
import { api } from "../lib/api";

export default function Onboarding() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("🦊");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      // Pre-fill with Google name but sanitize it
      setUsername(parsed.username.split('_')[0] || "");
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.auth.updateProfile({ username, avatar });
      navigate('/hub');
    } catch (err: any) {
      setError(err.message || "Failed to finalize character");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-forge-bg text-forge-text">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card p-12 relative z-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-forge-accent/20 border border-forge-accent/30 rounded-2xl mb-8">
           <Sparkles className="w-8 h-8 text-forge-accent animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-display font-black text-forge-text mb-2 tracking-tight">Found Your Character</h1>
        <p className="text-white/40 text-sm mb-10">Welcome to the Forge, <span className="text-forge-accent font-bold">{user.email.split('@')[0]}</span>. Customize your representation below.</p>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Hero Name</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ShadowWalker"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none focus:border-forge-accent/50 transition-all text-lg font-bold shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Avatar Representation</label>
            <div className="grid grid-cols-4 gap-4">
              {['🦊', '🐼', '🐯', '🦁', '🦉', '🐺', '🐲', '⚔️'].map((emoji) => (
                <button
                  type="button" key={emoji} onClick={() => setAvatar(emoji)}
                  className={`aspect-square border-2 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 ${
                    avatar === emoji 
                      ? 'bg-forge-accent/20 border-forge-accent shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-110' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">{error}</p>}

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-forge-accent text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-xl shadow-forge-accent/20 text-lg group"
          >
            {isLoading ? 'Finalizing...' : (
              <>
                Enter The Forge <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
