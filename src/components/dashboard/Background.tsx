import React, { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';

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
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg-dark">
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
    </div>
  );
};
