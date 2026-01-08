import React from 'react';

// Patrón de circuitos tecnológicos para fondo
export const CircuitPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Puntos de conexión */}
                <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-cyan-400" />
                <circle cx="50" cy="30" r="1.5" fill="currentColor" className="text-teal-400" />
                <circle cx="90" cy="20" r="1.5" fill="currentColor" className="text-blue-400" />
                <circle cx="30" cy="70" r="1.5" fill="currentColor" className="text-cyan-400" />
                <circle cx="70" cy="80" r="1.5" fill="currentColor" className="text-teal-400" />

                {/* Líneas de circuito */}
                <path d="M 10 10 L 50 30" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/50" fill="none" />
                <path d="M 50 30 L 90 20" stroke="currentColor" strokeWidth="0.5" className="text-teal-400/50" fill="none" />
                <path d="M 10 10 L 30 70" stroke="currentColor" strokeWidth="0.5" className="text-blue-400/50" fill="none" />
                <path d="M 30 70 L 70 80" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/50" fill="none" />

                {/* Pequeños nodos */}
                <rect x="48" y="28" width="4" height="4" fill="currentColor" className="text-cyan-400/60" />
                <rect x="28" y="68" width="4" height="4" fill="currentColor" className="text-teal-400/60" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
);
