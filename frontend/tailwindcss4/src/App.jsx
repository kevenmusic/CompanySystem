import React, { useState, useEffect, useContext } from "react";
import { useToast, Flex, Box } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import AuthModals from "./components/AuthModals";
import BreakdownModals from "./components/BreakdownModals";
import EmployeeModals from "./components/EmployeeModals";
import Pagination from "./components/Pagination";
import { login, logout } from "./services/auth";
import {
  createBreakdown,
  fetchBreakdowns,
  updateBreakdown,
  deleteBreakdown,
} from "./services/breakdowns";
import {
  createEmployee,
  fetchEmployees,
  fetchAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "./services/employees";
import { fetchDepartments } from "./services/departments";
import { fetchUsers } from "./services/users";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const {
    user,
    isLoading: authLoading,
    authLogin,
    logout: authLogout,
    hasRole,
  } = useContext(AuthContext);

  // Состояние данных
  const [breakdowns, setBreakdowns] = useState([]);
  const [employees, setEmployees] = useState([]); // Для пагинации
  const [allEmployees, setAllEmployees] = useState([]); // Для <Select>
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  // Состояние для модальных окон
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] = useState(false);

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

  const toast = useToast();

  // Проверка ролей
  const hasRequiredRole = () => {
    return hasRole("User") || hasRole("Admin");
  };

  // Загрузка справочных данных (один раз при авторизации)
  useEffect(() => {
    const loadReferenceData = async () => {
      if (!user) {
        // Очищаем данные при выходе
        setUsers([]);
        setDepartments([]);
        setAllEmployees([]); // Очищаем список сотрудников для <Select>
        return;
      }

      try {
        // Загружаем справочные данные
        const [usersData, departmentsData, employeesData] = await Promise.all([
          fetchUsers(),
          fetchDepartments(),
          fetchAllEmployees(), // Загружаем полный список сотрудников для <Select>
        ]);

        setUsers(usersData);
        setDepartments(departmentsData.items || departmentsData);
        setAllEmployees(employeesData); // Сохраняем полный список сотрудников
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

    loadReferenceData();
  }, [user, toast]);

  // Загрузка поломок
  useEffect(() => {
    const loadBreakdowns = async () => {
      if (!user || activeTab !== 0) return;

      try {
        const breakdownsData = await fetchBreakdowns(breakdownsPageNumber, pageSize);
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
  }, [user, activeTab, breakdownsPageNumber, pageSize, toast]);

  // Загрузка сотрудников для пагинации
  useEffect(() => {
    const loadEmployees = async () => {
      if (!user || activeTab !== 1) return;

      try {
        const employeesData = await fetchEmployees(employeesPageNumber, pageSize);
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
  }, [user, activeTab, employeesPageNumber, pageSize, toast]);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    // При смене вкладки сбрасываем страницу на первую
    if (tabIndex === 0) {
      setBreakdownsPageNumber(1);
    } else if (tabIndex === 1) {
      setEmployeesPageNumber(1);
    }
  };

  // Функции для работы с поломками
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
    
    const created = await createBreakdown(breakdown);
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
    console.log('Updating breakdown:', updatedBreakdown);
    const updated = await updateBreakdown(selectedBreakdown.id, updatedBreakdown);
    if (updated) {
      const { items, metaData } = await fetchBreakdowns(breakdownsPageNumber, pageSize);
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
    if (!hasRole('Admin')) {
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
    if (!hasRole('Admin')) {
      toast({
        title: "Ошибка",
        description: "Недостаточно прав для выполнения действия",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedEmployee(employee);
    setIsEditEmployeeModalOpen(true);
  };

  const onUpdateEmployee = async (updatedEmployee) => {
    const updated = await updateEmployee(selectedEmployee.id, updatedEmployee);
    if (updated) {
      const { items, metaData } = await fetchEmployees(employeesPageNumber, pageSize);
      setEmployees(items);
      setEmployeesMetaData(metaData);
      setIsEditEmployeeModalOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Сотрудник обновлен",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDeleteEmployee = (employee) => {
    if (!hasRole('Admin')) {
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

  // Функции для аутентификации
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      authLogout();
      setBreakdowns([]);
      setEmployees([]);
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
      setBreakdownsPageNumber(1);
      setEmployeesPageNumber(1);
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
        setActiveTab={handleTabChange}
        user={user}
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        onLoginOpen={() => setIsLoginOpen(true)}
        onRegisterOpen={() => setIsRegisterOpen(true)}
        setShowCreateEmployeeForm={setShowCreateEmployeeForm}
      />

      <Box className="flex-1 flex flex-col">
        <MainContent
          activeTab={activeTab}
          user={user}
          hasRole={hasRole}
          breakdowns={breakdowns}
          employees={employees}
          departments={departments}
          users={users}
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          onCreate={onCreate}
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
          onUpdate={onUpdate}
          onConfirmDelete={onConfirmDelete}
          employees={allEmployees}
          departments={departments}
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
        />
      </Flex>
    );
  }

  export default App;