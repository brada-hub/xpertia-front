import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Diferencial = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    'Desarrollo de Software integrado con infraestructura',
    'Ciberseguridad desde el diseño inicial',
    'Inteligencia Artificial aplicada a tus procesos',
    'Arquitectura de Red escalable y robusta',
  ];

  return (
    <section id="diferencial" className="py-24 bg-transparent relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            La Ventaja XpertIA+: <span className="text-gradient">Integración Total</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            A diferencia de consultoras especializadas en un solo campo, <strong>XpertIA+ ofrece una solución
              integral</strong>. Nuestro equipo multidisciplinario domina el espectro completo: desarrollo de
            software, infraestructura de red, ciberseguridad e inteligencia artificial.
          </p>
          <p className="text-2xl text-accent font-semibold mt-8">
            Un solo socio. Una visión unificada. Resultados excepcionales.
          </p>
        </motion.div>

        <motion.div
          className="glass-panel rounded-3xl p-10 shadow-glow bg-white/[0.02]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-heading font-bold text-white mb-6">
                Ecosistema Tecnológico Completo
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-accent/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 text-accent flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <motion.div
                className="relative"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-52 h-52 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)] relative p-1">
                  <div className="w-full h-full bg-primary rounded-full flex items-center justify-center flex-col border-4 border-transparent">
                    <div className="text-6xl font-bold text-white">360°</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Solución</div>
                  </div>

                  {/* Orbiting dots */}
                  <motion.div
                    className="absolute w-4 h-4 bg-accent rounded-full shadow-[0_0_10px_var(--color-accent)]"
                    style={{ top: '10%', left: '50%' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"
                    style={{ top: '50%', right: '10%' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-center mt-6 font-semibold text-white">
                  Cobertura Completa<br />de Servicios TI
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Diferencial;
