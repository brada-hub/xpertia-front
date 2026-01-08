const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Aplicando correcciones finales...');

    // 1. Agregar no-scrollbar al modal
    content = content.replace(
        /className="fixed inset-0 z-\[100\] bg-slate-950 overflow-y-auto"/,
        'className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto no-scrollbar"'
    );
    console.log('✓ Clase no-scrollbar agregada al modal');

    // 2. Agregar scroll tracking después del primer useEffect
    const scrollTrackingCode = `
  // Tracking de scroll para actualizar sección activa
  useEffect(() => {
    if (!isOpen) return;
    
    const handleScroll = (e) => {
      const scrollContainer = e.currentTarget;
      const scrollPosition = scrollContainer.scrollTop + 200;
      
      const sections = ['hero', 'intro', 'servicios', 'beneficios', 'cta'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    const modalContent = document.querySelector('.fixed.inset-0.bg-slate-950.overflow-y-auto');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);
`;

    if (!content.includes('Tracking de scroll')) {
        // Buscar el cierre del primer useEffect
        const pattern = /}, \[isOpen\]\);/;
        const match = content.match(pattern);

        if (match) {
            const insertIndex = content.indexOf(match[0]) + match[0].length;
            content = content.slice(0, insertIndex) + scrollTrackingCode + content.slice(insertIndex);
            console.log('✓ Scroll tracking agregado');
        }
    } else {
        console.log('⚠ Scroll tracking ya existe');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Todas las correcciones aplicadas exitosamente!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
