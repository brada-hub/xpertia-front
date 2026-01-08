import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChristmasBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const CloseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                className="fixed top-0 left-0 right-0 z-[70] bg-gradient-to-r from-cyan-900 via-secondary to-blue-900 text-white py-3 px-4 shadow-xl border-b border-white/10"
            >
                {/* Luces decorativas */}
                <div className="absolute top-0 left-0 w-full flex justify-around pointer-events-none opacity-40">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]' : 'bg-blue-300 shadow-[0_0_8px_#93c5fd]'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                    <div className="flex items-center gap-2 md:gap-4">
                        <motion.span 
                            className="text-2xl"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                            🎁
                        </motion.span>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-cyan-300">🎄 ¡Gran Promoción Navideña! 🎄</span>
                            <p className="text-sm md:text-base font-bold">
                                Descuento del <span className="text-cyan-300 text-lg md:text-xl">20%</span> en todos nuestros proyectos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.a
                            href="#contacto"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white text-cyan-900 px-5 py-1.5 rounded-full text-xs font-black uppercase hover:bg-cyan-50 transition-all hover:scale-105 shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ¡Empezar Ya!
                        </motion.a>
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Brillo dinámico */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ChristmasBanner;
