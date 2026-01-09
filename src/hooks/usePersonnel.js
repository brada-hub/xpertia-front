import { useState, useCallback } from 'react';
import { 
    getPersonnel, 
    createPersonnel, 
    updatePersonnel, 
    deletePersonnel 
} from '../utils/projectsApi';

export const usePersonnel = () => {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const loadPersonnelData = useCallback(async (params) => {
        if (loading && personnel.length > 0) return;

        try {
            setLoading(true);
            setError('');
            const response = await getPersonnel(params);
            
            if (response.success) {
                setPersonnel(response.data.personnel);
                setTotalPages(response.data.pagination.last_page);
            }
        } catch (err) {
            setError('Error al cargar personal');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [loading, personnel.length]);

    const savePerson = async (data, id = null) => {
        try {
            const response = id 
                ? await updatePersonnel(id, data)
                : await createPersonnel(data);
            
            if (response.success) {
                return true;
            }
            return false;
        } catch (err) {
            setError(err.message || 'Error al guardar personal');
            return false;
        }
    };

    const removePerson = async (id) => {
        try {
            const response = await deletePersonnel(id);
            if (response.success) {
                setPersonnel(prev => prev.filter(p => p.id !== id));
                return true;
            }
            setError(response.message || 'Error al eliminar personal');
            return false;
        } catch (err) {
            setError(err.message || 'Error al eliminar personal');
            return false;
        }
    };

    return {
        personnel,
        loading,
        error,
        totalPages,
        loadPersonnelData,
        savePerson,
        removePerson,
        setError
    };
};
