import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, memo } from "react";
import { useTheme } from "../context/ThemeContext";

const AnimatedBackground = () => {
    const { isDark } = useTheme();
    
    // 1. Creamos valores de movimiento para X e Y
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. Suavizamos el movimiento (Spring) para que no sea brusco
    const springConfig = { damping: 25, stiffness: 100 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Calculamos la posición relativa al centro de la pantalla
            const { clientX, clientY } = e;
            const moveX = clientX - window.innerWidth / 2;
            const moveY = clientY - window.innerHeight / 2;
            
            // Dividimos por un factor (ej. 20) para que el movimiento sea sutil
            mouseX.set(moveX / 25);
            mouseY.set(moveY / 25);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Orb 1 - Reacciona al mouse */}
            <motion.div 
                className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] transition-colors duration-700 ${
                    isDark ? 'bg-secondary/10' : 'bg-indigo-400/20'
                }`}
                style={{ 
                    x: springX, 
                    y: springY,
                    willChange: "transform" 
                }}
                animate={{ 
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Orb 2 - Reacciona al mouse en sentido opuesto (opcional) */}
            <motion.div 
                className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-700 ${
                    isDark ? 'bg-accent/10' : 'bg-cyan-400/15'
                }`}
                style={{ 
                    x: useSpring(useMotionValue(0), springConfig),
                    y: useSpring(useMotionValue(0), springConfig),
                    willChange: "transform" 
                }}
                animate={{ 
                    scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Orb 3 - Extra para modo claro */}
            {!isDark && (
                <motion.div 
                    className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-purple-300/10 blur-[100px]"
                    animate={{ 
                        scale: [1, 1.15, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
            )}
            
            {/* Grid de textura (SVG Noise) */}
            <div 
                className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
        </div>
    );
};

export default memo(AnimatedBackground);