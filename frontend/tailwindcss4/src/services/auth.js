import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5299/api/auth';

// Helper function to store tokens and user data
const storeAuthData = (responseData) => {
  localStorage.setItem('accessToken', responseData.accessToken);
  localStorage.setItem('refreshToken', responseData.refreshToken || '');
  localStorage.setItem('userId', responseData.user?.id || '');
  localStorage.setItem('username', responseData.user?.username || '');
  localStorage.setItem('roles', JSON.stringify(responseData.user?.roles || ['User']));
};

// Helper function to clear tokens and user data
const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');
};

// Register a new user
export const register = async (userData) => {
  try {
    console.log('Register payload:', userData);
    if (!userData.username || !userData.password) {
      console.error('Register validation failed: Missing username or password');
      throw new Error('Username and password are required');
    }
    console.log('Register request URL:', `${API_URL}/register`);
    const response = await axios.post(`${API_URL}/register`, {
      username: userData.username,
      password: userData.password,
    });
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      'Registration failed';
    throw new Error(
      typeof errorMessage === 'object'
        ? JSON.stringify(errorMessage)
        : errorMessage
    );
  }
};

// Login user
export const login = async (userData) => {
  try {
    console.log('Login payload:', userData);
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel('Request timed out');
    }, 10000);

    const response = await axios.post(
      `${API_URL}/login`,
      {
        username: userData.username,
        password: userData.password,
      },
      { cancelToken: source.token }
    );

    clearTimeout(timeout);
    if (!response.data.user) {
      console.error('Login response missing user object:', response.data);
      throw new Error('User data not provided in login response');
    }
    storeAuthData(response.data);
    console.log('Login response:', response.data);
    return {
      id: response.data.user.id,
      username: response.data.user.username,
      roles: response.data.user.roles || ['User'],
      token: response.data.accessToken,
    };
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage =
      error.message ||
      error.response?.data?.message ||
      error.response?.data ||
      'Invalid username or password';
    throw new Error(
      typeof errorMessage === 'object'
        ? JSON.stringify(errorMessage)
        : errorMessage
    );
  }
};

// Refresh tokens
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    if (!refreshToken || !userId) {
      throw new Error('No refresh token or user ID available');
    }
    const response = await axios.post(`${API_URL}/refresh-token`, {
      userId,
      refreshToken,
    });
    storeAuthData(response.data);
    console.log('Refresh token response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Refresh token error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    clearAuthData();
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Logout user
export const logout = async () => {
  try {
    clearAuthData();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
};

// Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.config.url !== `${API_URL}/login` &&
      error.config.url !== `${API_URL}/register`
    ) {
      originalRequest._retry = true;
      try {
        const tokenResponse = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);