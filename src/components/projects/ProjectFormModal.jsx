import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createProject, updateProject, getClients } from '../../utils/projectsApi';

const ProjectFormModal = ({ isOpen, onClose, project = null, onSuccess, clients: initialClients = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Desarrollo',
        description: '',
        client_id: '',
        status: 'planning',
        start_date: '',
        end_date: '',
        budget: '',
        observations: ''
    });
    const [clients, setClients] = useState(initialClients);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCustomType, setShowCustomType] = useState(false);
    const [customType, setCustomType] = useState('');

    const standardTypes = ['Consultoría', 'Desarrollo', 'IA', 'Marketing', 'Seguridad', 'Diseño'];

    useEffect(() => {
        if (isOpen) {
            if (initialClients.length === 0) {
                loadClients();
            } else {
                setClients(initialClients);
            }
            if (project) {
                const isStandard = standardTypes.includes(project.type);
                setFormData({
                    name: project.name || '',
                    type: isStandard ? project.type : 'Otro',
                    description: project.description || '',
                    client_id: project.client_id || '',
                    status: project.status || 'planning',
                    start_date: project.start_date || '',
                    end_date: project.end_date || '',
                    budget: project.budget || '',
                    observations: project.observations || ''
                });
                if (!isStandard && project.type) {
                    setShowCustomType(true);
                    setCustomType(project.type);
                } else {
                    setShowCustomType(false);
                    setCustomType('');
                }
            } else {
                // Reset form for new project
                setFormData({
                    name: '',
                    type: 'Desarrollo',
                    description: '',
                    client_id: '',
                    status: 'planning',
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: '',
                    budget: '',
                    observations: ''
                });
                setShowCustomType(false);
                setCustomType('');
            }
        }
    }, [isOpen, project]);

    const loadClients = async () => {
        try {
            const response = await getClients({ per_page: 100 });
            if (response.success) {
                setClients(response.data.clients);
            }
        } catch (err) {
            console.error('Error loading clients:', err);
            setError('Error al cargar clientes');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'type') {
            if (value === 'Otro') {
                setShowCustomType(true);
            } else {
                setShowCustomType(false);
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const dataToSubmit = {
            ...formData,
            type: formData.type === 'Otro' ? customType : formData.type
        };

        try {
            if (project) {
                await updateProject(project.id, dataToSubmit);
            } else {
                await createProject(dataToSubmit);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving project:', err);
            setError('Error al guardar el proyecto. Verifique los datos.');
        } finally {
            setLoading(false);
        }
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
                        className="bg-[#0f1026] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                        <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0f1026]/80 backdrop-blur-md z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                                </h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Información técnica y temporal</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Proyecto *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: XpertIA 2.0 Rebranding"
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Proyecto *</label>
                                    <div className="relative">
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Consultoría" className="bg-[#0f1026]">Consultoría</option>
                                            <option value="Desarrollo" className="bg-[#0f1026]">Desarrollo</option>
                                            <option value="IA" className="bg-[#0f1026]">IA / Automatización</option>
                                            <option value="Marketing" className="bg-[#0f1026]">Marketing / Branding</option>
                                            <option value="Seguridad" className="bg-[#0f1026]">Seguridad Médica / IT</option>
                                            <option value="Diseño" className="bg-[#0f1026]">Diseño UI/UX</option>
                                            <option value="Otro" className="bg-[#0f1026]">Otro...</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {showCustomType && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2 col-span-1 md:col-span-2"
                                    >
                                        <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-1">Especificar Otro Servicio *</label>
                                        <input
                                            type="text"
                                            value={customType}
                                            onChange={(e) => setCustomType(e.target.value)}
                                            required
                                            placeholder="Ej: Mantenimiento de Hardware, Auditoría..."
                                            className="w-full px-4 py-2.5 bg-cyan-500/5 border border-cyan-500/30 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cliente *</label>
                                    <div className="relative">
                                        <select
                                            name="client_id"
                                            value={formData.client_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#0f1026]">Seleccionar Cliente</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id} className="bg-[#0f1026] text-white">{client.company}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción del Proyecto *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        placeholder="Detalla los objetivos y el alcance del proyecto..."
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="planning" className="bg-[#0f1026]">Planificación</option>
                                            <option value="development" className="bg-[#0f1026]">Desarrollo</option>
                                            <option value="testing" className="bg-[#0f1026]">Pruebas</option>
                                            <option value="completed" className="bg-[#0f1026]">Completado</option>
                                            <option value="paused" className="bg-[#0f1026]">Pausado</option>
                                            <option value="cancelled" className="bg-[#0f1026]">Cancelado</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Presupuesto (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Inicio *</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Fin (Estimada)</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Observaciones Internas</label>
                                    <textarea
                                        name="observations"
                                        value={formData.observations}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Notas adicionales sobre el cliente o requisitos..."
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        project ? 'Guardar Cambios' : 'Crear Proyecto'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectFormModal;
