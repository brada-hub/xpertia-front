const fs = require('fs');
const path = require('path');

const cssFilePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'index.css');

try {
    let content = fs.readFileSync(cssFilePath, 'utf8');

    console.log('Removiendo CSS que bloquea el scroll...');

    // Remover el CSS de #service-modal que está bloqueando el scroll
    content = content.replace(
        /\/\* Service Modal - Hide scrollbar but keep functionality \*\/\s*#service-modal::-webkit-scrollbar \{\s*width: 0px;\s*background: transparent;\s*\}\s*#service-modal \{\s*-ms-overflow-style: none;\s*scrollbar-width: none;\s*\}/g,
        ''
    );

    console.log('✓ CSS bloqueante removido');

    fs.writeFileSync(cssFilePath, content, 'utf8');
    console.log('\n✅ CSS corregido! El scroll debería funcionar ahora.');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
