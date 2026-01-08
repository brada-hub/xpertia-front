const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Verificando y corrigiendo modal...');

    // Verificar si el ID está presente
    if (!content.includes('id="service-modal"')) {
        console.log('⚠ ID service-modal no encontrado, agregándolo...');

        // Buscar el motion.div del modal y agregar el ID
        content = content.replace(
            /<motion\.div\s+className="fixed inset-0 z-\[100\] bg-slate-950 overflow-y-auto"/,
            '<motion.div id="service-modal" className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto"'
        );
        console.log('✓ ID service-modal agregado');
    } else {
        console.log('✓ ID service-modal ya existe');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Verificación completada!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
