import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { submitContact } from '../utils/api';

const Contacto = () => {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'consultoria', // Default value matching the first option
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const handlePrefill = (event) => {
      const { service } = event.detail;
      if (service) {
        setFormData(prev => ({
          ...prev,
          service: service
        }));
        // Scroll to contact section
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('prefill-contact', handlePrefill);
    return () => window.removeEventListener('prefill-contact', handlePrefill);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Send to backend API
    try {
      const response = await submitContact(formData);

      if (response.success) {
        setSubmitMessage(response.message);
        setFormData({
          name: '',
          email: '',
          service: 'consultoria',
          message: '',
        });
        setErrors({});

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitMessage(response.message || 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
      }

    } catch (error) {
      console.error('Error submitting contact:', error);
      setSubmitMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <section id="contacto" className="py-24 bg-transparent relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white leading-tight">
              Hablemos de tu <br />
              <span className="text-gradient">Próximo Proyecto</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-12 leading-relaxed">
              Estamos listos para escuchar tus ideas y convertirlas en realidad.
              Contáctanos para una consultoría inicial gratuita.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors shadow-lg">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                  <p className="text-gray-400 group-hover:text-accent transition-colors">contacto@xpertia.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors shadow-lg">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Teléfono</h3>
                  <p className="text-gray-400 group-hover:text-accent transition-colors">+591 777 77777</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors shadow-lg">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Ubicación</h3>
                  <p className="text-gray-400 group-hover:text-accent transition-colors">Cochabamba, Bolivia</p>
                </div>
              </div>
            </div>

            <div className={`mt-12 p-6 bg-gradient-to-r ${isDark ? 'from-cyan-500/20' : 'from-cyan-100'} to-transparent border-l-4 border-cyan-500 rounded-r-xl`}>
              <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Horario de Atención</h4>
              <p className={isDark ? 'text-gray-300' : 'text-slate-700'}>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary-light p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* Form Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Envíanos un mensaje</h3>

            {/* Success/Error Message */}
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${submitMessage.includes('error') ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'
                  }`}
              >
                <p className="text-white text-sm">{submitMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-primary border ${errors.name ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-gray-600`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-xs ml-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-primary border ${errors.email ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-gray-600`}
                    placeholder="tucorreo@empresa.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-xs ml-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Asunto</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary border border-white/10 rounded-xl text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="consultoria">Consultoría Estratégica</option>
                  <option value="desarrollo">Desarrollo de Software</option>
                  <option value="ia">Ciencia de Datos & IA</option>
                  <option value="marketing">Marketing Digital</option>
                  <option value="seguridad">Ciberseguridad</option>
                  <option value="diseno">UX/UI & Plataformas</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Mensaje *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 bg-primary border ${errors.message ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-gray-600 resize-none`}
                  placeholder="Cuéntanos sobre tu proyecto..."
                ></textarea>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs ml-1"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;