import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import ServiceFullScreen from './ServiceFullScreen';

const services = [
  {
    id: 'consultoria',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Consultoría Estratégica',
    subtitle: 'Visión & Futuro',
    description: 'Transformamos tu visión corporativa en una estrategia tecnológica accionable. Desde la evaluación de infraestructura hasta la implementación de hojas de ruta digitales, aseguramos que cada inversión tecnológica impulse tus objetivos de negocio y escalabilidad a largo plazo.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  },
  {
    id: 'desarrollo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Desarrollo de Software',
    subtitle: 'Código de Alto Calibre',
    description: 'Ingeniería de software de clase mundial. Creamos aplicaciones web, móviles y sistemas empresariales a medida utilizando arquitecturas de microservicios y las tecnologías más modernas, garantizando rendimiento, seguridad y una experiencia de usuario impecable.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  },
  {
    id: 'ia',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Ciencia de Datos & IA',
    subtitle: 'Inteligencia Aplicada',
    description: 'Convierte tus datos en tu activo más valioso. Implementamos modelos de Machine Learning, automatización inteligente y análisis predictivo para optimizar la toma de decisiones, predecir tendencias de mercado y automatizar procesos operativos complejos.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  },
  {
    id: 'marketing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: 'Marketing Digital',
    subtitle: 'Crecimiento & Alcance',
    description: 'Impulsa tu presencia digital y maximiza tu ROI. Ofrecemos gestión integral de campañas, SEO/SEM avanzado, marketing de contenidos y estrategias de crecimiento para conectar tu marca con la audiencia correcta en el momento perfecto.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  },
  {
    id: 'seguridad',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.564-4.14C5.7 4.295 8.656 2.373 12.062 2.373a9.8 9.8 0 014.288.98M9 4.868L6.012 3m0 0l2.988 1.868" />
      </svg>
    ),
    title: 'Redes y Ciberseguridad',
    subtitle: 'Protección Total',
    description: 'Protección integral para tu ecosistema digital. Desplegamos estrategias de defensa en profundidad, desde pruebas de penetración y auditorías de seguridad hasta la implementación de centros de operaciones de seguridad y respuesta a incidentes en tiempo real.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  },
  {
    id: 'diseno',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Diseño Web & Plataformas',
    subtitle: 'Experiencias Científicas',
    description: 'Diseño centrado en el humano que cautiva y convierte. Creamos experiencias digitales intuitivas y sistemas de gestión de contenido (CMS) optimizados, especializándonos también en plataformas académicas y revistas científicas de alto impacto.',
    color: 'from-cyan-500 via-teal-500 to-blue-600'
  }
];

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);

  // Event listener para abrir modal desde dropdown del navbar
  useEffect(() => {
    const handleOpenServiceModal = (e) => {
      setSelectedServiceId(e.detail.service);
      setFullscreenOpen(true);
    };
    
    window.addEventListener('open-service-modal', handleOpenServiceModal);
    return () => window.removeEventListener('open-service-modal', handleOpenServiceModal);
  }, []); // Start focused on the second item or purely center

  const handleCardClick = (index, id) => {
    if (activeIndex === index) {
      setSelectedServiceId(id);
      setFullscreenOpen(true);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <section ref={sectionRef} id="servicios" className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-transparent overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mb-10">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 md:mb-4 block">Nuestras Capacidades</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400">Digital.</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto">
              Soluciones integrales diseñadas para el crecimiento. Haz clic en una tarjeta para expandir los detalles.
            </p>
          </motion.div>
        </div>

        {/* Grid de Servicios */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm cursor-pointer group hover:border-cyan-500/50 hover:bg-white/[0.06] transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setFullscreenOpen(true);
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

                <div className="p-6 md:p-8 relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-7 h-7">
                      {service.icon}
                    </div>
                  </div>

                  {/* Subtitle */}
                  <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase mb-2 block">
                    {service.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-cyan-400 font-semibold group/cta cursor-pointer hover:text-cyan-300 transition-colors">
                    <span className="mr-2 text-sm uppercase tracking-wider">Ver más</span>
                    <svg className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${service.color} blur-xl opacity-20`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceFullScreen
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        service={selectedServiceId}
      />
    </>
  );
};

export default Services;