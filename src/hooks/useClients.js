import { useState, useCallback } from 'react';
import { 
    getClients, 
    createClient, 
    updateClient, 
    deleteClient 
} from '../utils/projectsApi';

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const loadClients = useCallback(async (params) => {
        if (loading && clients.length > 0) return;

        try {
            setLoading(true);
            setError('');
            const response = await getClients(params);
            
            if (response.success) {
                setClients(response.data.clients);
                setTotalPages(response.data.pagination.last_page);
            }
        } catch (err) {
            setError('Error al cargar clientes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [loading, clients.length]);

    const saveClient = async (data, id = null) => {
        try {
            const response = id 
                ? await updateClient(id, data)
                : await createClient(data);
            
            if (response.success) {
                return true;
            }
            return false;
        } catch (err) {
            setError(err.message || 'Error al guardar cliente');
            return false;
        }
    };

    const removeClient = async (id) => {
        try {
            const response = await deleteClient(id);
            if (response.success) {
                setClients(prev => prev.filter(c => c.id !== id));
                return true;
            }
            setError(response.message || 'Error al eliminar cliente');
            return false;
        } catch (err) {
            setError(err.message || 'Error al eliminar cliente');
            return false;
        }
    };

    return {
        clients,
        loading,
        error,
        totalPages,
        loadClients,
        saveClient,
        removeClient,
        setError
    };
};
