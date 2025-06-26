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

// Fetch with pagination (Admin only)
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
    handleAxiosError(error);
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

// Fetch all without pagination (Admin only)
export const fetchAllBreakdowns = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    const items = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);

    return items;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

// Fetch breakdowns by user ID with pagination
export const fetchUserBreakdowns = async (userId, pageNumber = 1, pageSize = 8) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
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
    handleAxiosError(error);
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

// Fetch breakdown by ID (Admin only)
export const fetchBreakdownById = async (breakdownId) => {
  try {
    const response = await axios.get(`${API_URL}/${breakdownId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'получения поломки');
    return null;
  }
};

// Create breakdown by Admin
export const createBreakdownByAdmin = async (breakdown) => {
  try {
    const response = await axios.post(`${API_URL}/admin`, breakdown, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'создания поломки администратором');
    return null;
  }
};

// Create breakdown by User
export const createBreakdownByUser = async (breakdown) => {
  try {
    const response = await axios.post(`${API_URL}/user`, breakdown, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'создания поломки пользователем');
    return null;
  }
};


// Update breakdown (Admin only)
export const updateBreakdown = async (id, breakdown) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, breakdown, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'обновления поломки');
    return null;
  }
};

// Update breakdown status by Employee
export const updateBreakdownStatusByEmployee = async (breakdownId, statusData) => {
  try {
    const response = await axios.patch(`${API_URL}/${breakdownId}/status`, statusData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'обновления статуса поломки');
    return null;
  }
};

// Fetch breakdowns by employee ID
export const fetchBreakdownsByEmployee = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/employee/${employeeId}`, {
      headers: {
        ...getAuthHeader(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    const items = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
    return items;
  } catch (error) {
    handleAxiosError(error, 'получения поломок сотрудника');
    return [];
  }
};

// Delete breakdown (Admin only)
export const deleteBreakdown = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  } catch (error) {
    handleAxiosError(error, 'удаления поломки');
    return null;
  }
};

// Common error handler
const handleAxiosError = (error, action = 'загрузки поломок') => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
    }
    if (error.response?.status === 403) {
      throw new Error(`Недостаточно прав для ${action}.`);
    }
    if (error.response?.status === 404) {
      throw new Error('Запрошенная поломка не найдена.');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Некорректные данные запроса.');
    }
    throw new Error(error.response?.data?.message || `Не удалось выполнить операцию: ${action}.`);
  }
  throw new Error(`Неизвестная ошибка при ${action}.`);
};