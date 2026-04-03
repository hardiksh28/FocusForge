import { motion } from "motion/react";
import { Check, Star, Shield, Zap, Trophy, Crown } from "lucide-react";

const plans = [
  {
    name: "Free Plan",
    price: "0",
    period: "month",
    description: "For beginners starting their productivity quest.",
    icon: <Shield className="w-6 h-6 text-white/40" />,
    features: [
      "Track up to 5 active quests",
      "Standard loot drops",
      "Basic forge customization",
      "Community guild access",
      "Mobile access",
    ],
    cta: "Start for Free",
    popular: false,
    color: "border-white/10",
    glow: "bg-white/5",
  },
  {
    name: "Hero Plan",
    price: "1",
    period: "week",
    description: "For active heroes who want advanced tools.",
    icon: <Zap className="w-6 h-6 text-forge-primary" />,
    features: [
      "Unlimited active quests",
      "Rare loot & exclusive items",
      "Advanced forge analytics",
      "Priority guild support",
      "Custom boss battle mechanics",
      "Export quest data to PDF",
    ],
    cta: "Start 7-Day Trial",
    popular: true,
    color: "border-forge-primary/50",
    glow: "bg-forge-primary/10",
  },
  {
    name: "Legend Plan",
    price: "3",
    period: "month",
    description: "For masters seeking the ultimate productivity forge.",
    icon: <Crown className="w-6 h-6 text-forge-neon" />,
    features: [
      "Everything in Hero Plan",
      "Mythic loot & legendary gear",
      "AI Productivity Coach",
      "Early access to expansions",
      "Team collaboration tools",
      "Dedicated account manager",
    ],
    cta: "Become a Legend",
    popular: false,
    color: "border-forge-neon/30",
    glow: "bg-forge-neon/5",
  },
];

import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-32 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6"
          >
            <Trophy className="w-3 h-3" /> Pricing
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Plans and Pricing
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/40 text-base sm:text-lg mb-12"
          >
            Choose a plan that fits your productivity goals, whether you're just starting your journey or scaling your legacy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/10 bg-[#111] bg-opacity-80 transition-all hover:bg-[#1a1a1a] group`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 px-4 py-1.5 bg-white rounded-full flex items-center gap-1.5 shadow-xl">
                  <Star className="w-3 h-3 text-black fill-black" />
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">Popular</span>
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/40 text-sm font-medium">/{plan.period}</span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <button
                onClick={() => {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                   navigate('/register');
                }}
                className={`w-full py-4 rounded-2xl font-bold text-sm mb-10 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 ${
                  plan.popular 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-4 flex-grow">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                  <div className="h-px flex-grow bg-white/5" />
                  Stand out features
                  <div className="h-px flex-grow bg-white/5" />
                </div>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 group/item">
                    <div className="mt-1 w-4 h-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:border-white/30 transition-colors">
                      <Check className="w-2.5 h-2.5 text-white/40 group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-sm text-white/60 group-hover/item:text-white/90 transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 text-white/20 text-xs font-medium"
        >
          Start your journey risk free — No credit card needed
        </motion.p>
      </div>
    </section>
  );
}
