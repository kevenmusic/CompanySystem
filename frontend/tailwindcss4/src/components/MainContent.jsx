import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import BreakdownsTab from "./Tabs/BreakdownsTab";
import EmployeesTab from "./Tabs/EmployeesTab";
import DepartmentsTab from "./Tabs/DepartmentsTab";
import ProfileTab from "./Tabs/ProfileTab";
import CreateBreakdownForm from "../Forms/Breakdown/CreateBreakdownForm";
import CreateEmployeeForm from "../Forms/Employee/CreateEmployeeForm";
import CreateDepartmentForm from "../Forms/Department/CreateDepartmentForm";

function MainContent({
  activeTab,
  user,
  users,
  hasRole,
  breakdowns,
  employees,
  departments,
  allBreakdowns,
  allDepartments,
  allEmployees,
  employeeUsers,
  allEmployeesWithEmployeeRole,
  showCreateForm,
  setShowCreateForm,
  onCreate,
  onCreateByUser,
  onEdit,
  onDelete,
  handleLogout,
  onLoginOpen,
  onRegisterOpen,
  onEditEmployee,
  onDeleteEmployee,
  onCreateEmployee,
  showCreateEmployeeForm,
  setShowCreateEmployeeForm,
  onEditDepartment,
  onDeleteDepartment,
  onCreateDepartment,
  showCreateDepartmentForm,
  setShowCreateDepartmentForm,
  onComplete
}) {
  const getCurrentTab = () => {
    if (!user) {
      return "profile"; 
    }

    if (hasRole("Admin")) {
      switch (activeTab) {
        case 0:
          return "breakdowns";
        case 1:
          return "employees";
        case 2:
          return "departments";
        case 3:
          return "profile";
        default:
          return "breakdowns";
      }
    } else {
      switch (activeTab) {
        case 0:
          return "breakdowns";
        case 1:
          return "profile";
        default:
          return "breakdowns";
      }
    }
  };

  const currentTab = getCurrentTab();

  return (
    <Flex className="flex-1 overflow-hidden">
      <Box
        className={`${
          (showCreateForm && currentTab === "breakdowns") ||
          (showCreateEmployeeForm && currentTab === "employees") ||
          (showCreateDepartmentForm && currentTab === "departments")
            ? "w-2/3"
            : "w-full"
        } flex flex-col overflow-auto transition-all duration-300`}
      >
        <Box className="p-6">
          {currentTab === "breakdowns" && (
            <BreakdownsTab
              user={user}
              hasRole={hasRole}
              breakdowns={breakdowns}
              employees={employees}
              allBreakdowns={allBreakdowns}
              allEmployeesWithEmployeeRole={allEmployeesWithEmployeeRole}
              departments={departments}
              users={users}
              onEdit={onEdit}
              onDelete={onDelete}
              onLoginOpen={onLoginOpen}
              onRegisterOpen={onRegisterOpen}
              onComplete={onComplete}
            />
          )}

          {currentTab === "employees" && hasRole("Admin") && (
            <EmployeesTab
              user={user}
              allDepartments={allDepartments}
              employees={employees}
              allEmployees={allEmployees}
              users={users} 
              onEdit={onEditEmployee}
              employeeUsers={employeeUsers}
              onDelete={onDeleteEmployee}
              hasRole={hasRole}
            />
          )}

          {currentTab === "departments" && hasRole("Admin") && (
            <DepartmentsTab
              user={user}
              departments={departments}
              onEdit={onEditDepartment}
              onDelete={onDeleteDepartment}
              hasRole={hasRole}
            />
          )}

          {currentTab === "profile" && (
            <ProfileTab
              user={user}
              handleLogout={handleLogout}
              onLoginOpen={onLoginOpen}
              onRegisterOpen={onRegisterOpen}
            />
          )}
        </Box>
      </Box>

      {}
      {showCreateForm && currentTab === "breakdowns" && user && (
        <Box className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
          <Box className="mb-4 flex justify-between items-center">
            <Box fontSize="md" fontWeight="semibold">
              Создать поломку
            </Box>
            {!hasRole("Employee") && (
              <button
                className="text-sm bg-transparent border-0 cursor-pointer"
                onClick={() => setShowCreateForm(false)}
              >
              </button>
            )}
          </Box>
          <CreateBreakdownForm
            onCreate={onCreate}
            onCreateByUser={onCreateByUser}
            allEmployeesWithEmployeeRole={allEmployeesWithEmployeeRole}
            departments={allDepartments}
            users={users}
            currentUser={user}
            hasRole={hasRole}
          />
        </Box>
      )}

      {}
      {showCreateEmployeeForm &&
        currentTab === "employees" &&
        user &&
        hasRole("Admin") && (
          <Box className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
            <Box className="mb-4 flex justify-between items-center">
              <Box fontSize="md" fontWeight="semibold">
                Создать сотрудника
              </Box>
              <button
                className="text-sm bg-transparent border-0 cursor-pointer"
                onClick={() => setShowCreateEmployeeForm(false)}
              >
              </button>
            </Box>
            <CreateEmployeeForm
              onCreate={onCreateEmployee}
              departments={allDepartments}
              users={users} 
              employeeUsers={employeeUsers}
              onCancel={() => setShowCreateEmployeeForm(false)}
            />
          </Box>
        )}

      {}
      {showCreateDepartmentForm &&
        currentTab === "departments" &&
        user &&
        hasRole("Admin") && (
          <Box className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
            <Box className="mb-4 flex justify-between items-center">
              <Box fontSize="md" fontWeight="semibold">
                Создать отдел
              </Box>
              <button
                className="text-sm bg-transparent border-0 cursor-pointer"
                onClick={() => setShowCreateDepartmentForm(false)}
              >
              </button>
            </Box>
            <CreateDepartmentForm
              onCreate={onCreateDepartment}
              onCancel={() => setShowCreateDepartmentForm(false)}
            />
          </Box>
        )}
    </Flex>
  );
}

export default MainContent;