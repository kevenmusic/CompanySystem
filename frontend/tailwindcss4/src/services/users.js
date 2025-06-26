// src/services/users.js
import axios from 'axios';

const API_URL = 'http://localhost:5299/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchUsers = async () => {
  try {
    console.log('Debug - Fetching users from API...');
    
    const response = await axios.get(API_URL, {
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    console.log('Debug - Raw users response:', response.data);

    const items = Array.isArray(response.data) 
      ? response.data 
      : response.data ? [response.data] : [];

    console.log('Debug - Processed users:', items);

    return items;
  } catch (error) {
    console.error('Debug - Error fetching users:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра пользователей.');
      }
      console.error('Ошибка при загрузке пользователей:', error.response?.data || error.message);
    }
    
    return [];
  }
};

export const fetchEmployeeUsers = async () => {
  try {
    console.log('Debug - Fetching users with Employee role from API...');

    const response = await axios.get(`${API_URL}/employees`, {
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    console.log('Debug - Raw employee users response:', response.data);

    const items = Array.isArray(response.data)
      ? response.data
      : response.data ? [response.data] : [];

    console.log('Debug - Processed employee users:', items);

    return items;
  } catch (error) {
    console.error('Debug - Error fetching employee users:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра сотрудников.');
      }
      console.error('Ошибка при загрузке сотрудников:', error.response?.data || error.message);
    }

    return [];
  }
};


// Новый метод для получения поломок сотрудника по userId
export const fetchBreakdownsByUserId = async (userId) => {
  try {
    console.log(`Debug - Fetching breakdowns for user ${userId} from API...`);

    const response = await axios.get(`${API_URL}/${userId}/breakdowns`, {
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    console.log('Debug - Raw breakdowns response:', response.data);

    const items = Array.isArray(response.data)
      ? response.data
      : response.data ? [response.data] : [];

    console.log('Debug - Processed breakdowns:', items);

    return items;
  } catch (error) {
    console.error(`Debug - Error fetching breakdowns for user ${userId}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра поломок.');
      }
      if (error.response?.status === 404) {
        throw new Error('Пользователь или поломки не найдены.');
      }
      console.error('Ошибка при загрузке поломок:', error.response?.data || error.message);
    }

    return [];
  }
};
