import re

# Leer el archivo
with open(r'c:\laragon\www\xpertia-website\src\components\ServiceFullScreen.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar import de CircuitPattern
if 'CircuitPattern' not in content:
    content = content.replace(
        "import { motion, AnimatePresence } from 'framer-motion';",
        "import { motion, AnimatePresence } from 'framer-motion';\nimport { CircuitPattern } from './CircuitPattern';"
    )

# 2. Modificar la sección de beneficios
content = re.sub(
    r'(<section className="py-16 bg-slate-900/50">)',
    r'<section className="py-16 bg-slate-900/50 relative overflow-hidden">\n            <CircuitPattern />',
    content
)

# Guardar el archivo
with open(r'c:\laragon\www\xpertia-website\src\components\ServiceFullScreen.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Archivo modificado exitosamente")
