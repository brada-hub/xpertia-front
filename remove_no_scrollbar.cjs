const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Corrigiendo scroll del modal...');

    // 1. Remover no-scrollbar y agregar ID único al modal para CSS específico
    content = content.replace(
        /className="fixed inset-0 z-\[100\] bg-slate-950 overflow-y-auto no-scrollbar"/,
        'id="service-modal" className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto"'
    );
    console.log('✓ Clase no-scrollbar removida, ID agregado al modal');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Modal corregido!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
