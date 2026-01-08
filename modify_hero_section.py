# Script para modificar ServiceFullScreen.jsx
import re

# Leer el archivo
file_path = r'c:\laragon\www\xpertia-website\src\components\ServiceFullScreen.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar import de ScrollIndicator si no existe
if 'ScrollIndicator' not in content:
    content = content.replace(
        "import { CircuitPattern } from './CircuitPattern';",
        "import { CircuitPattern } from './CircuitPattern';\nimport { ScrollIndicator } from './ScrollIndicator';"
    )

# 2. Agregar mapeo de imágenes después de serviceData
service_images_code = """
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
"""

# Buscar donde insertar el código (después de serviceData)
if 'serviceImages' not in content:
    # Insertar después de la definición de serviceData
    content = re.sub(
        r'(if \(!service \|\| !serviceData\[service\]\) return null;)',
        service_images_code + r'\n  \1',
        content
    )

# 3. Modificar Hero Section para incluir imagen
# Buscar la sección del hero y reemplazarla con un grid de 2 columnas
old_hero = r'<div className="max-w-5xl mx-auto px-6 text-center relative z-10">'
new_hero = '<div className="max-w-7xl mx-auto px-6 relative z-10">\n            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">\n              <motion.div\n                className="text-center md:text-left"\n                initial={{ opacity: 0, x: -30 }}\n                animate={{ opacity: 1, x: 0 }}\n                transition={{ duration: 0.6, delay: 0.2 }}\n              >'

content = content.replace(old_hero, new_hero)

# Cerrar el div del texto y agregar la imagen
old_hero_close = r'</p>\n            </div>'
new_hero_close = '''</p>
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
          </div>'''

content = content.replace(old_hero_close, new_hero_close)

# Guardar el archivo
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ ServiceFullScreen.jsx modificado exitosamente")
print("✓ Import de ScrollIndicator agregado")
print("✓ Mapeo de imágenes agregado")
print("✓ Hero section modificado con layout de 2 columnas")
