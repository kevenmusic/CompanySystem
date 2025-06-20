// employees.js - оптимизированный сервис
import axios from 'axios';

const API_URL = 'http://localhost:5299/api/employees';

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
export const fetchEmployees = async (pageNumber = 1, pageSize = 6) => {
  try {
    console.log(`Debug - Fetching employees for pagination: page ${pageNumber}, size ${pageSize}`);
    
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

    console.log('Debug - Paginated employees response:', response.data);

    // Извлекаем метаданные пагинации из заголовков
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

    // Обрабатываем данные сотрудников
    const items = (Array.isArray(response.data) ? response.data : [response.data].filter(Boolean))
      .map(item => ({
        ...item,
        // Дополнительная обработка данных при необходимости
      }));

    console.log(`Debug - Processed ${items.length} employees for pagination`);

    return {
      items,
      metaData,
    };
  } catch (error) {
    console.error('Debug - Error fetching employees for pagination:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра сотрудников.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить сотрудников.');
    }
    
    // Возвращаем пустой результат при ошибке
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
export const fetchAllEmployees = async () => {
  try {
    console.log('Debug - Fetching all employees for select lists');
    
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });

    console.log('Debug - All employees response:', response.data);

    // Обрабатываем данные
    const items = Array.isArray(response.data) 
      ? response.data 
      : [response.data].filter(Boolean);

    // Возвращаем обработанные данные с дополнительными полями для Select
    const processedItems = items.map(item => ({
      ...item,
      // Добавляем поля для удобства использования в Select
      label: item.name || `${item.firstName} ${item.lastName}` || `Employee ${item.id}`,
      value: item.id,
    }));

    console.log(`Debug - Processed ${processedItems.length} employees for select lists`);
    return processedItems;
    
  } catch (error) {
    console.error('Debug - Error fetching all employees:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра сотрудников.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить сотрудников.');
    }
    
    return [];
  }
};

/**
 * Создание нового сотрудника
 */
export const createEmployee = async (employee) => {
  try {
    console.log('Debug - Creating employee:', employee);
    
    const response = await axios.post(API_URL, employee, {
      headers: getAuthHeader(),
    });
    
    console.log('Debug - Employee created:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Debug - Error creating employee:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для создания сотрудника.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Некорректные данные сотрудника.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось создать сотрудника.');
    }
    
    throw new Error('Неизвестная ошибка при создании сотрудника.');
  }
};

/**
 * Обновление сотрудника
 */
export const updateEmployee = async (id, employee) => {
  try {
    console.log(`Debug - Updating employee ${id}:`, employee);
    
    const response = await axios.put(`${API_URL}/${id}`, employee, {
      headers: getAuthHeader(),
    });
    
    console.log('Debug - Employee updated:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Debug - Error updating employee ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для обновления сотрудника.');
      }
      if (error.response?.status === 404) {
        throw new Error('Сотрудник не найден.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Некорректные данные сотрудника.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось обновить сотрудника.');
    }
    
    throw new Error('Неизвестная ошибка при обновлении сотрудника.');
  }
};

/**
 * Удаление сотрудника
 */
export const deleteEmployee = async (id) => {
  try {
    console.log(`Debug - Deleting employee ${id}`);
    
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    
    console.log(`Debug - Employee ${id} deleted successfully`);
    return id;
    
  } catch (error) {
    console.error(`Debug - Error deleting employee ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для удаления сотрудника.');
      }
      if (error.response?.status === 404) {
        throw new Error('Сотрудник не найден.');
      }
      if (error.response?.status === 409) {
        throw new Error('Невозможно удалить сотрудника, так как он используется в других записях.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось удалить сотрудника.');
    }
    
    throw new Error('Неизвестная ошибка при удалении сотрудника.');
  }
};