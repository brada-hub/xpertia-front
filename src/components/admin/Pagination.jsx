import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all font-semibold"
            >
                ← Anterior
            </button>
            <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500 text-sm">Página</span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg font-bold border border-cyan-500/20">{currentPage}</span>
                <span className="hidden sm:inline text-slate-500 text-sm">de {totalPages}</span>
            </div>
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all font-semibold"
            >
                Siguiente →
            </button>
        </div>
    );
};

export default Pagination;
