/**
 * Projects API Utilities
 * Functions for interacting with projects, clients, and personnel APIs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/xpertia-react/backend/api';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export logout and getCurrentUser from main api
export { adminLogout, getCurrentUser } from './api';

// ==================== CLIENTS ====================

export async function getClients(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `clients.php${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getClient(id) {
    return apiRequest(`clients.php?id=${id}`, { method: 'GET' });
}

export async function createClient(data) {
    return apiRequest('clients.php', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateClient(id, data) {
    return apiRequest('clients.php', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...data }),
    });
}

export async function deleteClient(id) {
    return apiRequest('clients.php', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
    });
}

// ==================== PERSONNEL ====================

export async function getPersonnel(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `personnel.php${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getPersonnelById(id) {
    return apiRequest(`personnel.php?id=${id}`, { method: 'GET' });
}

export async function getPositions() {
    return apiRequest('personnel.php?positions=1', { method: 'GET' });
}

export async function createPersonnel(data) {
    return apiRequest('personnel.php', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePersonnel(id, data) {
    return apiRequest('personnel.php', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...data }),
    });
}

export async function deletePersonnel(id) {
    return apiRequest('personnel.php', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
    });
}

// ==================== PROJECTS ====================

export async function getProjects(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `projects.php${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getProject(id) {
    return apiRequest(`projects.php?id=${id}`, { method: 'GET' });
}

export async function getProjectStats() {
    return apiRequest('projects.php?stats=1', { method: 'GET' });
}

export async function createProject(data) {
    return apiRequest('projects.php', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProject(id, data) {
    return apiRequest('projects.php', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...data }),
    });
}

export async function deleteProject(id) {
    return apiRequest('projects.php', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
    });
}

export async function assignPersonnel(projectId, personnelId, role) {
    return apiRequest('projects.php?action=assign', {
        method: 'POST',
        body: JSON.stringify({
            project_id: projectId,
            personnel_id: personnelId,
            role,
        }),
    });
}

export async function unassignPersonnel(projectId, personnelId) {
    return apiRequest('projects.php?action=unassign', {
        method: 'POST',
        body: JSON.stringify({
            project_id: projectId,
            personnel_id: personnelId,
        }),
    });
}
