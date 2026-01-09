/**
 * Projects API Utilities
 * Functions for interacting with projects, clients, and personnel APIs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const cache = new Map();
const pendingRequests = new Map();

async function apiRequest(endpoint, options = {}) {
    const method = options.method || 'GET';
    const url = `${API_BASE_URL}/${endpoint}`;

    // Deduplicate and cache only GET requests
    if (method === 'GET') {
        if (pendingRequests.has(url)) {
            return pendingRequests.get(url);
        }

        const cached = cache.get(url);
        if (cached && Date.now() - cached.timestamp < 5000) {
            return cached.data;
        }
    }

    const promise = (async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers,
                },
                ...options,
            };

            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, config);
            const contentType = response.headers.get("content-type");
            let data;
            
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || `Error ${response.status}: ${response.statusText}`);
            }

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    window.location.href = "/admin/login";
                }
                throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`);
            }

            if (method === 'GET') {
                cache.set(url, { data, timestamp: Date.now() });
            } else {
                cache.clear();
            }

            return data;
        } finally {
            if (method === 'GET') {
                pendingRequests.delete(url);
            }
        }
    })();

    if (method === 'GET') {
        pendingRequests.set(url, promise);
    }

    return promise;
}

// Export logout and getCurrentUser from main api
export { adminLogout, getCurrentUser } from './api';

// ==================== CLIENTS ====================

export async function getClients(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `clients${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getClient(id) {
    return apiRequest(`clients/${id}`, { method: 'GET' });
}

export async function createClient(data) {
    return apiRequest('clients', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateClient(id, data) {
    return apiRequest(`clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteClient(id) {
    return apiRequest(`clients/${id}`, {
        method: 'DELETE',
    });
}

// ==================== PERSONNEL ====================

export async function getPersonnel(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `personnel${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getPersonnelById(id) {
    return apiRequest(`personnel/${id}`, { method: 'GET' });
}

export async function getPositions() {
    return apiRequest('personnel?positions=1', { method: 'GET' });
}

export async function createPersonnel(data) {
    return apiRequest('personnel', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePersonnel(id, data) {
    return apiRequest(`personnel/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deletePersonnel(id) {
    return apiRequest(`personnel/${id}`, {
        method: 'DELETE',
    });
}

// ==================== PROJECTS ====================

export async function getProjects(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `projects${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
}

export async function getProject(id) {
    return apiRequest(`projects/${id}`, { method: 'GET' });
}

export async function getProjectStats() {
    return apiRequest('projects?stats=1', { method: 'GET' });
}

export async function createProject(data) {
    return apiRequest('projects', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProject(id, data) {
    return apiRequest(`projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteProject(id) {
    return apiRequest(`projects/${id}`, {
        method: 'DELETE',
    });
}

export async function assignPersonnel(projectId, personnelId, role) {
    return apiRequest(`projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            action: 'assign',
            personnel_id: personnelId,
            role,
        }),
    });
}

export async function unassignPersonnel(projectId, personnelId) {
    return apiRequest(`projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            action: 'unassign',
            personnel_id: personnelId,
        }),
    });
}
