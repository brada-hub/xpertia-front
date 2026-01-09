import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUsers, 
    FiBriefcase, 
    FiUserCheck, 
    FiMessageSquare, 
    FiLogOut, 
    FiExternalLink,
    FiMenu,
    FiX,
    FiChevronLeft
} from 'react-icons/fi';
import { adminLogout, getCurrentUser } from '../../utils/api';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile side menu when route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, setIsMobileOpen]);

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

    const sidebarClasses = `
        fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 ease-in-out z-[80]
        bg-[#050511] border-r border-white/5 flex flex-col
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
    `;

    return (
        <aside className={sidebarClasses}>
            {/* Logo Section */}
            <div className="px-6 flex items-center gap-4 border-b border-white/5 h-16 lg:h-20">
                {/* Toggle / Close Button */}
                <button 
                    onClick={() => {
                        if (window.innerWidth < 1024) {
                            setIsMobileOpen(false);
                        } else {
                            setIsCollapsed(!isCollapsed);
                        }
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-cyan-400 border border-transparent hover:border-white/10"
                >
                    {window.innerWidth < 1024 ? <FiChevronLeft size={24} /> : (isCollapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />)}
                </button>

                {(!isCollapsed || isMobileOpen) && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-blue-500"
                    >
                        XpertIA<span className="text-cyan-400">+</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const showTitle = !isCollapsed || isMobileOpen;
                    
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
                            
                            {showTitle && (
                                <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : ''}`}>{item.title}</span>
                            )}
                            
                            {isCollapsed && !isMobileOpen && (
                                <div className="absolute left-16 bg-[#0f1026] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                                    {item.title}
                                </div>
                            )}
                            
                            {isActive && showTitle && (
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
            <div className={`p-4 border-t border-white/5 space-y-2 ${isCollapsed && !isMobileOpen ? 'items-center' : ''}`}>
                {(!isCollapsed || isMobileOpen) && (
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
                    {(!isCollapsed || isMobileOpen) && <span className="text-sm font-medium">Sitio Principal</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
                >
                    <FiLogOut size={20} className="group-hover:rotate-12 transition-transform" />
                    {(!isCollapsed || isMobileOpen) && <span className="text-sm font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
