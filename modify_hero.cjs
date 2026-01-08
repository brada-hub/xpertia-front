const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'laragon', 'www', 'xpertia-website', 'src', 'components', 'ServiceFullScreen.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Modificando Hero Section...');

    // Buscar y reemplazar el contenido del hero
    const heroRegex = /<div className="max-w-5xl mx-auto px-6 text-center relative z-10">\s*<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">\s*\{data\.title\}\s*<\/h1>\s*<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">\s*\{data\.description\}\s*<\/p>\s*<\/div>/s;

    const newHero = `<div className="max-w-7xl mx-auto px-6 relative z-10">
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

    if (content.match(heroRegex)) {
        content = content.replace(heroRegex, newHero);
        console.log('✓ Hero section modificado con layout de 2 columnas e imagen');
    } else {
        console.log('⚠ Patrón no encontrado, intentando método alternativo...');

        // Método alternativo: buscar solo el div principal
        content = content.replace(
            /<div className="max-w-5xl mx-auto px-6 text-center relative z-10">/,
            '<div className="max-w-7xl mx-auto px-6 relative z-10">\n            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">\n              <motion.div\n                className="text-center md:text-left"\n                initial={{ opacity: 0, x: -30 }}\n                animate={{ opacity: 1, x: 0 }}\n                transition={{ duration: 0.6, delay: 0.2 }}\n              >'
        );

        // Buscar el cierre del párrafo y agregar la imagen
        const closingPattern = /(<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">\s*\{data\.description\}\s*<\/p>)\s*<\/div>/;

        content = content.replace(
            closingPattern,
            `<p className="text-xl md:text-2xl text-gray-300">
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
          </div>`
        );

        console.log('✓ Hero section modificado usando método alternativo');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('\n✅ Hero section actualizado exitosamente!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
