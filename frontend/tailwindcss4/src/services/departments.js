import axios from 'axios';

const API_URL = 'http://localhost:5299/api/departments';

// Вспомогательная функция для получения заголовка авторизации с JWT токеном
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  console.log("Debug - getAuthHeader token:", token);
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Получение списка департаментов с пагинацией
export const fetchDepartments = async (pageNumber = 1, pageSize = 6) => {
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

    console.log('Debug - Raw departments response:', response.data);

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

    const items = (Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)).map(item => ({
      ...item,
    }));

    console.log('Debug - Processed departments:', items);

    return {
      items,
      metaData,
    };
  } catch (error) {
    console.error('Debug - Error fetching departments:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра департаментов.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить департаменты.');
    }
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

// Создание нового департамента
export const createDepartment = async (department) => {
  try {
    const response = await axios.post(API_URL, department, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для создания департамента.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось создать департамент.');
    }
    console.error('Ошибка при создании департамента:', error);
    return null;
  }
};

// Обновление департамента по ID
export const updateDepartment = async (id, department) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, department, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для обновления департамента.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось обновить департамент.');
    }
    console.error('Ошибка при обновлении департамента:', error);
    return null;
  }
};

// Удаление департамента по ID
export const deleteDepartment = async (id) => {
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
        throw new Error('Недостаточно прав для удаления департамента.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось удалить департамент.');
    }
    console.error('Ошибка при удалении департамента:', error);
    return null;
  }
};
