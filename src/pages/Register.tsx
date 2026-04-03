import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from "lucide-react";
import Background from "../components/layout/Background";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final submit
      navigate('/hub');
    }
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
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg bg-[#111] bg-opacity-90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="flex gap-2 mb-10 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 w-12 rounded-full ${i <= step ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {step === 1 ? 'Create Character' : step === 2 ? 'Choose Class' : 'Finalize Build'}
          </h1>
          <p className="text-white/40 text-sm">
            {step === 1 ? 'What should we call you, hero?' : step === 2 ? 'Select your starting avatar icon' : 'Sign the guild charter'}
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Character Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Hero Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-3 gap-4">
              {['🦊', '🐼', '🐯', '🦁', '🦉', '🐺'].map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl hover:bg-white/10 hover:border-white/20 transition-all focus:bg-white focus:border-white focus:ring focus:ring-white/20"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
               <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Scroll Address (Email)</label>
                <input 
                  type="email" 
                  required
                  placeholder="hero@guild.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Secret Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            <button 
              type="submit"
              className="flex-grow bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
            >
              {step < 3 ? 'Continue' : 'Enter The Forge'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            Already have a character?{' '}
            <Link to="/login" className="text-white font-bold hover:text-forge-primary transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
