const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Corrigiendo scroll y posicionamiento...');

    // 1. Ocultar scrollbar del modal y agregar scroll tracking
    // Buscar el div del contenido scrolleable y agregar clase para ocultar scrollbar
    const scrollContainerPattern = /<motion\.div\s+className="fixed inset-0 bg-slate-950 overflow-y-auto z-50"/;

    if (content.match(scrollContainerPattern)) {
        content = content.replace(
            scrollContainerPattern,
            '<motion.div className="fixed inset-0 bg-slate-950 overflow-y-auto z-50 scrollbar-hide"'
        );
        console.log('✓ Clase scrollbar-hide agregada al modal');
    }

    // 2. Agregar useEffect para tracking de scroll
    const trackingCode = `
  // Tracking de scroll para actualizar sección activa
  useEffect(() => {
    if (!isOpen) return;
    
    const handleScroll = (e) => {
      const scrollContainer = e.target;
      const scrollPosition = scrollContainer.scrollTop + 200;
      
      const sections = ['hero', 'intro', 'servicios', 'beneficios', 'cta'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetTop = scrollContainer.scrollTop + rect.top;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    const modalContent = document.querySelector('.fixed.inset-0.bg-slate-950');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);
`;

    // Buscar después del primer useEffect y agregar el tracking
    if (!content.includes('Tracking de scroll')) {
        const firstUseEffectEnd = content.indexOf('}, [isOpen]);');
        if (firstUseEffectEnd !== -1) {
            const insertPosition = firstUseEffectEnd + '}, [isOpen]);'.length;
            content = content.slice(0, insertPosition) + trackingCode + content.slice(insertPosition);
            console.log('✓ Scroll tracking agregado');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Correcciones aplicadas!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
