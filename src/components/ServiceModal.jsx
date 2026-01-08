import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const ServiceModal = ({ isOpen, onClose, service }) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!service) return null;

  const serviceDetails = {
    consultoria: {
      title: 'Asesoramiento Estratégico y Transformación Digital',
      description: 'Más que consultores, somos arquitectos de tu futuro digital. Analizamos el ADN de tu empresa para diseñar estrategias tecnológicas que no solo resuelven problemas actuales, sino que desbloquean nuevas oportunidades de negocio. Alineamos TI con los objetivos corporativos para maximizar el retorno de inversión y asegurar la sostenibilidad a largo plazo.',
      services: [
        {
          name: 'Diagnóstico Tecnológico 360°',
          description: 'Auditoría profunda de sistemas, procesos y talento para identificar brechas de eficiencia y riesgos operativos.'
        },
        {
          name: 'Hoja de Ruta de Transformación',
          description: 'Plan maestro evolutivo con KPIs claros, priorizando iniciativas de alto impacto y bajo esfuerzo inicial (Quick Wins).'
        },
        {
          name: 'Gestión de Portafolio de Proyectos (PMO)',
          description: 'Estandarización de metodologías ágiles (Scrum, SAFe) para garantizar entregas predecibles y de calidad.'
        },
        {
          name: 'Investigación & Desarrollo (I+D)',
          description: 'Asesoría en la creación de labs de innovación internos y colaboración con entidades académicas.'
        }
      ]
    },
    desarrollo: {
      title: 'Ingeniería de Software & Arquitectura de Sistemas',
      description: 'Construimos el motor digital de tu empresa. Nuestro enfoque de ingeniería se basa en la calidad, la escalabilidad y la mantenibilidad. Desde plataformas web complejas hasta aplicaciones móviles nativas, entregamos código limpio y documentado que sirve como base sólida para el crecimiento de tu negocio.',
      services: [
        {
          name: 'Desarrollo Web Full-Stack',
          description: 'Aplicaciones SPA/PWA de alto rendimiento utilizando React, Next.js, Node.js y arquitecturas Serverless.'
        },
        {
          name: 'Soluciones Móviles Nativas & Cross-Platform',
          description: 'Desarrollo para iOS y Android utilizando Swift, Kotlin o Flutter, garantizando una experiencia nativa fluida.'
        },
        {
          name: 'Modernización de Legacy',
          description: 'Estrategias de "Strangler Fig" para migrar sistemas monolíticos antiguos a microservicios modernos sin tiempo de inactividad.'
        },
        {
          name: 'Ingeniería de Plataforma (DevOps)',
          description: 'Automatización total del ciclo de vida del software (CI/CD), infraestructura como código (IaC) y monitoreo proactivo.'
        }
      ]
    },
    ia: {
      title: 'Inteligencia Artificial & Ciencia de Datos',
      description: 'Transformamos datos brutos en ventajas competitivas. Ayudamos a las organizaciones a pasar de la intuición a la decisión basada en evidencia, implementando soluciones de IA que automatizan tareas, predicen comportamientos y personalizan la experiencia del cliente a escala masiva.',
      services: [
        {
          name: 'Machine Learning & Modelos Predictivos',
          description: 'Algoritmos personalizados para previsión de demanda, detección de fraude y segmentación dinámica de clientes.'
        },
        {
          name: 'Procesamiento de Lenguaje Natural (NLP)',
          description: 'Chatbots avanzados, análisis de sentimiento en redes sociales y extracción automática de información documental.'
        },
        {
          name: 'Business Intelligence & Dashboards',
          description: 'Visualización de datos en tiempo real (PowerBI, Tableau, Looker) para democratizar el acceso a la información.'
        },
        {
          name: 'Automatización Robótica de Procesos (RPA)',
          description: 'Bots de software que ejecutan tareas repetitivas administrativas 24/7 con cero margen de error.'
        }
      ]
    },
    marketing: {
      title: 'Marketing Digital & Growth Hacking',
      description: 'Conectamos tu marca con las personas correctas. Fusionamos creatividad con analítica de datos para diseñar ecosistemas de marketing que cubren todo el embudo de conversión. No solo buscamos "likes", buscamos leads cualificados, ventas y lealtad de marca a largo plazo.',
      services: [
        {
          name: 'Estrategia SEO/SEM Data-Driven',
          description: 'Dominio de motores de búsqueda mediante optimización técnica y campañas de pago (PPC) con optimización algorítmica de pujas.'
        },
        {
          name: 'Marketing de Contenidos & Storytelling',
          description: 'Creación de narrativas transmedia que educan y entretienen, posicionando a tu marca como autoridad en su industria.'
        },
        {
          name: 'Social Media & Community Management',
          description: 'Gestión profesional de presencia en redes (LinkedIn, Instagram, TikTok) enfocada en engagement y construcción de comunidad.'
        },
        {
          name: 'Analítica Web & Atribución',
          description: 'Configuración avanzada de Google Analytics 4 y modelos de atribución para entender el ROI exacto de cada canal.'
        }
      ]
    },
    seguridad: {
      title: 'Ciberseguridad & Resiliencia Digital',
      description: 'La seguridad no es un producto, es un proceso. Protegemos la continuidad de tu negocio mediante un enfoque de defensa en profundidad. Identificamos vulnerabilidades antes que los atacantes y diseñamos arquitecturas resilientes capaces de resistir y recuperarse de incidentes cibernéticos.',
      services: [
        {
          name: 'Hacking Ético & Pentesting',
          description: 'Simulaciones de ataques reales (Red Teaming) para poner a prueba las defensas de tu infraestructura y aplicaciones.'
        },
        {
          name: 'Arquitectura Zero Trust',
          description: 'Implementación de modelos de seguridad donde "nunca se confía, siempre se verifica", segmentando redes y accesos.'
        },
        {
          name: 'Gestión de Identidades (IAM)',
          description: 'Sistemas centralizados de autenticación (SSO, MFA) para asegurar que solo las personas correctas accedan a los datos.'
        },
        {
          name: 'Cumplimiento Normativo (Compliance)',
          description: 'Alineación de infraestructura con estándares internacionales como ISO 27001, GDPR, PCI-DSS y SOC2.'
        }
      ]
    },
    diseno: {
      title: 'Diseño UX/UI & Experiencias Digitales',
      description: 'Diseñamos para humanos. Creamos interfaces digitales que no solo son estéticamente impactantes, sino funcionalmente intuitivas. Nos especializamos en reducir la fricción cognitiva y guiar al usuario suavemente hacia los objetivos de conversión, todo mientras fortalecemos la identidad visual de tu marca.',
      services: [
        {
          name: 'Investigación de Usuarios (UX Research)',
          description: 'Entrevistas, pruebas de usabilidad y análisis de mapas de calor para entender realmente qué necesitan tus usuarios.'
        },
        {
          name: 'Sistemas de Diseño (Design Systems)',
          description: 'Creación de bibliotecas de componentes reutilizables que garantizan consistencia visual y aceleran el desarrollo.'
        },
        {
          name: 'Desarrollo de CMS Personalizados',
          description: 'Implementación de gestores de contenido (WordPress, Strapi) tailored para que tu equipo editorial vuele.'
        },
        {
          name: 'Plataformas Editoriales & Científicas',
          description: 'Sistemas OJS (Open Journal Systems) y portales académicos optimizados para indexación y visibilidad científica.'
        }
      ]
    }
  };

  const currentService = serviceDetails[service];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              className="relative bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Grid Layout for Content */}
              <div className="grid md:grid-cols-[1fr_1.5fr]">
                {/* Left Sidebar / Header Area */}
                <div className="bg-slate-950 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5">
                  <motion.h2
                    className="text-3xl md:text-3xl font-black text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentService?.title || 'Servicio'}
                  </motion.h2>

                  <motion.div
                    className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mb-8 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />

                  <motion.p
                    className="text-lg text-gray-400 mb-8 leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentService?.description}
                  </motion.p>

                  <motion.a
                    href="#contacto"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-cyan-50 transition-colors w-full md:w-auto justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Solicitar Propuesta</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </motion.a>
                </div>

                {/* Right Content Area */}
                <div className="p-8 md:p-12 bg-slate-900">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Capacidades Incluidas
                  </h3>

                  <div className="grid gap-6">
                    {currentService?.services.map((item, index) => (
                      <motion.div
                        key={index}
                        className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <h4 className="text-lg font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">{item.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;