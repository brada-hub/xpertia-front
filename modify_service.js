const fs = require('fs');

// Leer el archivo
const filePath = 'c:\\laragon\\www\\xpertia-website\\src\\components\\ServiceFullScreen.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar import de ScrollIndicator
if (!content.includes('ScrollIndicator')) {
    content = content.replace(
        "import { CircuitPattern } from './CircuitPattern';",
        "import { CircuitPattern } from './CircuitPattern';\nimport { ScrollIndicator } from './ScrollIndicator';"
    );
}

// 2. Agregar mapeo de imágenes
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
}

// Guardar
fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Archivo modificado exitosamente');
