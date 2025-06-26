// departments.js
import axios from 'axios';

const API_URL = 'http://localhost:5299/api/departments';

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

// Общие заголовки для предотвращения кэширования
const getNoCacheHeaders = () => ({
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '0',
});

/**
 * Fetch для пагинации (с параметрами страницы и размера)
 * Используется для отображения таблицы с постраничной навигацией
 */
export const fetchDepartments = async (pageNumber = 1, pageSize = 6) => {
  try {
    console.log(`Debug - Fetching departments for pagination: page ${pageNumber}, size ${pageSize}`);

    const response = await axios.get(API_URL, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize
      },
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });

    console.log('Debug - Paginated departments response:', response.data);

    const metaData = response.headers['x-pagination']
      ? JSON.parse(response.headers['x-pagination'])
      : {
          CurrentPage: pageNumber,
          TotalPages: Math.ceil((response.data?.length || 0) / pageSize),
          PageSize: pageSize,
          TotalCount: response.data?.length || 0,
          HasPrevious: pageNumber > 1,
          HasNext: false,
        };

    const items = (Array.isArray(response.data) ? response.data : [response.data].filter(Boolean))
      .map(item => ({
        ...item,
        // Дополнительная обработка данных при необходимости
      }));

    console.log(`Debug - Processed ${items.length} departments for pagination`);

    return {
      items,
      metaData,
    };
  } catch (error) {
    console.error('Debug - Error fetching departments for pagination:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра отделов.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить отделы.');
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

/**
 * Fetch для списков (все данные без пагинации)
 * Используется для Select компонентов и других списков выбора
 */
export const fetchAllDepartments = async () => {
  try {
    console.log('Debug - Fetching all departments for select lists');

    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });

    console.log('Debug - All departments response:', response.data);

    const items = Array.isArray(response.data)
      ? response.data
      : [response.data].filter(Boolean);

    const processedItems = items.map(item => ({
      ...item,
      label: item.name || `Department ${item.id}`,
      value: item.id,
    }));

    console.log(`Debug - Processed ${processedItems.length} departments for select lists`);
    return processedItems;

  } catch (error) {
    console.error('Debug - Error fetching all departments:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра отделов.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить отделы.');
    }

    return [];
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
