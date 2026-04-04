import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sword } from "lucide-react";
import { StarBackground as Background } from "../components/dashboard/Background";
import { api } from '../lib/api';

// Google Sign-In client ID from environment
const GOOGLE_CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            theme: 'filled_black', 
            size: 'large', 
            width: '100%',
            shape: 'pill',
            text: 'continue_with',
          }
        );
      }
    };
    document.body.appendChild(script);
    return () => { 
      if (document.body.contains(script)) {
        document.body.removeChild(script); 
      }
    };
  }, [GOOGLE_CLIENT_ID]);

  const handleGoogleResponse = async (response: any) => {
    setError("");
    setIsLoading(true);
    try {
      await api.auth.googleLogin({
        credential: response.credential
      });
      navigate('/hub');
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await api.auth.login({ email, password });
      navigate('/hub');
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-forge-bg text-forge-text">
      <Background />
      
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Realm
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <Sword className="w-6 h-6 text-forge-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-forge-text mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/40 text-sm">Resume your journey through the forge</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-forge-accent hover:text-white transition-colors">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-forge-accent text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-forge-accent/20"
          >
            {isLoading ? 'Connecting...' : 'Enter The Forge'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-[10px] text-white/30 font-black uppercase">Identity Verification</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="flex flex-col gap-4">
          <div id="google-signin-btn" className="flex justify-center transition-all hover:scale-[1.01]"></div>
          
          {!GOOGLE_CLIENT_ID && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold text-center uppercase tracking-widest leading-relaxed">
              Missing VITE_GOOGLE_CLIENT_ID in .env
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            First time in the forge?{' '}
            <Link to="/register" className="text-forge-accent font-black hover:underline transition-colors">
              Found a Character
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
