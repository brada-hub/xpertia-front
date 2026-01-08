import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`py-12 border-t transition-colors duration-300 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="/logo_ofc.png"
              alt="Xpertia Logo"
              className="w-10 h-10 object-contain"
            />
            <img
              src="/xpertia_ofc.png"
              alt="Xpertia"
              className="h-8 object-contain"
            />
          </motion.div>

          <motion.p
            className={`mb-2 font-medium ${isDark ? 'text-white/90' : 'text-slate-700'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Tu socio tecnológico de confianza
          </motion.p>

          <motion.p
            className={`mb-6 text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >

          </motion.p>

          <motion.p
            className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            © 2025 XpertIA+. Todos los derechos reservados.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
