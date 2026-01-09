import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    getCurrentUser,
    adminLogout
} from '../utils/projectsApi';
import { useDebounce } from '../hooks/useDebounce';
import { useClients } from '../hooks/useClients';
import Pagination from '../components/admin/Pagination';

const ClientsManagement = () => {
    const navigate = useNavigate();
    const [user] = useState(() => getCurrentUser());
    const {
        clients,
        loading,
        error,
        totalPages,
        loadClients,
        saveClient,
        removeClient,
        setError
    } = useClients();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        company: '',
        address: ''
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        loadClients({
            page: currentPage,
            search: debouncedSearch
        });
    }, [currentPage, debouncedSearch, loadClients]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await saveClient(formData, editingClient?.id);
        if (success) {
            setIsModalOpen(false);
            loadClients({ page: currentPage, search: debouncedSearch });
            setEditingClient(null);
            setFormData({
                name: '',
                contact_person: '',
                email: '',
                phone: '',
                company: '',
                address: ''
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este cliente? No se puede deshacer.')) return;
        const success = await removeClient(id);
        if (!success) {
            // Error is already set in the hook
        }
    };

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                contact_person: client.contact_person,
                email: client.email,
                phone: client.phone || '',
                company: client.company,
                address: client.address || ''
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                contact_person: '',
                email: '',
                phone: '',
                company: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Clientes</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Mantén actualizada la información de tus clientes y socios estratégicos.
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-cyan-900/20 border border-cyan-400/20"
                >
                    + Nuevo Cliente
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 font-medium flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </p>
                </div>
            )}

            <div className="bg-[#0f1026]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Buscar por empresa o contacto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-[#0f1026]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden mb-8">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-medium">Cargando clientes...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">👥</div>
                        <p className="text-slate-500 font-medium">No se encontraron clientes</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    {['Empresa', 'Contacto', 'Email', 'Teléfono', 'Acciones'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{client.company}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm font-medium">{client.contact_person}</td>
                                        <td className="px-6 py-4 text-cyan-400 text-sm font-medium">{client.email}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm font-medium">{client.phone || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(client)}
                                                    className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Editar"
                                                >
                                                    📝
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
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

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0f1026] rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-white/10 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Background Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                                    </h2>
                                    <p className="text-slate-500 text-xs uppercase font-black tracking-widest">Completa la información del cliente</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Empresa / Razón Social *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        placeholder="Ej: XpertIA Solutions"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Persona de Contacto *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contact_person}
                                        onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Corporativo *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-sm"
                                            placeholder="contacto@empresa.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Teléfono / WhatsApp</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-sm"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Dirección de Oficina</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all min-h-[80px]"
                                        placeholder="Ej: Av. Principal 123, Edificio A, Piso 4"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-end gap-4 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-cyan-900/20"
                                    >
                                        {editingClient ? 'Actualizar Cliente' : 'Guardar Cliente'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ClientsManagement;
