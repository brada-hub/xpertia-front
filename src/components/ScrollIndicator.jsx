import React, { useState, useEffect } from 'react';

export const ScrollIndicator = ({ activeSection, onSectionClick }) => {
    const sections = [
        { id: 'hero', label: 'Inicio' },
        { id: 'intro', label: 'Introducción' },
        { id: 'servicios', label: 'Servicios' },
        { id: 'beneficios', label: 'Beneficios' },
        { id: 'cta', label: 'Contacto' }
    ];

    return (
        <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col gap-3">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => onSectionClick(section.id)}
                    className={`group relative transition-all duration-300 ${activeSection === section.id
                        ? 'w-3 h-3'
                        : 'w-2 h-2'
                        }`}
                    aria-label={`Ir a ${section.label}`}
                >
                    <div className={`rounded-full transition-all duration-300 ${activeSection === section.id
                        ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                        : 'bg-white/30 group-hover:bg-white/50 group-hover:scale-110'
                        } w-full h-full`} />

                    {/* Tooltip */}
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/90 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {section.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
