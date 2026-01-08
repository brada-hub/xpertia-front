import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProject, assignPersonnel, unassignPersonnel, getPersonnel } from '../../utils/projectsApi';

const ProjectDetailModal = ({ isOpen, onClose, projectId }) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [personnelList, setPersonnelList] = useState([]);
    const [assignForm, setAssignForm] = useState({
        personnel_id: '',
        role: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && projectId) {
            loadProjectData();
            loadPersonnelList();
        }
    }, [isOpen, projectId]);

    const loadProjectData = async () => {
        try {
            setLoading(true);
            const response = await getProject(projectId);
            if (response.success) {
                setProject(response.data);
            }
        } catch (err) {
            console.error('Error loading project:', err);
            setError('Error al cargar detalles del proyecto');
        } finally {
            setLoading(false);
        }
    };

    const loadPersonnelList = async () => {
        try {
            const response = await getPersonnel({ per_page: 100, status: 'active' });
            if (response.success) {
                setPersonnelList(response.data.personnel);
            }
        } catch (err) {
            console.error('Error loading personnel:', err);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!assignForm.personnel_id || !assignForm.role) return;

        try {
            await assignPersonnel(projectId, assignForm.personnel_id, assignForm.role);
            setAssignForm({ personnel_id: '', role: '' });
            loadProjectData(); // Reload to show new assignment
        } catch (err) {
            console.error('Error assigning personnel:', err);
            setError('Error al asignar personal');
        }
    };

    const handleUnassign = async (personnelId) => {
        if (!confirm('¿Remover a esta persona del proyecto?')) return;

        try {
            await unassignPersonnel(projectId, personnelId);
            loadProjectData();
        } catch (err) {
            console.error('Error unassigning personnel:', err);
            setError('Error al remover personal');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            planning: 'bg-blue-100 text-blue-800 border-blue-200',
            development: 'bg-purple-100 text-purple-800 border-purple-200',
            testing: 'bg-amber-100 text-amber-800 border-amber-200',
            completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            paused: 'bg-orange-100 text-orange-800 border-orange-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };

        const labels = {
            planning: 'Planificación',
            development: 'Desarrollo',
            testing: 'Pruebas',
            completed: 'Completado',
            paused: 'Pausado',
            cancelled: 'Cancelado',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[status] || ''} shadow-sm`}>
                {labels[status] || status}
            </span>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#0f1026] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Background Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0f1026]/80 backdrop-blur-md z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Detalles del Proyecto</h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Gestone y asignación de recursos</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-400 font-medium">Obteniendo detalles...</p>
                            </div>
                        ) : project ? (
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Project Info */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-4 mb-2">
                                            <h1 className="text-3xl font-bold text-white tracking-tight">{project.name}</h1>
                                            {getStatusBadge(project.status)}
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                {project.type || 'Desarrollo'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed text-lg">{project.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:bg-white/[0.07] transition-all">
                                            <p className="text-slate-500 text-[10px] mb-2 font-black uppercase tracking-widest">Cliente Directo</p>
                                            <p className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{project.client_company}</p>
                                            <p className="text-slate-500 text-sm mt-1">{project.client_name}</p>
                                        </div>
                                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:bg-white/[0.07] transition-all">
                                            <p className="text-slate-500 text-[10px] mb-2 font-black uppercase tracking-widest">Inversión Estimada</p>
                                            <p className="text-emerald-400 font-black text-2xl">
                                                {project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : 'No definido'}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                            <p className="text-slate-500 text-[10px] mb-2 font-black uppercase tracking-widest">Fecha de Lanzamiento</p>
                                            <p className="text-white font-bold">{project.start_date}</p>
                                        </div>
                                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                            <p className="text-slate-500 text-[10px] mb-2 font-black uppercase tracking-widest">Cierre Estimado</p>
                                            <p className="text-white font-bold">{project.end_date || 'En curso'}</p>
                                        </div>
                                    </div>

                                    {project.observations && (
                                        <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full"></div>
                                            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                                <span>📝</span> Notas del Proyecto
                                            </h4>
                                            <p className="text-slate-300 text-sm leading-relaxed">{project.observations}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Personnel */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-[#1a1b3a]/50 p-6 rounded-3xl border border-white/5 shadow-xl">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <span className="text-cyan-400">👥</span> Equipo Técnico
                                        </h3>

                                        <div className="space-y-3 mb-8">
                                            {project.personnel && project.personnel.length > 0 ? (
                                                project.personnel.map(p => (
                                                    <div key={p.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                                                        <div className="min-w-0">
                                                            <p className="text-white font-bold text-sm truncate">{p.name}</p>
                                                            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mt-0.5">{p.role}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnassign(p.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                            title="Remover del proyecto"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl font-medium text-slate-500 text-sm">
                                                    Sin personal asignado
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Nueva Asignación</h4>
                                            <form onSubmit={handleAssign} className="space-y-4">
                                                <div className="relative">
                                                    <select
                                                        value={assignForm.personnel_id}
                                                        onChange={e => setAssignForm({ ...assignForm, personnel_id: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-cyan-500/50 outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option value="" className="bg-[#0f1026]">Seleccionar Empleado</option>
                                                        {personnelList
                                                            .filter(p => !project.personnel?.find(assigned => assigned.id === p.id))
                                                            .map(p => (
                                                                <option key={p.id} value={p.id} className="bg-[#0f1026]">{p.name} - {p.position}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Rol (ej. Lead Developer)"
                                                    value={assignForm.role}
                                                    onChange={e => setAssignForm({ ...assignForm, role: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!assignForm.personnel_id || !assignForm.role}
                                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-900/20 disabled:opacity-30 transition-all"
                                                >
                                                    Asignar al Equipo
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 text-center text-red-500 font-bold">Error crítico al cargar información</div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectDetailModal;
