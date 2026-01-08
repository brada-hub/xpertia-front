import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Proceso = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '1',
      title: 'Descubrimiento',
      description: 'Análisis profundo de necesidades y objetivos de negocio',
    },
    {
      number: '2',
      title: 'Arquitectura',
      description: 'Diseño de solución técnica y hoja de ruta detallada',
    },
    {
      number: '3',
      title: 'Desarrollo Ágil',
      description: 'Sprints iterativos con entregas continuas y feedback constante',
    },
    {
      number: '4',
      title: 'Calidad & Seguridad',
      description: 'Testing exhaustivo y auditorías de seguridad rigurosas',
    },
    {
      number: '5',
      title: 'Despliegue & Soporte',
      description: 'Implementación controlada y acompañamiento continuo',
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="proceso" className="py-24 bg-transparent relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 px-2">
            Metodología: Desarrollo Ágil y Transparente
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Nuestro proceso garantiza entregas continuas, calidad excepcional y comunicación constante
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariants}
            >
              <motion.div
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-white shadow-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                    '0 0 40px rgba(0, 217, 255, 0.5)',
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {step.number}
              </motion.div>
              <h4 className="text-base sm:text-lg md:text-xl font-heading font-bold text-white mb-2 md:mb-3">
                {step.title}
              </h4>
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection Line */}
        <motion.div
          className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </section>
  );
};

export default Proceso;
