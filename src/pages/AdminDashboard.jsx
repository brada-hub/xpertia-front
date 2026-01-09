import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    adminLogout,
    getCurrentUser,
    exportContacts,
} from '../utils/api';
import { useDebounce } from '../hooks/useDebounce';
import { useContacts } from '../hooks/useContacts';
import Pagination from '../components/admin/Pagination';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user] = useState(() => getCurrentUser());
    const {
        contacts,
        stats,
        loading,
        error,
        totalPages,
        loadContacts,
        changeStatus,
        removeContact,
        setError
    } = useContacts();

    // Filters and pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [serviceFilter, setServiceFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        loadContacts({
            page: currentPage,
            search: debouncedSearch,
            service: serviceFilter,
            status: statusFilter
        });
    }, [currentPage, debouncedSearch, serviceFilter, statusFilter, loadContacts]);

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        const success = await changeStatus(contactId, newStatus);
        if (!success) setError('Error al actualizar el estado');
    };

    const handleDelete = async (contactId) => {
        if (!confirm('¿Estás seguro de eliminar este contacto?')) return;
        const success = await removeContact(contactId);
        if (success) {
            setSelectedContact(null);
        }
    };

    const handleExport = () => {
        exportContacts({
            search,
            service: serviceFilter,
            status: statusFilter
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Contactos</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Visualiza y gestiona las solicitudes de contacto de tu sitio web.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-cyan-900/20 border border-cyan-400/20"
                >
                    📥 Exportar CSV
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 font-medium flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </p>
                </div>
            )}

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'Nuevos', value: stats.new, color: 'text-cyan-400' },
                        { label: 'Leídos', value: stats.read, color: 'text-amber-400' },
                        { label: 'Respondidos', value: stats.replied, color: 'text-emerald-400' },
                        { label: 'Archivados', value: stats.archived || 0, color: 'text-slate-400' },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#0f1026]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                            <p className="text-slate-500 text-xs mb-1 font-black uppercase tracking-widest">{s.label}</p>
                            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0f1026]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                        />
                    </div>

                    <select
                        value={serviceFilter}
                        onChange={(e) => {
                            setServiceFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                    >
                        <option value="" className="bg-[#0f1026]">Todos los servicios</option>
                        {['Consultoría', 'Desarrollo', 'IA', 'Marketing', 'Seguridad', 'Diseño'].map(s => (
                            <option key={s} value={s.toLowerCase()} className="bg-[#0f1026]">{s}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                    >
                        <option value="" className="bg-[#0f1026]">Todos los estados</option>
                        <option value="new" className="bg-[#0f1026]">Nuevo</option>
                        <option value="read" className="bg-[#0f1026]">Leído</option>
                        <option value="replied" className="bg-[#0f1026]">Respondido</option>
                        <option value="archived" className="bg-[#0f1026]">Archivado</option>
                    </select>
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-[#0f1026]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden mb-8">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-medium">Cargando contactos...</p>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">📭</div>
                        <p className="text-slate-500 font-medium">No se encontraron contactos</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    {['Nombre', 'Email', 'Servicio', 'Estado', 'Fecha', 'Acciones'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{contact.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm font-medium">{contact.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-300 text-sm capitalize bg-white/5 px-2 py-1 rounded-lg border border-white/5">{contact.service}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block group/status">
                                                <select
                                                    value={contact.status}
                                                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                                                    className={`
                                                        px-3 py-1 rounded-full text-xs font-bold border outline-none appearance-none cursor-pointer transition-all shadow-sm
                                                        ${contact.status === 'new' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                                          contact.status === 'read' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                                          contact.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                                                        pr-6
                                                    `}
                                                >
                                                    <option value="new" className="bg-[#0f1026]">Nuevo</option>
                                                    <option value="read" className="bg-[#0f1026]">Leído</option>
                                                    <option value="replied" className="bg-[#0f1026]">Respondido</option>
                                                    <option value="archived" className="bg-[#0f1026]">Archivado</option>
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/status:opacity-100 transition-opacity">
                                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">{formatDate(contact.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedContact(contact)}
                                                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Ver detalle"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            </div>

            {/* Contact Detail Modal */}
            <AnimatePresence>
                {selectedContact && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]" onClick={() => setSelectedContact(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f1026] rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-white/10 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Background Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                            
                            <div className="flex items-start justify-between mb-8 border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Detalle del Contacto</h2>
                                    <p className="text-slate-500 text-xs uppercase font-black tracking-widest">ID: #{selectedContact.id.toString().padStart(4, '0')}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nombre del Remitente</label>
                                        <p className="text-white text-lg font-bold">{selectedContact.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Correo Electrónico</label>
                                        <p className="text-cyan-400 font-medium">{selectedContact.email}</p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tipo de Servicio</label>
                                        <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg border border-white/5 text-sm font-semibold capitalize">{selectedContact.service}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Estado Actual</label>
                                        <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Recibido</label>
                                            <p className="text-slate-400 text-xs font-semibold">{formatDate(selectedContact.created_at)}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Actualizado</label>
                                            <p className="text-slate-400 text-xs font-semibold">{formatDate(selectedContact.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Mensaje</label>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-slate-300 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                                    {selectedContact.message}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        window.location.href = `mailto:${selectedContact.email}?subject=Re: Contacto XpertIA`;
                                    }}
                                    className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                                >
                                    <span>📧</span> Responder por Email
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedContact.id)}
                                    className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-bold border border-red-500/20 flex items-center justify-center gap-2"
                                >
                                    <span>🗑️</span> Eliminar Registro
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminDashboard;
