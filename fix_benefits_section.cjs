const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Corrigiendo sección de beneficios...');

    // La sección de beneficios necesita tener id="beneficios", relative y overflow-hidden
    // Buscar la sección actual y reemplazarla
    const oldBenefits = /<section className="py-16 bg-slate-900\/50">\s*<CircuitPattern \/>/;
    const newBenefits = `<section id="beneficios" className="py-16 bg-slate-900/50 relative overflow-hidden">
            <CircuitPattern />`;

    if (content.match(oldBenefits)) {
        content = content.replace(oldBenefits, newBenefits);
        console.log('✓ Sección de beneficios corregida con ID y posicionamiento');
    } else {
        // Intentar otro patrón
        content = content.replace(
            /<section className="py-16 bg-slate-900\/50">/,
            '<section id="beneficios" className="py-16 bg-slate-900/50 relative overflow-hidden">'
        );
        console.log('✓ Sección de beneficios actualizada');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Correcciones aplicadas!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
