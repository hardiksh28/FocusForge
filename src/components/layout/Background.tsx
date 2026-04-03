import { useMemo, useState, useEffect } from "react";

export default function Background() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const stars = useMemo(() => {
    return [...Array(120)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  const meteors = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 2 + 2}s`,
      delay: `${Math.random() * 20}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-pure-black">
      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {isClient && stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ 
              top: star.top, 
              left: star.left,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Meteor Stars (Stars that suddenly fall) */}
      <div className="absolute inset-0">
        {isClient && meteors.map((meteor) => (
          <div
            key={`meteor-${meteor.id}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_white] animate-meteor opacity-0"
            style={{ 
              top: meteor.top, 
              left: meteor.left,
              animationDuration: meteor.duration,
              animationDelay: meteor.delay,
            }}
          />
        ))}
      </div>

      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-forge-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-forge-neon/10 blur-[180px] rounded-full" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] blur-[200px] rounded-full" />
      </div>
    </div>
  );
}
