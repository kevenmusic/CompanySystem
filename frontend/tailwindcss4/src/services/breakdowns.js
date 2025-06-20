import axios from 'axios';

const API_URL = 'http://localhost:5299/api/breakdowns';

// Helper function to get Authorization header with JWT token
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchBreakdowns = async (pageNumber = 1, pageSize = 6) => {
  try {
    const response = await axios.get(API_URL, {
      params: { PageNumber: pageNumber, PageSize: pageSize },
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    const metaData = response.headers['x-pagination']
      ? JSON.parse(response.headers['x-pagination'])
      : {
          CurrentPage: 1,
          TotalPages: 1,
          PageSize: pageSize,
          TotalCount: 0,
          HasPrevious: false,
          HasNext: false,
        };

    const items = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);

    return {
      items,
      metaData,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра поломок.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить поломки.');
    }
    console.error('Ошибка при загрузке данных:', error);
    return {
      items: [],
      metaData: {
        CurrentPage: 1,
        TotalPages: 1,
        PageSize: pageSize,
        TotalCount: 0,
        HasPrevious: false,
        HasNext: false,
      },
    };
  }
};

export const createBreakdown = async (breakdown) => {
  try {
    const response = await axios.post(API_URL, breakdown, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для создания поломки.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось создать поломку.');
    }
    console.error('Ошибка при создании поломки:', error);
    return null;
  }
};

export const updateBreakdown = async (id, breakdown) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, breakdown, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для обновления поломки.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось обновить поломку.');
    }
    console.error('Ошибка при обновлении поломки:', error);
    return null;
  }
};

export const deleteBreakdown = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для удаления поломки.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось удалить поломку.');
    }
    console.error('Ошибка при удалении поломки:', error);
    return null;
  }
};