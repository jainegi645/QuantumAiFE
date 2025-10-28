import axios from 'axios';

const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: any = null;

  private constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(provider: string): Promise<void> {
    // Redirect to backend OAuth endpoint
    window.location.href = `${AUTH_URL}/${provider}`;
  }

  async handleAuthCallback(code: string): Promise<LoginResponse> {
    const response = await axios.post(`${AUTH_URL}/callback`, { code });
    const { token, user } = response.data;
    
    this.setToken(token);
    this.setUser(user);
    
    return response.data;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): any {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    // notify app about auth change
    try { window.dispatchEvent(new CustomEvent('auth:changed')); } catch (e) {}
  }

  private setUser(user: any): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    // notify app about auth change
    try { window.dispatchEvent(new CustomEvent('auth:changed')); } catch (e) {}
  }

  setupAxiosInterceptor(): void {
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Ensure logout also notifies listeners
  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try { window.dispatchEvent(new CustomEvent('auth:changed')); } catch (e) {}
    window.location.href = '/';
  }
}

export const authService = AuthService.getInstance();