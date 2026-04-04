import React, { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

const FallingStar: FC = () => {
  const [star, setStar] = useState<{ x: number; angle: number; id: number } | null>(null);

  useEffect(() => {
    const trigger = () => {
      if (star) return;
      const id = Math.random();
      setStar({
        id,
        x: Math.random() * 100,
        angle: (Math.random() - 0.5) * 10,
      });
      setTimeout(() => setStar(null), 1500);
    };

    const interval = setInterval(() => {
      trigger();
    }, 10000);

    return () => clearInterval(interval);
  }, [star]);

  if (!star) return null;

  return (
    <motion.div
      key={star.id}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: '110vh',
        x: 110 * Math.tan(star.angle * Math.PI / 180) + 'vh',
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: 1.2, ease: "easeIn" }}
      style={{
        position: 'absolute',
        left: `${star.x}%`,
        width: '1px',
        height: '100px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
        filter: 'blur(0.5px)',
        transform: `rotate(${star.angle}deg)`,
        zIndex: -1,
      }}
    />
  );
};

export const StarBackground: FC = () => {
  const { activeTheme, colors } = useTheme();
  const [stars] = useState(() => 
    Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-forge-bg transition-colors duration-1000">
      
      {/* 1. Solar Light Theme Effects */}
      {activeTheme === 'solar-light' && (
        <>
          <div className="absolute inset-0 bg-grid opacity-20" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-forge-accent opacity-20"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-forge-secondary opacity-20"
          />
        </>
      )}

      {/* 2. Cyber Dark Theme Effects */}
      {activeTheme === 'cyber-dark' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.05)_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-forge-accent shadow-[0_0_40px_10px_var(--forge-accent)]"
          />
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 rounded-full bg-forge-secondary shadow-[0_0_30px_8px_var(--forge-secondary)]"
          />
          
          {/* Neon Lines */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-forge-accent/30 to-transparent shadow-[0_0_20px_var(--forge-accent)]" />
        </>
      )}

      {/* 3. Base Dynamic Theme Glow (applied to other themes) */}
      {!['solar-light', 'cyber-dark', 'starfield'].includes(activeTheme) && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${colors.accent + '10'} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.5
          }}
        />
      )}
      
      {/* 4. Starfield Theme (and Default) */}
      {activeTheme === 'starfield' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)] opacity-50" />
          {stars.map(star => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                boxShadow: star.size > 1.2 ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}
          <FallingStar />
        </>
      )}
    </div>
  );
};
