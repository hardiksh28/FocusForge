const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    register: async (data: any) => {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create character');
      }
      return res.json();
    },
    login: async (data: any) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Invalid credentials');
      }
      const payload = await res.json();
      if (payload.token) {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
      return payload;
    },
    googleLogin: async (data: { credential?: string; email?: string; name?: string; avatar?: string }) => {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Google sign-in failed');
      }
      const payload = await res.json();
      if (payload.token) {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
      return payload as { token: string; user: any; isNewUser: boolean };
    },
    updateProfile: async (data: { username: string; avatar: string }) => {
      const res = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Profile update failed');
      }
      const payload = await res.json();
      if (payload.user) {
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
      return payload;
    },
    me: async () => {
      const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
    claimDaily: async () => {
      const res = await fetch(`${API_URL}/auth/daily`, { method: 'POST', headers: getHeaders() });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to claim daily reward');
      }
      return res.json();
    },
    updateTheme: async (theme: string) => {
      const res = await fetch(`${API_URL}/auth/theme`, { 
        method: 'POST', 
        headers: getHeaders(),
        body: JSON.stringify({ theme })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to activate theme');
      }
      return res.json();
    },
    buyTheme: async (theme: string, price: number) => {
      const res = await fetch(`${API_URL}/auth/buy-theme`, { 
        method: 'POST', 
        headers: getHeaders(),
        body: JSON.stringify({ theme, price })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to purchase theme');
      }
      return res.json();
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  quests: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/quests`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch quests');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/quests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create quest');
      return res.json();
    },
    complete: async (id: string) => {
      const res = await fetch(`${API_URL}/quests/${id}/complete`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to complete quest');
      return res.json();
    }
  },
  timer: {
    start: async () => {
      const res = await fetch(`${API_URL}/timer/start`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to start timer');
      return res.json();
    },
    pause: async () => {
      const res = await fetch(`${API_URL}/timer/pause`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to pause timer');
      return res.json();
    },
    stop: async () => {
      const res = await fetch(`${API_URL}/timer/stop`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to stop timer');
      return res.json();
    }
  },
  guild: {
    create: async (name: string) => {
      const res = await fetch(`${API_URL}/guild/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create guild');
      }
      return res.json();
    },
    getMy: async () => {
      const res = await fetch(`${API_URL}/guild/my`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch guild info');
      return res.json();
    },
    invite: async (username: string) => {
      const res = await fetch(`${API_URL}/guild/invite`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to add member');
      }
      return res.json();
    },
    leave: async () => {
      const res = await fetch(`${API_URL}/guild/leave`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to leave guild');
      }
      return res.json();
    },
    attackBoss: async (xpAmount: number) => {
      const res = await fetch(`${API_URL}/guild/boss/attack`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ xpAmount })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to damage boss');
      }
      return res.json();
    }
  }
};
