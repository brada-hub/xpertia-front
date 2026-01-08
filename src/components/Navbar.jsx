import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detectar sección activa
      const sections = ['hero', 'pilares', 'servicios', 'proceso', 'equipo', 'contacto'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Inicio', id: 'hero' },
    { href: '#pilares', label: 'Pilares', id: 'pilares' },
    {
      href: '#servicios',
      label: 'Servicios',
      id: 'servicios',
      hasDropdown: true,
      subItems: [
        { label: 'Consultoría Estratégica', service: 'consultoria' },
        { label: 'Desarrollo de Software', service: 'desarrollo' },
        { label: 'Inteligencia Artificial', service: 'ia' },
        { label: 'Marketing Digital', service: 'marketing' },
        { label: 'Redes y Ciberseguridad', service: 'redes' },
        { label: 'UX/UI y Plataformas', service: 'diseno' }
      ]
    },
    { href: '#proceso', label: 'Proceso', id: 'proceso' },
    { href: '#equipo', label: 'Equipo', id: 'equipo' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    // Cerrar menú móvil primero
    setIsMobileMenuOpen(false);

    // Delay para permitir que el menú cierre antes de hacer scroll
    setTimeout(() => {
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  // Iconos de sol y luna para el toggle
  const SunIcon = () => (
    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  );

  const MoonIcon = () => (
    <svg className="w-3.5 h-3.5 text-indigo-900" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? `${isDark ? 'bg-primary/90' : 'bg-white/90'} backdrop-blur-lg border-b ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-lg`
        : 'bg-transparent border-b border-transparent'
        }`}
    >

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className={`flex items-center gap-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/logo_ofc.png"
              alt="Xpertia Logo"
              className="w-12 h-12 object-contain"
            />
            <img
              src="/xpertia_ofc.png"
              alt="Xpertia"
              className="h-12 md:h-10 object-contain hidden sm:block"
            />
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <motion.a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`font-medium hover:text-accent transition-colors relative text-sm uppercase tracking-wide ${activeSection === link.id
                      ? 'text-accent'
                      : isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all shadow-[0_0_10px_var(--color-accent)] ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                  </motion.a>

                  {/* Dropdown */}
                  <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl border shadow-xl transition-all duration-200 z-50 ${isDark
                    ? 'bg-primary-light/95 border-white/10'
                    : 'bg-white/95 border-gray-200'
                    } backdrop-blur-xl ${servicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <div className="py-2">
                      {link.subItems.map((item) => (
                        <button
                          key={item.service}
                          onClick={() => {
                            const event = new CustomEvent('open-service-modal', { detail: { service: item.service } });
                            window.dispatchEvent(event);
                            setServicesDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isDark
                            ? 'text-gray-300 hover:bg-white/5 hover:text-accent'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-accent'
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`font-medium hover:text-accent transition-colors relative group text-sm uppercase tracking-wide ${activeSection === link.id
                    ? 'text-accent'
                    : isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all shadow-[0_0_10px_var(--color-accent)] ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </motion.a>
              )
            ))}

            {/* Theme Toggle Switch */}
            <motion.button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-500 ${isDark
                ? 'bg-gradient-to-r from-blue-900 to-cyan-900'
                : 'bg-gradient-to-r from-amber-200 to-orange-300'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <motion.div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark
                  ? 'bg-indigo-400'
                  : 'bg-amber-500'
                  }`}
                animate={{ x: isDark ? 0 : 28 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  boxShadow: isDark
                    ? '0 0 10px rgba(129, 140, 248, 0.6)'
                    : '0 0 15px rgba(251, 191, 36, 0.8)'
                }}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </motion.div>
            </motion.button>

            <motion.a
              href="#contacto"
              onClick={(e) => handleLinkClick(e, '#contacto')}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white rounded-full font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contacto
            </motion.a>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme Toggle for Mobile */}
            <motion.button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full p-0.5 cursor-pointer transition-all duration-500 ${isDark
                ? 'bg-gradient-to-r from-blue-900 to-cyan-900'
                : 'bg-gradient-to-r from-amber-200 to-orange-300'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-400' : 'bg-amber-500'
                  }`}
                animate={{ x: isDark ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  boxShadow: isDark
                    ? '0 0 8px rgba(129, 140, 248, 0.6)'
                    : '0 0 10px rgba(251, 191, 36, 0.8)'
                }}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className={`flex flex-col gap-1.5 p-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.span
                className={`w-7 h-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className={`w-7 h-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className={`w-7 h-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className={`md:hidden overflow-hidden ${isDark ? 'bg-primary-light/95' : 'bg-white/95'} backdrop-blur-xl rounded-b-2xl border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
        >
          <div className="py-6 px-4 space-y-4 flex flex-col items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`block font-medium hover:text-accent transition-colors text-lg ${activeSection === link.id
                  ? 'text-accent'
                  : isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={(e) => handleLinkClick(e, '#contacto')}
              className="block w-full max-w-xs px-6 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white rounded-full font-semibold text-center mt-4"
            >
              Contacto
            </a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;