const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    // Leer el archivo
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Iniciando modificaciones...');

    // 1. Agregar import de ScrollIndicator y useState
    if (!content.includes('ScrollIndicator')) {
        content = content.replace(
            /import \{ useEffect \} from 'react';/,
            "import { useEffect, useState } from 'react';\nimport { ScrollIndicator } from './ScrollIndicator';"
        );
        console.log('✓ Import de ScrollIndicator agregado');
    }

    // 2. Agregar estado activeSection
    if (!content.includes('activeSection')) {
        content = content.replace(
            /const ServiceFullScreen = \(\{ isOpen, onClose, service \}\) => \{/,
            `const ServiceFullScreen = ({ isOpen, onClose, service }) => {
  const [activeSection, setActiveSection] = useState('hero');`
        );
        console.log('✓ Estado activeSection agregado');
    }

    // 3. Agregar mapeo de imágenes
    const serviceImagesCode = `
  // Mapeo de imágenes por servicio
  const serviceImages = {
    consultoria: '/images/services/consultoria.png',
    desarrollo: '/images/services/desarrollo.png',
    ia: '/images/services/ia.png',
    marketing: '/images/services/marketing.png',
    redes: '/images/services/redes.png',
    diseno: '/images/services/diseno.png',
    seguridad: '/images/services/redes.png'
  };
`;

    if (!content.includes('serviceImages')) {
        content = content.replace(
            /if \(!service \|\| !serviceData\[service\]\) return null;/,
            serviceImagesCode + '\n  if (!service || !serviceData[service]) return null;'
        );
        console.log('✓ Mapeo de imágenes agregado');
    }

    // 4. Agregar IDs a las secciones
    content = content.replace(
        /<section className="pt-20 pb-16 bg-slate-950 relative overflow-hidden"/,
        '<section id="hero" className="pt-20 pb-16 bg-slate-950 relative overflow-hidden"'
    );

    content = content.replace(
        /<section className="py-16 bg-slate-950">/g,
        function (match, offset) {
            const before = content.substring(Math.max(0, offset - 50), offset);
            if (before.includes('Descripción General')) return '<section id="intro" className="py-16 bg-slate-950">';
            if (before.includes('Servicios Incluidos')) return '<section id="servicios" className="py-16 bg-slate-950">';
            return match;
        }
    );

    content = content.replace(
        /<section className="py-16 bg-slate-900\/50 relative overflow-hidden">/,
        '<section id="beneficios" className="py-16 bg-slate-900/50 relative overflow-hidden">'
    );

    content = content.replace(
        /<section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white\/10">/,
        '<section id="cta" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/10">'
    );

    console.log('✓ IDs agregados a las secciones');

    // 5. Agregar ScrollIndicator antes del footer
    const scrollIndicatorCode = `
          <ScrollIndicator 
            activeSection={activeSection}
            onSectionClick={(sectionId) => {
              const element = document.getElementById(sectionId);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveSection(sectionId);
              }
            }}
          />

          `;

    if (!content.includes('<ScrollIndicator')) {
        content = content.replace(
            /(<footer className="bg-slate-950 py-12 border-t border-white\/5">)/,
            scrollIndicatorCode + '$1'
        );
        console.log('✓ ScrollIndicator agregado');
    }

    // Guardar el archivo
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Todas las modificaciones completadas exitosamente!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
