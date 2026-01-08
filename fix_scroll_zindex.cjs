const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Ajustando ScrollIndicator para mayor visibilidad...');

    // Cambiar el z-index del ScrollIndicator a z-50 para que esté por encima del modal
    content = content.replace(
        /className="fixed right-6 top-1\/2 -translate-y-1\/2 z-40 hidden lg:flex flex-col gap-3"/,
        'className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col gap-3"'
    );

    console.log('✓ Z-index del ScrollIndicator aumentado a z-[60]');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ ScrollIndicator ajustado!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
