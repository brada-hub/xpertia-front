const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'Services.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Agregando event listener para dropdown...');

    // Buscar el useEffect existente y agregar el event listener
    const useEffectPattern = /useEffect\(\(\) => \{/;

    if (content.match(useEffectPattern)) {
        // Agregar un nuevo useEffect para el event listener
        const newUseEffect = `
  // Event listener para abrir modal desde dropdown del navbar
  useEffect(() => {
    const handleOpenServiceModal = (e) => {
      setSelectedService(e.detail.service);
      setIsServiceModalOpen(true);
    };
    
    window.addEventListener('open-service-modal', handleOpenServiceModal);
    return () => window.removeEventListener('open-service-modal', handleOpenServiceModal);
  }, []);

  useEffect(() => {`;

        content = content.replace(/useEffect\(\(\) => \{/, newUseEffect);
        console.log('✓ Event listener agregado');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Services.jsx modificado exitosamente!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
