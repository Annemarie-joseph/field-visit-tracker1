const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? `http://${window.location.hostname}:4000` : '');

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    window.location.reload();
    return;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `طلب فشل: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login:           (data) => request('/api/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
  register:        (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getAllUsers:      ()     => request('/api/auth/users'),
  getPendingUsers: ()     => request('/api/auth/users/pending'),
  approveUser:     (id)   => request(`/api/auth/users/${id}/approve`, { method: 'PATCH' }),
  deleteUser:      (id)   => request(`/api/auth/users/${id}`,         { method: 'DELETE' }),

  // People
  getAllPeople:  ()     => request('/api/people'),
  getPending:   ()     => request('/api/people/pending'),
  createPerson: (data) => request('/api/people',      { method: 'POST',   body: JSON.stringify(data) }),
  deletePerson: (id)   => request(`/api/people/${id}`,{ method: 'DELETE' }),

  // Visits
  logVisit: (data) => request('/api/visits', { method: 'POST', body: JSON.stringify(data) }),
};
