const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'Navbar.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Modificando Navbar para agregar dropdown...');

    // 1. Agregar estado para dropdown después de los otros estados
    if (!content.includes('servicesDropdownOpen')) {
        content = content.replace(
            /const \[activeSection, setActiveSection\] = useState\('hero'\);/,
            `const [activeSection, setActiveSection] = useState('hero');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);`
        );
        console.log('✓ Estado servicesDropdownOpen agregado');
    }

    // 2. Modificar el mapeo de navLinks para incluir dropdown en servicios
    const navLinksPattern = /const navLinks = \[\s*\{ href: '#hero', label: 'Inicio', id: 'hero' \},\s*\{ href: '#pilares', label: 'Pilares', id: 'pilares' \},\s*\{ href: '#servicios', label: 'Servicios', id: 'servicios' \},/;

    const newNavLinks = `const navLinks = [
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
    },`;

    if (content.match(navLinksPattern)) {
        content = content.replace(navLinksPattern, newNavLinks);
        console.log('✓ navLinks modificado con dropdown');
    }

    // 3. Modificar el renderizado del menú desktop para incluir dropdown
    // Buscar el map de navLinks en desktop menu
    const desktopMenuPattern = /{navLinks\.map\(\(link, index\) => \(\s*<motion\.a/;

    if (content.match(desktopMenuPattern)) {
        // Reemplazar el contenido del map
        const oldMapContent = /{navLinks\.map\(\(link, index\) => \(\s*<motion\.a[\s\S]*?<\/motion\.a>\s*\)\)}/;

        const newMapContent = `{navLinks.map((link, index) => (
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
                    className={\`font-medium hover:text-accent transition-colors relative text-sm uppercase tracking-wide \${
                      activeSection === link.id 
                        ? 'text-accent' 
                        : isDark ? 'text-gray-300' : 'text-gray-600'
                    }\`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.label}
                    <span className={\`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all shadow-[0_0_10px_var(--color-accent)] \${
                      activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }\`} />
                  </motion.a>
                  
                  {/* Dropdown */}
                  <div className={\`absolute top-full left-0 mt-2 w-64 rounded-xl border shadow-xl transition-all duration-200 z-50 \${
                    isDark 
                      ? 'bg-primary-light/95 border-white/10' 
                      : 'bg-white/95 border-gray-200'
                  } backdrop-blur-xl \${
                    servicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }\`}>
                    <div className="py-2">
                      {link.subItems.map((item) => (
                        <button
                          key={item.service}
                          onClick={() => {
                            const event = new CustomEvent('open-service-modal', { detail: { service: item.service } });
                            window.dispatchEvent(event);
                            setServicesDropdownOpen(false);
                          }}
                          className={\`w-full text-left px-4 py-2.5 text-sm transition-colors \${
                            isDark 
                              ? 'text-gray-300 hover:bg-white/5 hover:text-accent' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-accent'
                          }\`}
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
                  className={\`font-medium hover:text-accent transition-colors relative group text-sm uppercase tracking-wide \${
                    activeSection === link.id 
                      ? 'text-accent' 
                      : isDark ? 'text-gray-300' : 'text-gray-600'
                  }\`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                  <span className={\`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all shadow-[0_0_10px_var(--color-accent)] \${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }\`} />
                </motion.a>
              )
            ))}`;

        content = content.replace(oldMapContent, newMapContent);
        console.log('✓ Dropdown agregado al menú desktop');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Navbar modificado exitosamente con dropdown!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
