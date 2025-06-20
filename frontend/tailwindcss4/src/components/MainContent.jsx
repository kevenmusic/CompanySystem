import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import BreakdownsTab from './Tabs/BreakdownsTab';
import EmployeesTab from './Tabs/EmployeesTab';
import ProfileTab from './Tabs/ProfileTab';
import CreateBreakdownForm from '../Forms/Breakdown/CreateBreakdownForm';
import CreateEmployeeForm from '../Forms/Employee/CreateEmployeeForm';

function MainContent({
  activeTab,
  user,
  users,
  hasRole,
  breakdowns,
  employees,
  departments,
  showCreateForm, // для поломок
  setShowCreateForm, // для поломок
  onCreate, // для поломок
  onEdit, // для поломок
  onDelete, // для поломок
  handleLogout,
  onLoginOpen,
  onRegisterOpen,
  onEditEmployee,
  onDeleteEmployee,
  onCreateEmployee,
  showCreateEmployeeForm,
  setShowCreateEmployeeForm,
}) {
  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Неизвестно';
  };

  const getUserName = (userId) => {
    if (!users || users.length === 0) return 'Неизвестно';
    const user = users.find(usr => usr.id === userId);
    return user ? user.username : 'Неизвестно';
  };

  return (
    <Flex className="flex-1 overflow-hidden">
  <Box
    className={`${showCreateForm && activeTab === 0 ? 'w-2/3' : showCreateEmployeeForm && activeTab === 1 ? 'w-2/3' : 'w-full'} flex flex-col overflow-auto transition-all duration-300`}
  >
    <Box className="p-6">
      {activeTab === 0 && (
        <BreakdownsTab
          user={user}
          hasRole={hasRole}
          breakdowns={breakdowns}
          employees={employees}
          departments={departments}
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
          onLoginOpen={onLoginOpen}
          onRegisterOpen={onRegisterOpen}
        />
      )}

      {activeTab === 1 && (
        <EmployeesTab
          user={user}
          employees={employees}
          onEdit={onEditEmployee}
          onDelete={onDeleteEmployee}
          hasRole={hasRole}
        />
      )}

      {activeTab === 3 && (
        <ProfileTab
          user={user}
          handleLogout={handleLogout}
          onLoginOpen={onLoginOpen}
          onRegisterOpen={onRegisterOpen}
        />
      )}
    </Box>
  </Box>

  {/* Боковая панель для создания поломки */}
  {showCreateForm && activeTab === 0 && user && (
    <Box className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
      <Box className="mb-4 flex justify-between items-center">
        <Box fontSize="md" fontWeight="semibold">Создать поломку</Box>
        <button
          className="text-sm bg-transparent border-0 cursor-pointer"
          onClick={() => setShowCreateForm(false)}
        >
          ✕
        </button>
      </Box>
      <CreateBreakdownForm
        onCreate={onCreate}
        employees={employees}
        departments={departments}
        users={users}
      />
    </Box>
  )}

  {/* Боковая панель для создания сотрудника */}
  {showCreateEmployeeForm && activeTab === 1 && user && (
    <Box className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
      <Box className="mb-4 flex justify-between items-center">
        <Box fontSize="md" fontWeight="semibold">Создать сотрудника</Box>
        <button
          className="text-sm bg-transparent border-0 cursor-pointer"
          onClick={() => setShowCreateEmployeeForm(false)}
        >
          ✕
        </button>
      </Box>
      <CreateEmployeeForm
        onCreate={onCreateEmployee}
        onCancel={() => setShowCreateEmployeeForm(false)}
      />
    </Box>
  )}
</Flex>

  );
}

export default MainContent;