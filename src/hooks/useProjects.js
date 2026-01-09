import { useState, useCallback } from 'react';
import { 
    getProjects, 
    updateProject, 
    deleteProject, 
    getProjectStats 
} from '../utils/projectsApi';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const loadProjects = useCallback(async (params) => {
        if (loading && projects.length > 0) return;

        try {
            setLoading(true);
            setError('');
            const response = await getProjects({ ...params, include_stats: 1 });
            
            if (response.success) {
                setProjects(response.data.projects);
                setTotalPages(response.data.pagination.last_page);
                if (response.data.stats) {
                    setStats(response.data.stats);
                }
            }
        } catch (err) {
            setError('Error al cargar proyectos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [loading, projects.length]);

    const changeStatus = async (id, status) => {
        try {
            const response = await updateProject(id, { status });
            if (response.success) {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
                const statsResponse = await getProjectStats();
                if (statsResponse.success) setStats(statsResponse.data);
                return true;
            }
        } catch (err) {
            setError('Error al actualizar estado');
            return false;
        }
    };

    const removeProject = async (id) => {
        try {
            const response = await deleteProject(id);
            if (response.success) {
                setProjects(prev => prev.filter(p => p.id !== id));
                return true;
            }
        } catch (err) {
            setError('Error al eliminar proyecto');
            return false;
        }
    };

    const refresh = () => {
        loadProjects({
            page: currentPage,
            // You can add more current filters here if needed or just re-run with what's in state
        });
    };

    return {
        projects,
        stats,
        loading,
        error,
        totalPages,
        loadProjects,
        refresh,
        changeStatus,
        removeProject,
        setError
    };
};
