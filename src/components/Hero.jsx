import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useRef } from 'react';

const Hero = () => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      {/* Background decor */}
      <div className={`absolute inset-0 opacity-20 ${isDark ? 'bg-pattern-dark' : 'bg-pattern-light'}`} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex items-center">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-20 items-center w-full">

          {/* Columna Izquierda: Slogan y Descripción */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left relative z-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Ingeniería de </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 animate-gradient-shift bg-[length:200%_auto]">
                Software
              </span>
              <br />
              <span className={isDark ? 'text-white' : 'text-slate-900'}>
                a la Medida de Tu Visión
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              <span className="font-bold text-accent">XpertIA+:</span> Tu socio tecnológico de confianza. Transformamos ideas en soluciones digitales robustas. Desde la arquitectura de red hasta la inteligencia artificial, diseñamos ecosistemas tecnológicos que impulsan el crecimiento de tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <motion.a
                href="#contacto"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Iniciar Proyecto
              </motion.a>
            </div>
          </motion.div>

          {/* Columna Derecha: Mockups Sobrepuestos (Estilo Premium) con más desplazamiento y animaciones */}
          <div className="relative hidden lg:flex items-center justify-center h-full lg:translate-x-12 xl:translate-x-20">

            {/* Elementos decorativos de fondo para dar profundidad */}
            <motion.div
              className="absolute -z-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Pantalla Desktop (Fondo - Más Grande) */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className={`relative z-10 w-[600px] xl:w-[750px] aspect-[16/10] rounded-[1.5rem] overflow-hidden border ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white/50 border-slate-300 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]'
                } backdrop-blur-xl ${isDark ? 'shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]' : ''} md:rotate-[-1deg]`}
            >
              {/* Barra superior estilo navegador */}
              <div className={`h-8 w-full border-b flex items-center px-4 gap-1.5 ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-slate-100 border-black/5'}`}>
                <div className="w-2 h-2 rounded-full bg-red-500/30" />
                <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                <div className="w-2 h-2 rounded-full bg-green-500/30" />
              </div>

              <motion.img
                src="/unified-dashboard.png"
                alt="Desktop Dashboard"
                className="w-full h-full object-fill"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className={`absolute inset-0 bg-gradient-to-tr ${isDark ? 'from-slate-950/40' : 'from-slate-200/20'} to-transparent pointer-events-none`} />
            </motion.div>

            {/* Celular (Superpuesto) */}
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.8, x: -100, y: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, type: 'spring', damping: 15 }}
              className={`absolute z-20 bottom-0 -left-16 xl:-left-24 w-[240px] aspect-[9/19] rounded-[2.5rem] overflow-hidden border-[8px] ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
                } rotate-[2deg] hover:rotate-0 transition-transform duration-500`}
            >
              <img
                src="/unified-dashboard.png"
                alt="Mobile Dashboard"
                className="w-full h-full object-cover object-center scale-150"
              />
              {/* Notcha */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-xl" />
            </motion.div>

            {/* ⭐ Estrella Burst Gigante - 24 Puntas Afiladas */}

            {/* Floating UI Elements adicionales para más "vidilla" */}


            <motion.div
              className={`absolute bottom-40 -right-20 z-30 p-4 rounded-2xl border backdrop-blur-md shadow-xl ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-black/10'
                }`}
              animate={{
                y: [0, 20, 0],
                x: [0, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex flex-col gap-2">
                <div className="w-24 h-2 bg-accent/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    animate={{ width: ["10%", "90%", "40%", "80%"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>
                <div className="w-16 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    animate={{ width: ["30%", "60%", "20%", "75%"] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className={`w-[2px] h-12 relative overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent h-full"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;