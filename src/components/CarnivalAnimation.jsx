import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

const ConfettiPiece = ({ left, delay, duration, size, color, shape }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-[5]"
      style={{ left: `${left}%`, top: -100, perspective: '1000px' }}
      initial={{ y: -100, opacity: 0, rotateX: 0, rotateY: 0 }}
      animate={{ 
        y: '105vh', 
        opacity: [0, 1, 1, 0.8, 0],
        rotateX: [0, 360, 720],
        rotateY: [0, 720, 1440],
        x: [0, 35, -35, 15, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
        x: {
          duration: duration / 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {shape === 'diablada' ? (
        <img 
          src="/diablada.png" 
          alt="Diablada" 
          style={{ width: size * 7, height: 'auto', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }} 
        />
      ) : (
        <div 
          style={{ 
            width: size, 
            height: shape === 'rect' ? size * 0.4 : size, 
            backgroundColor: color,
            borderRadius: shape === 'circle' ? '50%' : '2px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
          }}
        />
      )}
    </motion.div>
  );
};

const CarnivalAnimation = () => {
  const [elements, setElements] = useState([]);
  
  const colors = [
    '#E71D36', // Rojo Bolivia
    '#FFC857', // Amarillo Bolivia
    '#2EC4B6', // Verde Carnaval
    '#7209B7', // Violeta Rey
    '#FFD700', // Dorado
    '#F72585'  // Rosa vibrante
  ];

  useEffect(() => {
    const confettiCount = 80;
    
    const newElements = Array.from({ length: confettiCount }).map((_, i) => ({
      id: `c-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 5 + Math.random() * 8,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      // Solo diablada o confeti normal
      shape: i % 10 === 0 ? 'diablada' : ['circle', 'rect', 'square'][Math.floor(Math.random() * 3)]
    }));

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {elements.map((el) => (
        <ConfettiPiece key={el.id} {...el} />
      ))}
    </div>
  );
};

export default memo(CarnivalAnimation);
