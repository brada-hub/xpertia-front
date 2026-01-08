import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Equipo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const team = [
    {
      initials: 'JC',
      // name: 'Ing. Jose James Claure Ricaldi',
      role: 'Director de Estrategia y Consultoría (CEO)',
      description: 'Lidera la visión de XpertIA+, sirviendo como el principal Asesor Informático en Negocios. Su enfoque es alinear estratégicamente la tecnología con los objetivos de crecimiento del cliente.',
    },
    {
      initials: 'AC',
      // name: 'Msc. Ariel Denys Cámara Arze',
      role: 'Director Técnico (CTO) y Arquitecto de Soluciones',
      description: 'Experto en el diseño y construcción de arquitecturas sólidas. Combina su maestría en Redes Informáticas con su rol como Desarrollador Full-Stack.',
    },
    {
      initials: 'HR',
      // name: 'Ing. Harold Marco Antonio Rojas Torres',
      role: 'Líder de Calidad y Desarrollo de Software',
      description: 'Es el garante de la excelencia. Su especialización en QUAS (Quality Assurance Systems) asegura que cada línea de código sea robusta y segura.',
    },
    {
      initials: 'JM',
      // name: 'Ing. Juan Jose Mamani Via',
      role: 'Especialista en Integración de IA y Desarrollo Senior',
      description: 'Se enfoca en el futuro de las soluciones. Como Desarrollador Full-Stack y Especialista en IA, incorpora inteligencia artificial y automatización avanzada.',
    },
    {
      initials: 'GM',
      // name: 'Msc. Gustavo Magariños Camacho',
      role: 'Especialista Líder en Ciberseguridad y Auditoría',
      description: 'Responsable de la protección de los activos digitales. Su expertise en Ciberseguridad lo convierte en el pilar para diseñar sistemas resilientes.',
    },
    {
      initials: 'BP',
      // name: 'Brayan David Padilla Siles',
      role: 'Desarrollador Frontend (Especialista en Interfaces)',
      description: 'Especialista en desarrollo frontend y experiencia de usuario. Domina las tecnologías modernas de interfaces web, creando aplicaciones reactivas e intuitivas.',
    },
    {
      initials: 'JS',
      // name: 'Juan Pablo Sandagorda',
      role: 'Desarrollador Backend (Especialista en Arquitectura de Datos)',
      description: 'Experto en desarrollo backend y arquitectura de bases de datos. Diseña y construye APIs robustas y sistemas escalables de alto rendimiento.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="equipo" className="py-16 md:py-24 bg-transparent relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-10 md:mb-16 px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 md:mb-4">
            La Experiencia Detrás de <span className="text-gradient">XpertIA+</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-4xl mx-auto">
            En XpertIA+, la experiencia es la base de cada solución. Nuestro equipo multidisciplinario combina la
            visión estratégica con la maestría técnica para impulsar su transformación digital.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 md:p-8 group hover:border-accent/40 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] xl:w-[calc(25%-1.5rem)] flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold text-white shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {member.initials}
              </motion.div>
              <h4 className="text-center font-heading font-bold text-white mb-1 md:mb-2 text-base md:text-lg group-hover:text-accent transition-colors">
                {member.name}
              </h4>
              <p className="text-center text-accent/80 font-semibold mb-3 md:mb-4 text-xs md:text-sm">
                {member.role}
              </p>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed text-center">
                {member.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Equipo;
