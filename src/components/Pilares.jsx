import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Pilares = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pilares = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Confianza',
      description: 'Relaciones transparentes y comunicación constante en cada etapa del proyecto. Construimos alianzas duraderas basadas en la honestidad y el compromiso mutuo.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Experiencia',
      description: 'Dominio técnico en arquitecturas complejas y tecnologías de vanguardia. Nuestro equipo combina años de experiencia en desarrollo, infraestructura y seguridad.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Precisión',
      description: 'Ejecución impecable con metodologías ágiles y estándares de calidad internacionales. Cada línea de código es revisada, probada y optimizada.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="pilares" className="py-16 md:py-24 bg-transparent relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-20 px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Nuestros <span className="text-gradient">Pilares</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Fundamentos sólidos que garantizan el éxito de cada proyecto tecnológico.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {pilares.map((pilar, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 md:p-8 group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-[0_0_25px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform duration-300">
                <div className="w-6 h-6 md:w-8 md:h-8 text-white">
                  {pilar.icon}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-4 group-hover:text-accent transition-colors">
                {pilar.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {pilar.description}
              </p>
            </motion.div>

          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pilares;
