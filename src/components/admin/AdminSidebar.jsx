import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiUsers, 
    FiBriefcase, 
    FiUserCheck, 
    FiMessageSquare, 
    FiLogOut, 
    FiExternalLink,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { adminLogout, getCurrentUser } from '../../utils/api';
import { useState } from 'react';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            title: 'Contactos',
            icon: <FiMessageSquare size={20} />,
            path: '/admin/dashboard',
        },
        {
            title: 'Proyectos',
            icon: <FiBriefcase size={20} />,
            path: '/admin/projects',
        },
        {
            title: 'Clientes',
            icon: <FiUsers size={20} />,
            path: '/admin/clients',
        },
        {
            title: 'Personal',
            icon: <FiUserCheck size={20} />,
            path: '/admin/personnel',
        },
    ];

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <aside className={`bg-[#050511] text-white transition-all duration-300 flex flex-col h-screen sticky top-0 border-r border-white/5 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-blue-500"
                    >
                        XpertIA<span className="text-cyan-400">+</span>
                    </motion.div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                    {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                                isActive 
                                ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/20' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                        >
                            <span className={`${isActive ? 'text-cyan-400 scale-110' : 'group-hover:text-cyan-400 transition-transform group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : ''}`}>{item.title}</span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-16 bg-[#0f1026] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                                    {item.title}
                                </div>
                            )}
                            {isActive && !isCollapsed && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User & Footer Section */}
            <div className="p-4 border-t border-white/5 space-y-2">
                {!isCollapsed && (
                    <div className="px-4 py-2 mb-2 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-cyan-500 uppercase font-black tracking-[0.2em]">Administrador</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                    </div>
                )}
                
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
                >
                    <FiExternalLink size={20} className="group-hover:text-cyan-400 transition-colors" />
                    {!isCollapsed && <span className="text-sm font-medium">Sitio Principal</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
                >
                    <FiLogOut size={20} className="group-hover:rotate-12 transition-transform" />
                    {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
