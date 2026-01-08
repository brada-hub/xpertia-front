import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getProjects,
    getProjectStats,
    getClients,
    deleteProject,
    adminLogout,
    getCurrentUser,
} from '../utils/projectsApi';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';

const ProjectsDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    // Filters and pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        loadData();
        loadClients();
    }, [currentPage, search, statusFilter, clientFilter]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: currentPage,
                per_page: 10,
            };

            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (clientFilter) params.client_id = clientFilter;

            const [projectsResponse, statsResponse] = await Promise.all([
                getProjects(params),
                getProjectStats(),
            ]);

            if (projectsResponse.success) {
                setProjects(projectsResponse.data.projects);
                setTotalPages(projectsResponse.data.pagination.total_pages);
            }

            if (statsResponse.success) {
                setStats(statsResponse.data);
            }
        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const response = await getClients({ per_page: 100 });
            if (response.success) {
                setClients(response.data.clients);
            }
        } catch (err) {
            console.error('Error loading clients:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleDelete = async (projectId) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await deleteProject(projectId);
            loadData();
            if (selectedProject === projectId) setSelectedProject(null);
        } catch (err) {
            setError('Error al eliminar el proyecto');
            console.error('Error deleting project:', err);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            development: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            testing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            paused: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
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
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[status]} shadow-[0_0_15px_rgba(0,0,0,0.1)]`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Proyectos</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Controla el progreso y los detalles de tus proyectos activos.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-cyan-900/20 border border-cyan-400/20"
                >
                    + Nuevo Proyecto
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    {[
                        { label: 'Total', value: stats.stats.total, color: 'text-white' },
                        { label: 'Planificación', value: stats.stats.planning_count, color: 'text-blue-400' },
                        { label: 'Desarrollo', value: stats.stats.development_count, color: 'text-purple-400' },
                        { label: 'Pruebas', value: stats.stats.testing_count, color: 'text-amber-400' },
                        { label: 'Completados', value: stats.stats.completed_count, color: 'text-emerald-400' },
                        { label: 'Pausados', value: stats.stats.paused_count, color: 'text-orange-400' },
                        { label: 'Cancelados', value: stats.stats.cancelled_count, color: 'text-red-400' },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#0f1026]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl text-center md:text-left">
                            <p className="text-slate-500 text-[10px] mb-1 font-black uppercase tracking-widest">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0f1026]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de proyecto..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                    >
                        <option value="" className="bg-[#0f1026]">Todos los estados</option>
                        <option value="planning" className="bg-[#0f1026]">Planificación</option>
                        <option value="development" className="bg-[#0f1026]">Desarrollo</option>
                        <option value="testing" className="bg-[#0f1026]">Pruebas</option>
                        <option value="completed" className="bg-[#0f1026]">Completado</option>
                        <option value="paused" className="bg-[#0f1026]">Pausado</option>
                        <option value="cancelled" className="bg-[#0f1026]">Cancelado</option>
                    </select>

                    <select
                        value={clientFilter}
                        onChange={(e) => {
                            setClientFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                    >
                        <option value="" className="bg-[#0f1026]">Todos los clientes</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id} className="bg-[#0f1026]">
                                {client.company}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-[#0f1026]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden mb-8">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-medium">Cargando proyectos...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">📂</div>
                        <p className="text-slate-500 font-medium">No se encontraron proyectos</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    {['Proyecto', 'Tipo', 'Cliente', 'Estado', 'Inicio', 'Fin', 'Acciones'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{project.name}</p>
                                                <p className="text-slate-500 text-xs truncate max-w-xs">{project.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {project.type || 'Desarrollo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm font-medium">{project.client_company}</td>
                                        <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{formatDate(project.start_date)}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{formatDate(project.end_date)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project.id);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Ver detalles"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingProject(project);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Editar"
                                                >
                                                    📝
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
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

            {/* Modals */}
            <ProjectFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                project={editingProject}
                onSuccess={loadData}
            />

            <ProjectDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                projectId={selectedProject}
            />
        </>
    );
};

export default ProjectsDashboard;
