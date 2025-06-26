import axios from 'axios';

const API_URL = 'http://localhost:5299/api/employees';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const getNoCacheHeaders = () => ({
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Expires: '0',
});

export const fetchEmployees = async (pageNumber = 1, pageSize = 6) => {
  console.log(`Fetching employees: page ${pageNumber}, size ${pageSize}`);
  
  try {
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

    console.log("API Response:", response);
    console.log("Response headers:", response.headers);

    // Проверяем наличие данных
    if (!response.data) {
      console.warn("No data in response");
      return {
        items: [],
        metaData: {
          CurrentPage: pageNumber,
          TotalPages: 1,
          PageSize: pageSize,
          TotalCount: 0,
          HasPrevious: false,
          HasNext: false,
        },
      };
    }

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

    console.log("Parsed metaData:", metaData);

    const items = (Array.isArray(response.data) ? response.data : [response.data])
      .filter(Boolean)
      .map(item => ({
        ...item,
      }));

    console.log("Processed items:", items);

    return {
      items,
      metaData,
    };
  } catch (error) {
    console.error("fetchEmployees error:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра сотрудников.');
      }
      console.error("API Error response:", error.response?.data);
      throw new Error(error.response?.data?.message || 'Не удалось загрузить сотрудников.');
    }
    
    // В случае ошибки возвращаем пустой результат вместо throw
    console.error("Non-axios error:", error);
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

export const fetchAllEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });

    const items = Array.isArray(response.data) 
      ? response.data 
      : [response.data].filter(Boolean);

    return items.map(item => ({
      ...item,
      label: item.name || `${item.firstName} ${item.lastName}` || `Employee ${item.id}`,
      value: item.id,
    }));
  } catch (error) {
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

// НОВАЯ ФУНКЦИЯ: Получить сотрудника по ID
export const fetchEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 404) {
        throw new Error(`Сотрудник с ID ${id} не найден.`);
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить сотрудника.');
    }
    throw new Error('Неизвестная ошибка при загрузке сотрудника.');
  }
};

// НОВАЯ ФУНКЦИЯ: Получить всех сотрудников с ролью Employee
export const fetchAllEmployeesWithEmployeeRole = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees-with-role`, {
      headers: {
        ...getAuthHeader(),
        ...getNoCacheHeaders(),
      },
    });

    const items = Array.isArray(response.data) 
      ? response.data 
      : [response.data].filter(Boolean);

    return items.map(item => ({
      ...item,
      label: item.name || `${item.firstName} ${item.lastName}` || `Employee ${item.id}`,
      value: item.id,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра сотрудников с ролью Employee.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить сотрудников с ролью Employee.');
    }
    return [];
  }
};

export const createEmployee = async (employee) => {
  try {
    const response = await axios.post(API_URL, employee, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
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

export const updateEmployee = async (id, employee) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, employee, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
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

export const deleteEmployee = async (id) => {
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

/**
 * Получить список поломок для сотрудника по id
 */
export const fetchBreakdownsForEmployee = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/breakdowns`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
      }
      if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для просмотра поломок сотрудника.');
      }
      if (error.response?.status === 404) {
        throw new Error('Сотрудник не найден.');
      }
      throw new Error(error.response?.data?.message || 'Не удалось загрузить поломки сотрудника.');
    }
    throw new Error('Неизвестная ошибка при загрузке поломок сотрудника.');
  }
};