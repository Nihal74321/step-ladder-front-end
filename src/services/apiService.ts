import { ApiResponse, LeaderboardEntry, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://step-ladder-back-end.onrender.com';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('stepladder_token');
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Request failed' };
    }
    
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
};

export const leaderboardService = {
  getLeaderboard: async (week: number): Promise<ApiResponse<LeaderboardEntry[]>> => {
    return request(`/api/leaderboard/${week}`);
  },
};

export const userService = {
  getUserProfile: async (uuid: string): Promise<ApiResponse<User>> => {
    return request(`/api/users/${uuid}`);
  },
};

export const adminService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return request('/api/admin/users');
  },

  addUser: async (userData: { username: string; email: string; password: string; total_steps?: number }): Promise<ApiResponse<User>> => {
    return request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (uuid: string): Promise<ApiResponse<void>> => {
    return request(`/api/admin/users/${uuid}`, {
      method: 'DELETE',
    });
  },

  populateSample: async (): Promise<ApiResponse<void>> => {
    return request('/api/admin/populate-sample', {
      method: 'POST',
    });
  },
};