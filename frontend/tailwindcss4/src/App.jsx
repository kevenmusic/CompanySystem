import React, { useState, useEffect, useContext } from "react";
import { useToast, Flex, Box } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import AuthModals from "./components/AuthModals";
import BreakdownModals from "./components/BreakdownModals";
import EmployeeModals from "./components/EmployeeModals";
import DepartmentModals from "./components/DepartmentModals";
import Pagination from "./components/Pagination";
import { login, logout } from "./services/auth";
import {
  createBreakdownByAdmin,
  fetchBreakdowns,
  fetchAllBreakdowns,
  fetchUserBreakdowns,
  updateBreakdown,
  deleteBreakdown,
  createBreakdownByUser,
  updateBreakdownStatusByEmployee,
} from "./services/breakdowns";
import {
  createEmployee,
  fetchEmployees,
  fetchAllEmployees,
  fetchAllEmployeesWithEmployeeRole,
  updateEmployee,
  deleteEmployee,
} from "./services/employees";
import {
  fetchDepartments,
  fetchAllDepartments,
  updateDepartment,
  deleteDepartment,
  createDepartment,
} from "./services/departments";
import { fetchUsers, fetchBreakdownsByUserId, fetchEmployeeUsers } from "./services/users";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const {
    user,
    isLoading: authLoading,
    authLogin,
    logout: authLogout,
    hasRole,
  } = useContext(AuthContext);

  // Состояние данных для пагинации
  const [breakdowns, setBreakdowns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Состояние данных для селектов и справочников
  const [allEmployees, setAllEmployees] = useState([]);
  const [allEmployeesWithEmployeeRole, setAllEmployeesWithEmployeeRole] =
    useState([]);
  const [employeeUsers, setEmployeeUsers] =
    useState([]);
  const [allBreakdowns, setAllBreakdowns] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  // Состояние для модальных окон
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] =
    useState(false);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] =
    useState(false);
  const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] =
    useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] =
    useState(false);

  // Состояние для UI
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateEmployeeForm, setShowCreateEmployeeForm] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Пагинация
  const [pageSize] = useState(6);
  const [breakdownsPageNumber, setBreakdownsPageNumber] = useState(1);
  const [employeesPageNumber, setEmployeesPageNumber] = useState(1);
  const [departmentsPageNumber, setDepartmentsPageNumber] = useState(1);

  const [breakdownsMetaData, setBreakdownsMetaData] = useState({
    CurrentPage: 1,
    TotalPages: 1,
    PageSize: 6,
    TotalCount: 0,
    HasPrevious: false,
    HasNext: false,
  });

  const [employeesMetaData, setEmployeesMetaData] = useState({
    CurrentPage: 1,
    TotalPages: 1,
    PageSize: 6,
    TotalCount: 0,
    HasPrevious: false,
    HasNext: false,
  });

  const [departmentsMetaData, setDepartmentsMetaData] = useState({
    CurrentPage: 1,
    TotalPages: 1,
    PageSize: 6,
    TotalCount: 0,
    HasPrevious: false,
    HasNext: false,
  });

  const toast = useToast();

  // Проверка ролей
  const hasRequiredRole = () => {
    return hasRole("User") || hasRole("Admin") || hasRole("Employee");
  };

  // В компоненте, например, в начале
  const loadReferenceData = async () => {
    if (!user) {
      setUsers([]);
      setAllDepartments([]);
      setAllEmployeesWithEmployeeRole([]);
      setEmployeeUsers([])
      setAllEmployees([]);
      setAllBreakdowns([]);
      return;
    }

    try {
      const [
        usersData,
        allDepartmentsData,
        allEmployeesWithEmployeeRoleData,
        employeeUsersData,
        employeesData,
        allBreakdownsData,
      ] = await Promise.all([
        hasRole("Admin") ? fetchUsers() : Promise.resolve([]),
        fetchAllDepartments(),
        fetchAllEmployeesWithEmployeeRole(),
        fetchEmployeeUsers(),
        fetchAllEmployees(),
        hasRole("Admin") ? fetchAllBreakdowns() : Promise.resolve([]),
      ]);

      setUsers(usersData);
      setAllDepartments(allDepartmentsData);
      setAllEmployeesWithEmployeeRole(allEmployeesWithEmployeeRoleData);
      setEmployeeUsers(employeeUsersData);
      setAllEmployees(employeesData);
      setAllBreakdowns(allBreakdownsData);
    } catch (error) {
      console.error("Error loading reference data:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить справочные данные",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // useEffect, где вызывается loadReferenceData
  useEffect(() => {
    loadReferenceData();
  }, [user, hasRole, toast]);

  // Загрузка поломок для пагинации
  useEffect(() => {
    const loadBreakdowns = async () => {
      if (!user || activeTab !== 0) return;

      try {
        let breakdownsData;

        if (hasRole("Admin")) {
          // Админ видит все поломки
          breakdownsData = await fetchBreakdowns(
            breakdownsPageNumber,
            pageSize
          );
        } else if (hasRole("Employee")) {
          const userBreakdowns = await fetchBreakdownsByUserId(user.id);
          const startIndex = (breakdownsPageNumber - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedItems = userBreakdowns.slice(startIndex, endIndex);

          breakdownsData = {
            items: paginatedItems,
            metaData: {
              CurrentPage: breakdownsPageNumber,
              TotalPages: Math.ceil(userBreakdowns.length / pageSize),
              PageSize: pageSize,
              TotalCount: userBreakdowns.length,
              HasPrevious: breakdownsPageNumber > 1,
              HasNext:
                breakdownsPageNumber <
                Math.ceil(userBreakdowns.length / pageSize),
            },
          };
        } else {
          breakdownsData = await fetchUserBreakdowns(
            user.id,
            breakdownsPageNumber,
            pageSize
          );
        }

        setBreakdowns(breakdownsData.items);
        setBreakdownsMetaData(breakdownsData.metaData);
      } catch (error) {
        console.error("Error fetching breakdowns:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить поломки",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadBreakdowns();
  }, [user, activeTab, breakdownsPageNumber, pageSize, hasRole, toast]);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!user || activeTab !== 1 || !hasRole("Admin")) return;
      console.log(
        "Loading employees, page:",
        employeesPageNumber,
        "pageSize:",
        pageSize
      );
      try {
        const employeesData = await fetchEmployees(
          employeesPageNumber,
          pageSize
        );
        console.log("Employees loaded:", employeesData);
        setEmployees(employeesData.items);
        setEmployeesMetaData(employeesData.metaData);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сотрудников",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    loadEmployees();
  }, [user, activeTab, employeesPageNumber, pageSize, hasRole, toast]);

  // Загрузка отделов для пагинации
  useEffect(() => {
    const loadDepartments = async () => {
      if (!user || activeTab !== 2) return;

      try {
        const departmentsData = await fetchDepartments(
          departmentsPageNumber,
          pageSize
        );
        setDepartments(departmentsData.items);
        setDepartmentsMetaData(departmentsData.metaData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить отделы",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadDepartments();
  }, [user, activeTab, departmentsPageNumber, pageSize, toast]);

  const onCreate = async (breakdown) => {
    if (!hasRequiredRole()) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const created = await createBreakdownByAdmin(breakdown);
    if (created) {
      const { items, metaData } = await fetchBreakdowns(1, pageSize);
      setBreakdowns(items);
      setBreakdownsMetaData(metaData);
      setBreakdownsPageNumber(1);
      setShowCreateForm(false);
      toast({
        title: "Поломка создана",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать поломку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onCreateByUser = async (breakdown) => {
    try {
      const breakdownWithStatus = {
        ...breakdown,
        status: "Сообщено"
      };
  
      const created = await createBreakdownByUser(breakdownWithStatus);
  
      if (created) {
        const breakdownsData = await fetchUserBreakdowns(user.id, 1, pageSize);
        const { items, metaData } = breakdownsData;
  
        setBreakdowns(items);
        setBreakdownsMetaData(metaData);
        setBreakdownsPageNumber(1);
        setShowCreateForm(false); 
  
        toast({
          title: "Поломка создана",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось создать поломку",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании поломки",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };    
  
  const onEdit = (breakdown) => {
    if (!hasRequiredRole()) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedBreakdown(breakdown);
    setIsEditModalOpen(true);
  };

  const onUpdate = async (updatedBreakdown) => {
    console.log("Updating breakdown:", updatedBreakdown);
    const updated = await updateBreakdown(
      selectedBreakdown.id,
      updatedBreakdown
    );
    if (updated) {
      const { items, metaData } = await fetchBreakdowns(
        breakdownsPageNumber,
        pageSize
      );
      setBreakdowns(items);
      setBreakdownsMetaData(metaData);
      toast({
        title: "Поломка обновлена",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить поломку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onUpdateByEmployee = async (statusData) => {
    console.log("Updating breakdown status by user:", statusData);

    try {
      const updated = await updateBreakdownStatusByEmployee(
        selectedBreakdown.id,
        statusData
      );

      if (updated) {
        // Перезагрузка данных
        let breakdownsData;
        if (hasRole("Admin")) {
          breakdownsData = await fetchBreakdowns(
            breakdownsPageNumber,
            pageSize
          );
        } else if (hasRole("Employee")) {
          const userBreakdowns = await fetchBreakdownsByUserId(user.id);
          const startIndex = (breakdownsPageNumber - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedItems = userBreakdowns.slice(startIndex, endIndex);

          breakdownsData = {
            items: paginatedItems,
            metaData: {
              CurrentPage: breakdownsPageNumber,
              TotalPages: Math.ceil(userBreakdowns.length / pageSize),
              PageSize: pageSize,
              TotalCount: userBreakdowns.length,
              HasPrevious: breakdownsPageNumber > 1,
              HasNext:
                breakdownsPageNumber <
                Math.ceil(userBreakdowns.length / pageSize),
            },
          };
        } else {
          breakdownsData = await fetchUserBreakdowns(
            user.id,
            breakdownsPageNumber,
            pageSize
          );
        }

        setBreakdowns(breakdownsData.items);
        setBreakdownsMetaData(breakdownsData.metaData);

        toast({
          title: "Статус поломки обновлён",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус поломки",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);

      // Попытка получить текст ошибки с бэкенда
      let errorMessage = "Произошла ошибка при обновлении статуса поломки";
      if (error?.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Ошибка",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDelete = (breakdown) => {
    if (!hasRequiredRole()) {
      toast({
        title: "Ошибка",
        description: "Требуется авторизация",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedBreakdown(breakdown);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async (id) => {
    const result = await deleteBreakdown(id);
    if (result) {
      let newPage = breakdownsPageNumber;
      if (breakdowns.length === 1 && breakdownsPageNumber > 1) {
        newPage = breakdownsPageNumber - 1;
      }
      const { items, metaData } = await fetchBreakdowns(newPage, pageSize);
      setBreakdowns(items);
      setBreakdownsMetaData(metaData);
      setBreakdownsPageNumber(newPage);
      toast({
        title: "Поломка удалена",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить поломку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Функции для работы с сотрудниками
  const onCreateEmployee = async (employee) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const created = await createEmployee(employee);
    if (created) {
      const { items, metaData } = await fetchEmployees(1, pageSize);
      setEmployees(items);
      setEmployeesMetaData(metaData);
      setEmployeesPageNumber(1);
      setShowCreateEmployeeForm(false);

      // ИСПРАВЛЕНИЕ: Обновляем справочные данные после создания
      await loadReferenceData();

      toast({
        title: "Сотрудник создан",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onEditEmployee = (employee) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("PUT payload:", employee);
      return;
    }
    setSelectedEmployee(employee);
    setIsEditEmployeeModalOpen(true);
  };

  // В onUpdateEmployee просто вызываешь эту функцию:
  const onUpdateEmployee = async (updatedEmployee) => {
    try {
      const updated = await updateEmployee(
        selectedEmployee.id,
        updatedEmployee
      );
      if (updated) {
        // ИСПРАВЛЕНИЕ: Обновляем пагинированные данные employees
        const { items, metaData } = await fetchEmployees(
          employeesPageNumber,
          pageSize
        );
        setEmployees(items);
        setEmployeesMetaData(metaData);

        // Также обновляем справочные данные
        await loadReferenceData();

        setIsEditEmployeeModalOpen(false);
        setSelectedEmployee(null);

        toast({
          title: "Успех",
          description: "Сотрудник успешно обновлен",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDeleteEmployee = (employee) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Требуется авторизация",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedEmployee(employee);
    setIsDeleteEmployeeModalOpen(true);
  };

  const onConfirmDeleteEmployee = async (id) => {
    const result = await deleteEmployee(id);
    if (result) {
      let newPage = employeesPageNumber;
      if (employees.length === 1 && employeesPageNumber > 1) {
        newPage = employeesPageNumber - 1;
      }
      const { items, metaData } = await fetchEmployees(newPage, pageSize);
      setEmployees(items);
      setEmployeesMetaData(metaData);
      setEmployeesPageNumber(newPage);
      setIsDeleteEmployeeModalOpen(false);
      setSelectedEmployee(null);

      // ИСПРАВЛЕНИЕ: Обновляем справочные данные после удаления
      await loadReferenceData();

      toast({
        title: "Сотрудник удален",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Функции для работы с отделами
  const onCreateDepartment = async (department) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const created = await createDepartment(department);
    if (created) {
      const { items, metaData } = await fetchDepartments(1, pageSize);
      setDepartments(items);
      setDepartmentsMetaData(metaData);
      setDepartmentsPageNumber(1);
      setShowCreateDepartmentForm(false);
      toast({
        title: "Отдел создан",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать отдел",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onEditDepartment = (department) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedDepartment(department);
    setIsEditDepartmentModalOpen(true);
  };

  const onUpdateDepartment = async (updatedDepartment) => {
    try {
      const updated = await updateDepartment(
        selectedDepartment.id,
        updatedDepartment
      );
      if (updated) {
        const { items, metaData } = await fetchDepartments(
          departmentsPageNumber,
          pageSize
        );
        setDepartments(items);
        setDepartmentsMetaData(metaData);
        setIsEditDepartmentModalOpen(false);
        setSelectedDepartment(null);
        toast({
          title: "Отдел обновлен",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить отдел",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить отдел",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDeleteDepartment = (department) => {
    if (!hasRole("Admin")) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedDepartment(department);
    setIsDeleteDepartmentModalOpen(true);
  };

  const onConfirmDeleteDepartment = async (id) => {
    const result = await deleteDepartment(id);
    if (result) {
      let newPage = departmentsPageNumber;
      if (departments.length === 1 && departmentsPageNumber > 1) {
        newPage = departmentsPageNumber - 1;
      }
      const { items, metaData } = await fetchDepartments(newPage, pageSize);
      setDepartments(items);
      setDepartmentsMetaData(metaData);
      setDepartmentsPageNumber(newPage);
      setIsDeleteDepartmentModalOpen(false);
      setSelectedDepartment(null);
      toast({
        title: "Отдел удален",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить отдел",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Функции для аутентификации
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      authLogout();
      setBreakdowns([]);
      setEmployees([]);
      setDepartments([]);
      setBreakdownsMetaData({
        CurrentPage: 1,
        TotalPages: 1,
        PageSize: 6,
        TotalCount: 0,
        HasPrevious: false,
        HasNext: false,
      });
      setEmployeesMetaData({
        CurrentPage: 1,
        TotalPages: 1,
        PageSize: 6,
        TotalCount: 0,
        HasPrevious: false,
        HasNext: false,
      });
      setDepartmentsMetaData({
        CurrentPage: 1,
        TotalPages: 1,
        PageSize: 6,
        TotalCount: 0,
        HasPrevious: false,
        HasNext: false,
      });
      setBreakdownsPageNumber(1);
      setEmployeesPageNumber(1);
      setDepartmentsPageNumber(1);
      setActiveTab(0);
      toast({
        title: "Выход выполнен",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async (loginData) => {
    if (!loginData || !loginData.username || !loginData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const data = await login(loginData);
      authLogin(
        {
          id: data.id,
          username: data.username,
          roles: data.roles,
          employeeName: data.employeeName,
        },
        data.token
      );
      setIsLoginOpen(false);
      toast({
        title: "Успешный вход",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    toast({
      title: "Регистрация успешна",
      description: "Теперь вы можете войти в систему",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex className="h-screen">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        hasRole={(role) => user?.roles?.includes(role)}
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        showCreateEmployeeForm={showCreateEmployeeForm}
        setShowCreateEmployeeForm={setShowCreateEmployeeForm}
        showCreateDepartmentForm={showCreateDepartmentForm}
        setShowCreateDepartmentForm={setShowCreateDepartmentForm}
        onLoginOpen={() => setIsLoginOpen(true)}
        onRegisterOpen={() => setIsRegisterOpen(true)}
      />

      <Box className="flex-1 flex flex-col">
        <MainContent
          activeTab={activeTab}
          user={user}
          hasRole={hasRole}
          breakdowns={breakdowns}
          employees={employees}
          allEmployeesWithEmployeeRole={allEmployeesWithEmployeeRole}
          departments={departments}
          allEmployees={allEmployees}
          allDepartments={allDepartments}
          allBreakdowns={allBreakdowns}
          users={users}
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          onCreate={onCreate}
          onCreateByUser={onCreateByUser}
          onEdit={onEdit}
          onDelete={onDelete}
          handleLogout={handleLogout}
          onLoginOpen={() => setIsLoginOpen(true)}
          onRegisterOpen={() => setIsRegisterOpen(true)}
          onEditEmployee={onEditEmployee}
          onDeleteEmployee={onDeleteEmployee}
          onCreateEmployee={onCreateEmployee}
          showCreateEmployeeForm={showCreateEmployeeForm}
          setShowCreateEmployeeForm={setShowCreateEmployeeForm}
          onEditDepartment={onEditDepartment}
          onDeleteDepartment={onDeleteDepartment}
          onCreateDepartment={onCreateDepartment}
          showCreateDepartmentForm={showCreateDepartmentForm}
          employeeUsers={employeeUsers}
          setShowCreateDepartmentForm={setShowCreateDepartmentForm}
        />

        {activeTab === 0 && (
          <Pagination
            metaData={breakdownsMetaData}
            onPageChange={setBreakdownsPageNumber}
            pageSize={pageSize}
            colorScheme="blue"
          />
        )}

        {activeTab === 1 && (
          <Pagination
            metaData={employeesMetaData}
            onPageChange={setEmployeesPageNumber}
            pageSize={pageSize}
            colorScheme="blue"
          />
        )}

        {activeTab === 2 && (
          <Pagination
            metaData={departmentsMetaData}
            onPageChange={setDepartmentsPageNumber}
            pageSize={pageSize}
            colorScheme="blue"
          />
        )}
      </Box>

      <AuthModals
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onRegisterClose={() => setIsRegisterOpen(false)}
        onLoginOpen={() => setIsLoginOpen(true)}
        onRegisterOpen={() => setIsRegisterOpen(true)}
        handleLogin={handleLogin}
        handleRegisterSuccess={handleRegisterSuccess}
      />

      <BreakdownModals
        selectedBreakdown={selectedBreakdown}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseEdit={() => {
          setIsEditModalOpen(false);
          setSelectedBreakdown(null);
        }}
        onCloseDelete={() => {
          setIsDeleteModalOpen(false);
          setSelectedBreakdown(null);
        }}
        isEmployee={hasRole("Employee") && !hasRole("Admin")}
        onUpdate={onUpdate}
        onUpdateByEmployee={onUpdateByEmployee}
        onConfirmDelete={onConfirmDelete}
        employees={allEmployees}
        departments={allDepartments}
        allEmployeesWithEmployeeRole={allEmployeesWithEmployeeRole}
        users={users}
      />

      <EmployeeModals
        selectedEmployee={selectedEmployee}
        isEditModalOpen={isEditEmployeeModalOpen}
        isDeleteModalOpen={isDeleteEmployeeModalOpen}
        onCloseEdit={() => {
          setIsEditEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        onCloseDelete={() => {
          setIsDeleteEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        onUpdate={onUpdateEmployee}
        onConfirmDelete={onConfirmDeleteEmployee}
        departments={allDepartments}
        employeeUsers={employeeUsers}
        users={users}
      />

      <DepartmentModals
        selectedDepartment={selectedDepartment}
        isEditModalOpen={isEditDepartmentModalOpen}
        isDeleteModalOpen={isDeleteDepartmentModalOpen}
        onCloseEdit={() => {
          setIsEditDepartmentModalOpen(false);
          setSelectedDepartment(null);
        }}
        onCloseDelete={() => {
          setIsDeleteDepartmentModalOpen(false);
          setSelectedDepartment(null);
        }}
        onUpdate={onUpdateDepartment}
        onConfirmDelete={onConfirmDeleteDepartment}
      />
    </Flex>
  );
}

export default App;
