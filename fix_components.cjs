const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Verificando y agregando componentes faltantes...');

    // 1. Verificar si CircuitPattern está en la sección de beneficios
    if (!content.includes('<CircuitPattern />')) {
        // Buscar la sección de beneficios y agregar CircuitPattern
        content = content.replace(
            /<section id="beneficios" className="py-16 bg-slate-900\/50 relative overflow-hidden">/,
            `<section id="beneficios" className="py-16 bg-slate-900/50 relative overflow-hidden">
            <CircuitPattern />`
        );
        console.log('✓ CircuitPattern agregado a sección de beneficios');
    } else {
        console.log('⚠ CircuitPattern ya existe');
    }

    // 2. Verificar si ScrollIndicator está antes del footer
    if (!content.includes('<ScrollIndicator')) {
        // Buscar el footer y agregar ScrollIndicator antes
        content = content.replace(
            /(<footer className="bg-slate-950 py-12 border-t border-white\/5">)/,
            `<ScrollIndicator 
            activeSection={activeSection}
            onSectionClick={(sectionId) => {
              const element = document.getElementById(sectionId);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveSection(sectionId);
              }
            }}
          />

          $1`
        );
        console.log('✓ ScrollIndicator agregado antes del footer');
    } else {
        console.log('⚠ ScrollIndicator ya existe');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Componentes verificados y agregados!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
