import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Sword } from "lucide-react";
import { StarBackground as Background } from "../components/dashboard/Background";
import { api } from "../lib/api";

const GOOGLE_CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: any;
  }
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("🦊");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Sign-In for "Quick Start"
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true; script.defer = true;
    script.onload = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: true,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-register-btn'),
          { theme: 'filled_black', size: 'large', width: '100%', shape: 'pill', text: 'signup_with' }
        );
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, [GOOGLE_CLIENT_ID]);

  const handleGoogleResponse = async (response: any) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.auth.googleLogin({ credential: response.credential });
      if (res.isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/hub');
      }
    } catch (err: any) {
      setError(err.message || "Google sign-up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setError("");
      setIsLoading(true);
      try {
        await api.auth.register({ email, password, username, avatar });
        await api.auth.login({ email, password });
        navigate('/hub');
      } catch (err: any) {
        setError(err.message || "Failed to create character");
      } finally {
        setIsLoading(false);
      }
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
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg glass-card p-12 relative z-10"
      >
        <div className="flex gap-2 mb-10 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-forge-accent w-16' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-2xl mb-6">
             <Shield className="w-6 h-6 text-forge-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-forge-text mb-2 tracking-tight">
            {step === 1 ? 'Found Character' : step === 2 ? 'Choose Avatar' : 'Guild Contract'}
          </h1>
          <p className="text-white/40 text-sm">
            {step === 1 ? 'Tell us your hero name' : step === 2 ? 'Select your digital representation' : 'Finalize your credentials'}
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Character Name</label>
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ShadowWalker"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="px-4 text-[10px] text-white/30 font-black uppercase">Instant Start</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
              
              <div id="google-register-btn" className="flex justify-center"></div>
              {!GOOGLE_CLIENT_ID && <p className="text-[10px] text-amber-500/50 text-center uppercase font-bold">Google Auth Pending Config</p>}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-3 gap-4">
              {['🦊', '🐼', '🐯', '🦁', '🦉', '🐺'].map((emoji) => (
                <button
                  type="button" key={emoji} onClick={() => setAvatar(emoji)}
                  className={`aspect-square border rounded-2xl flex items-center justify-center text-4xl transition-all ${
                    avatar === emoji ? 'bg-forge-accent/20 border-forge-accent ring-4 ring-forge-accent/20' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
               <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Security Key</label>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button 
                type="button" onClick={() => setStep(step - 1)}
                className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            <button 
              type="submit" disabled={isLoading}
              className="flex-grow bg-forge-accent text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-forge-accent/20"
            >
              {isLoading ? 'Creating...' : (step < 3 ? 'Continue' : 'Enter The Forge')}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-8">
          <p className="text-sm text-white/40">
            Already verified?{' '}
            <Link to="/login" className="text-forge-accent font-black hover:underline transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
