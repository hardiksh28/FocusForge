import { motion } from "motion/react";
import { useMemo } from "react";
import { CheckCircle2, Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    content: "FocusForge has completely changed how our team handles complex campaigns. The gamified approach keeps everyone engaged and on track."
  },
  {
    id: 2,
    content: "The boss battle summarizer is a lifesaver for long documentation. It turns hours of reading into minutes of actionable tasks."
  },
  {
    id: 3,
    content: "As a freelancer, staying motivated is hard. FocusForge makes my daily to-do list feel like an adventure I actually want to complete."
  },
  {
    id: 4,
    content: "The guild sync feature is brilliant. It's the first time our entire department has been perfectly aligned on project milestones."
  },
  {
    id: 5,
    content: "I use the momentum gauge to track my publication progress. It's incredibly satisfying to see my hard work visualized this way."
  },
  {
    id: 6,
    content: "We've seen a 30% increase in productivity since switching to FocusForge. It's more than a tool; it's a culture builder."
  },
  {
    id: 7,
    content: "The aesthetic is gorgeous and the UX is seamless. It makes the 'boring' parts of my job actually enjoyable."
  },
  {
    id: 8,
    content: "Finally, a productivity app that doesn't feel like a spreadsheet. The loot system is surprisingly effective for morale."
  },
  {
    id: 9,
    content: "The attention to detail in the interface is incredible. It's clear this was built by people who understand focus."
  },
  {
    id: 10,
    content: "FocusForge helped me manage my thesis and part-time job without burning out. The quest system is exactly what I needed."
  }
];

export default function Feedback() {
  // Shuffle and duplicate the reviews to create a seamless loop
  const duplicatedReviews = useMemo(() => {
    const shuffled = [...REVIEWS].sort(() => Math.random() - 0.5);
    return [...shuffled, ...shuffled];
  }, []);

  return (
    <section className="py-32 bg-pure-black overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-pure-black to-transparent z-10" />
      <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-pure-black to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6">
              <CheckCircle2 className="w-3 h-3 text-white/40" /> Verified Testimonials
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Trusted by <span className="text-white/30">Modern Professionals</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl">
              Join 50,000+ heroes who have transformed their workflow into a legendary journey.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-6 rounded-3xl bg-[#111] bg-opacity-80 border border-white/5">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Average Rating</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        <div className="flex gap-6 px-6 animate-marquee w-max">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="w-[400px] flex-shrink-0 p-10 rounded-[2.5rem] bg-[#111] bg-opacity-80 border border-white/10 hover:bg-[#1a1a1a] transition-all duration-500 group relative"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white text-white" />
                ))}
              </div>

              <p className="text-white/70 text-base leading-relaxed italic relative z-10">
                "{review.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
