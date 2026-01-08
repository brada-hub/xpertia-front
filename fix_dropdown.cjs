const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'Services.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Agregando event listener para dropdown...');

    // Buscar después de los estados y antes del handleCardClick
    const pattern = /const \[activeIndex, setActiveIndex\] = useState\(1\);/;

    const eventListenerCode = `const [activeIndex, setActiveIndex] = useState(1);

  // Event listener para abrir modal desde dropdown del navbar
  useEffect(() => {
    const handleOpenServiceModal = (e) => {
      setSelectedServiceId(e.detail.service);
      setFullscreenOpen(true);
    };
    
    window.addEventListener('open-service-modal', handleOpenServiceModal);
    return () => window.removeEventListener('open-service-modal', handleOpenServiceModal);
  }, []);`;

    if (!content.includes('open-service-modal')) {
        content = content.replace(pattern, eventListenerCode);
        console.log('✓ Event listener agregado correctamente');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ Services.jsx actualizado!');
    } else {
        console.log('⚠ Event listener ya existe');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
