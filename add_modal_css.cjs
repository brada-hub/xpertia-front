const fs = require('fs');
const path = require('path');

const cssFilePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'index.css');

try {
    let content = fs.readFileSync(cssFilePath, 'utf8');

    console.log('Agregando CSS para ocultar scrollbar del modal...');

    // Agregar CSS después de la clase no-scrollbar
    const cssToAdd = `
  /* Service Modal - Hide scrollbar but keep functionality */
  #service-modal::-webkit-scrollbar {
      width: 0px;
      background: transparent;
  }
  #service-modal {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }`;

    if (!content.includes('#service-modal')) {
        content = content.replace(
            /\.no-scrollbar \{\s*-ms-overflow-style: none;\s*scrollbar-width: none;\s*\}/,
            `.no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }${cssToAdd}`
        );
        console.log('✓ CSS para modal agregado');
    } else {
        console.log('⚠ CSS ya existe');
    }

    fs.writeFileSync(cssFilePath, content, 'utf8');
    console.log('\n✅ CSS actualizado!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
