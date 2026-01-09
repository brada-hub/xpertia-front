import { useState, useCallback } from 'react';
import { 
    getContacts, 
    updateContactStatus, 
    deleteContact, 
    getContactStats 
} from '../utils/api';

export const useContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const loadContacts = useCallback(async (params) => {
        // Guard already implemented in API utility, but we keep it here for state sync
        if (loading && contacts.length > 0) return;

        try {
            setLoading(true);
            setError('');
            const response = await getContacts({ ...params, include_stats: 1 });
            
            if (response.success) {
                setContacts(response.data.contacts);
                setTotalPages(response.data.pagination.last_page);
                if (response.data.stats) {
                    setStats(response.data.stats);
                }
            }
        } catch (err) {
            setError('Error al cargar contactos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [loading, contacts.length]);

    const changeStatus = async (id, status) => {
        try {
            const response = await updateContactStatus(id, status);
            if (response.success) {
                setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
                // Refresh stats
                const statsResponse = await getContactStats();
                if (statsResponse.success) setStats(statsResponse.data);
                return true;
            }
        } catch (err) {
            setError('Error al actualizar estado');
            return false;
        }
    };

    const removeContact = async (id) => {
        try {
            const response = await deleteContact(id);
            if (response.success) {
                setContacts(prev => prev.filter(c => c.id !== id));
                return true;
            }
        } catch (err) {
            setError('Error al eliminar contacto');
            return false;
        }
    };

    return {
        contacts,
        stats,
        loading,
        error,
        totalPages,
        loadContacts,
        changeStatus,
        removeContact,
        setError
    };
};
