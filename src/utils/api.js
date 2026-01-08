/**
 * API Configuration and Helper Functions
 */

// API Base URL - adjust for production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost/xpertia-react/backend/api";

/**
 * Make API request
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en la solicitud");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Submit contact form
 */
export async function submitContact(formData) {
  return apiRequest("contacts.php", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * Admin login
 */
export async function adminLogin(email, password) {
  const response = await apiRequest("auth.php", {
    method: "POST",
    body: JSON.stringify({
      action: "login",
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
 * Admin logout
 */
export async function adminLogout() {
  const response = await apiRequest("auth.php", {
    method: "POST",
    body: JSON.stringify({
      action: "logout",
    }),
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
  const endpoint = `admin-contacts.php${queryParams ? `?${queryParams}` : ""}`;

  return apiRequest(endpoint, {
    method: "GET",
  });
}

/**
 * Get single contact (admin)
 */
export async function getContact(id) {
  return apiRequest(`admin-contacts.php?id=${id}`, {
    method: "GET",
  });
}

/**
 * Get contact statistics (admin)
 */
export async function getContactStats() {
  return apiRequest("admin-contacts.php?stats=1", {
    method: "GET",
  });
}

/**
 * Update contact status (admin)
 */
export async function updateContactStatus(id, status) {
  return apiRequest("admin-contacts.php", {
    method: "PATCH",
    body: JSON.stringify({ id, status }),
  });
}

/**
 * Delete contact (admin)
 */
export async function deleteContact(id) {
  return apiRequest("admin-contacts.php", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

/**
 * Export contacts to CSV (admin)
 */
export function exportContacts(params = {}) {
  const token = localStorage.getItem("auth_token");
  const finalParams = new URLSearchParams(params);
  finalParams.append('token', token);
  
  const url = `${API_BASE_URL}/export.php?${finalParams.toString()}`;

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
