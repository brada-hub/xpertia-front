import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';

const AdminLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#050511] font-sans text-slate-200 overflow-hidden relative">
            {/* Background Pattern and Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-pattern-dark opacity-10"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050511]/80 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 px-6 z-[60]">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-white/5 rounded-xl text-cyan-400"
                >
                    <FiMenu size={24} />
                </button>
                <div className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-blue-500">
                    XpertIA<span className="text-cyan-400">+</span>
                </div>
            </header>

            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Panel Lateral */}
            <AdminSidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto custom-scrollbar pt-16 lg:pt-0">
                <div className="p-4 md:p-8 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-7xl mx-auto"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
