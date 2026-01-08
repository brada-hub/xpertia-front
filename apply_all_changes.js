const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

console.log('Iniciando modificaciones...');

// 1. Agregar import de ScrollIndicator y useState
if (!content.includes('ScrollIndicator')) {
    content = content.replace(
        "import { useEffect } from 'react';",
        "import { useEffect, useState } from 'react';\nimport { ScrollIndicator } from './ScrollIndicator';"
    );
    console.log('✓ Import de ScrollIndicator agregado');
}

// 2. Agregar estado activeSection
if (!content.includes('activeSection')) {
    content = content.replace(
        'const ServiceFullScreen = ({ isOpen, onClose, service }) => {',
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
        'if (!service || !serviceData[service]) return null;',
        serviceImagesCode + '\n  if (!service || !serviceData[service]) return null;'
    );
    console.log('✓ Mapeo de imágenes agregado');
}

// 4. Modificar Hero Section - buscar y reemplazar el div del hero
const oldHeroPattern = /<div className="max-w-5xl mx-auto px-6 text-center relative z-10">\s*<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">\s*\{data\.title\}\s*<\/h1>\s*<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">\s*\{data\.description\}\s*<\/p>\s*<\/div>/s;

const newHeroContent = `<div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                className="text-center md:text-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {data.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                  {data.description}
                </p>
              </motion.div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/20">
                  <img 
                    src={serviceImages[service]} 
                    alt={data.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>`;

if (content.match(oldHeroPattern)) {
    content = content.replace(oldHeroPattern, newHeroContent);
    console.log('✓ Hero section modificado con imagen');
} else {
    console.log('⚠ No se pudo modificar hero section automáticamente');
}

// 5. Agregar IDs a las secciones
content = content.replace(
    /<section className="pt-20 pb-16 bg-slate-950 relative overflow-hidden"/,
    '<section id="hero" className="pt-20 pb-16 bg-slate-950 relative overflow-hidden"'
);

content = content.replace(
    /\{\/\* Descripción General \*\/\}\s*<section className="py-16 bg-slate-950">/,
    '{/* Descripción General */}\n          <section id="intro" className="py-16 bg-slate-950">'
);

content = content.replace(
    /\{\/\* Servicios Incluidos \*\/\}\s*<section className="py-16 bg-slate-950">/,
    '{/* Servicios Incluidos */}\n          <section id="servicios" className="py-16 bg-slate-950">'
);

content = content.replace(
    /\{\/\* Beneficios \*\/\}\s*<section className="py-16 bg-slate-900\/50 relative overflow-hidden">/,
    '{/* Beneficios */}\n          <section id="beneficios" className="py-16 bg-slate-900/50 relative overflow-hidden">'
);

content = content.replace(
    /\{\/\* CTA Final \*\/\}\s*<section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white\/10">/,
    '{/* CTA Final */}\n          <section id="cta" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/10">'
);

console.log('✓ IDs agregados a las secciones');

// 6. Agregar ScrollIndicator antes del cierre del modal
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
          />`;

// Buscar el cierre del modal (antes del último </motion.div>)
const footerPattern = /(<footer className="bg-slate-950 py-12 border-t border-white\/5">[\s\S]*?<\/footer>)/;
if (content.match(footerPattern)) {
    content = content.replace(footerPattern, `$1${scrollIndicatorCode}`);
    console.log('✓ ScrollIndicator agregado');
}

// Guardar el archivo
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ Todas las modificaciones completadas exitosamente!');
