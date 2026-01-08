import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const location = useLocation();
    return (
        <div className="flex h-screen bg-[#050511] font-sans text-slate-200 overflow-hidden">
            {/* Background Pattern and Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 bg-pattern-dark opacity-20"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Panel Lateral */}
            <AdminSidebar />

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto custom-scrollbar">
                <div className="p-8 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
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
