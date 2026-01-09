/**
 * API Configuration and Helper Functions
 */

// API Base URL - adjust for production
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const cache = new Map();
const pendingRequests = new Map();

/**
 * Make API request with deduplication and caching for GET
 */
export async function apiRequest(endpoint, options = {}) {
  const method = options.method || 'GET';
  const url = `${API_BASE_URL}/${endpoint}`;

  // Deduplicate and cache only GET requests
  if (method === 'GET') {
    // Check if there's already an active request for this URL
    if (pendingRequests.has(url)) {
      return pendingRequests.get(url);
    }

    // Check if we have a valid cached response
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < 5000) { // 5s cache
      return cached.data;
    }
  }

  const promise = (async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
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

      // Cache successful GET responses
      if (method === 'GET') {
        cache.set(url, { data, timestamp: Date.now() });
      } else {
        // Clear cache on mutations to ensure data consistency
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

/**
 * Submit contact form
 */
export async function submitContact(formData) {
  return apiRequest("contacts", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * Admin login
 */
export async function adminLogin(email, password) {
  const response = await apiRequest("login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.success && response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response;
}

/**
 * Get unified dashboard summary
 */
export async function getDashboardSummary() {
  return apiRequest("dashboard/summary");
}

/**
 * Admin logout
 */
export async function adminLogout() {
  const response = await apiRequest("logout", {
    method: "POST",
  });

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");

  return response;
}

/**
 * Get all contacts (admin)
 */
export async function getContacts(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = `admin-contacts${queryParams ? `?${queryParams}` : ""}`;

  return apiRequest(endpoint, {
    method: "GET",
  });
}

/**
 * Get single contact (admin)
 */
export async function getContact(id) {
  return apiRequest(`contacts/${id}`, {
    method: "GET",
  });
}

/**
 * Get contact statistics (admin)
 */
export async function getContactStats() {
  return apiRequest("admin-contacts?stats=1", {
    method: "GET",
  });
}

/**
 * Update contact status (admin)
 */
export async function updateContactStatus(id, status) {
  return apiRequest(`contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * Delete contact (admin)
 */
export async function deleteContact(id) {
  return apiRequest(`contacts/${id}`, {
    method: "DELETE",
  });
}

/**
 * Export contacts to CSV (admin)
 */
export function exportContacts(params = {}) {
  const token = localStorage.getItem("auth_token");
  const finalParams = new URLSearchParams(params);
  finalParams.append('token', token);
  
  const url = `${API_BASE_URL}/admin-contacts/export?${finalParams.toString()}`;

  // Open in new window to trigger download
  window.open(url, "_blank");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const token = localStorage.getItem("auth_token");
  return !!token;
}

/**
 * Get current user
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}
