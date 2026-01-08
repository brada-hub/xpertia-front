const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Agregando scroll tracking...');

    // Buscar el cierre del primer useEffect y agregar el scroll tracking
    const scrollTrackingCode = `
  // Tracking de scroll para actualizar sección activa
  useEffect(() => {
    if (!isOpen) return;
    
    const handleScroll = (e) => {
      const scrollContainer = e.currentTarget;
      const scrollPosition = scrollContainer.scrollTop + 300;
      
      const sections = ['cta', 'beneficios', 'servicios', 'intro', 'hero'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = scrollContainer.scrollTop + rect.top;
          
          if (scrollPosition >= absoluteTop) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    const modalContent = document.getElementById('service-modal');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);
`;

    if (!content.includes('Tracking de scroll')) {
        // Buscar el cierre del primer useEffect
        const pattern = /}, \[isOpen, onClose\]\);/;
        const match = content.search(pattern);

        if (match !== -1) {
            const insertIndex = content.indexOf('}, [isOpen, onClose]);') + '}, [isOpen, onClose]);'.length;
            content = content.slice(0, insertIndex) + scrollTrackingCode + content.slice(insertIndex);
            console.log('✓ Scroll tracking agregado');

            fs.writeFileSync(filePath, content, 'utf8');
            console.log('\n✅ Scroll tracking implementado exitosamente!');
        } else {
            console.log('⚠ No se encontró el patrón para insertar');
        }
    } else {
        console.log('⚠ Scroll tracking ya existe');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
