import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    getPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    getCurrentUser,
    adminLogout
} from '../utils/projectsApi';

const PersonnelManagement = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPersonnel, setEditingPersonnel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        phone: '',
        status: 'active'
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setUser(getCurrentUser());
        loadPersonnel();
    }, [currentPage, search]);

    const loadPersonnel = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                per_page: 10,
                search
            };

            const response = await getPersonnel(params);
            if (response.success) {
                setPersonnel(response.data.personnel);
                setTotalPages(response.data.pagination.total_pages);
            }
        } catch (err) {
            setError('Error al cargar personal');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPersonnel) {
                await updatePersonnel(editingPersonnel.id, formData);
            } else {
                await createPersonnel(formData);
            }
            setIsModalOpen(false);
            loadPersonnel();
            setEditingPersonnel(null);
            setFormData({
                name: '',
                email: '',
                position: '',
                phone: '',
                status: 'active'
            });
        } catch (err) {
            alert('Error al guardar personal');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este empleado? No se puede deshacer.')) return;
        try {
            await deletePersonnel(id);
            loadPersonnel();
        } catch (err) {
            alert('Error al eliminar: ' + (err.message || 'El empleado tiene proyectos asignados'));
        }
    };

    const openModal = (person = null) => {
        if (person) {
            setEditingPersonnel(person);
            setFormData({
                name: person.name,
                email: person.email,
                position: person.position,
                phone: person.phone || '',
                status: person.status
            });
        } else {
            setEditingPersonnel(null);
            setFormData({
                name: '',
                email: '',
                position: '',
                phone: '',
                status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Personal</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Administra tu capital humano y el equipo de especialistas.
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-cyan-900/20 border border-cyan-400/20"
                >
                    + Nuevo Especialista
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
                        placeholder="Buscar por nombre, cargo o email..."
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
                        <p className="text-slate-400 font-medium">Cargando personal...</p>
                    </div>
                ) : personnel.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">👷‍♂️</div>
                        <p className="text-slate-500 font-medium">No se encontró personal</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    {['Especialista', 'Cargo', 'Email', 'Estado', 'Acciones'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {personnel.map((person) => (
                                    <tr key={person.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                                                    {person.name.charAt(0)}
                                                </div>
                                                <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{person.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm font-medium">{person.position}</td>
                                        <td className="px-6 py-4 text-cyan-400/80 text-sm font-medium">{person.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${person.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {person.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(person)}
                                                    className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Editar"
                                                >
                                                    📝
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(person.id)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all font-semibold"
                        >
                            ← Anterior
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm">Página</span>
                            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg font-bold border border-cyan-500/20">{currentPage}</span>
                            <span className="text-slate-500 text-sm">de {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all font-semibold"
                        >
                            Siguiente →
                        </button>
                    </div>
                )}
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
                                        {editingPersonnel ? 'Editar Especialista' : 'Nuevo Especialista'}
                                    </h2>
                                    <p className="text-slate-500 text-xs uppercase font-black tracking-widest">Información del equipo de XpertIA</p>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        placeholder="Ej: Ing. Carlos Ruiz"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cargo / Especialidad *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        placeholder="Ej: Senior AI Developer"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Profesional *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-sm"
                                            placeholder="carlos@xpertia.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Teléfono de Contacto</label>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Estado Laboral</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="active" className="bg-[#0f1026]">Activo</option>
                                        <option value="inactive" className="bg-[#0f1026]">Inactivo</option>
                                    </select>
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
                                        {editingPersonnel ? 'Actualizar Miembro' : 'Añadir al Equipo'}
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

export default PersonnelManagement;
