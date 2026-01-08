import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Snowflake = ({ delay, duration, left, size, isDark }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-[50]"
      style={{ left: `${left}%`, top: -20, willChange: 'transform' }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{ 
        y: '100vh', 
        opacity: [0, 0.7, 0.7, 0],
        rotate: 360,
        x: [0, 30, -20, 10, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
        x: {
          duration: duration / 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <div 
        className={`${isDark ? 'text-white/70' : 'text-cyan-500/60'}`}
        style={{ fontSize: `${size}px` }}
      >
        ❄
      </div>
    </motion.div>
  );
};

const Snowfall = () => {
  const { isDark } = useTheme();
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generar copos de nieve con propiedades aleatorias
    const flakes = [];
    const numFlakes = 40; // Cantidad optimizada de copos

    for (let i = 0; i < numFlakes; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 7, // Entre 8 y 15 segundos
        size: 10 + Math.random() * 16, // Entre 10px y 26px
      });
    }

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          left={flake.left}
          delay={flake.delay}
          duration={flake.duration}
          size={flake.size}
          isDark={isDark}
        />
      ))}
    </div>
  );
};

export default memo(Snowfall);
