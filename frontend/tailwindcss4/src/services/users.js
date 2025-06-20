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

    // Правильно обрабатываем ответ от API
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