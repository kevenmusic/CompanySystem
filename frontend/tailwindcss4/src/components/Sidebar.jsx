import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiUser, FiLogIn, FiUserPlus, FiTool } from 'react-icons/fi';

function Sidebar({
  activeTab,
  setActiveTab,
  user,
  hasRole,
  showCreateDepartmentForm,
  showCreateForm,
  setShowCreateForm,
  showCreateEmployeeForm,
  setShowCreateEmployeeForm,
  setShowCreateDepartmentForm,
  onLoginOpen,
  onRegisterOpen,
}) {
  const getTabsCount = () => {
    if (!user) return 1; 
    if (hasRole('Admin')) return 4; 
    return 2; 
  };

  const tabsCount = getTabsCount();

  React.useEffect(() => {
    if (activeTab >= tabsCount) {
      setActiveTab(tabsCount - 1);
    }
  }, [activeTab, tabsCount, setActiveTab]);

  return (
    <Box className="w-64 bg-gray-50 border-r">
      <Tabs 
        orientation="vertical" 
        variant="enclosed" 
        index={Math.min(activeTab, tabsCount - 1)} 
        onChange={setActiveTab}
      >
        <TabList className="p-4">
          {}
          {user && (
            <Tab className="w-full justify-start mb-2">
              <Icon as={FiTool} mr={2} />
              {hasRole('Admin') ? 'Все поломки' : 'Мои поломки'}
            </Tab>
          )}
          
          {}
          {user && hasRole('Admin') && (
            <Tab className="w-full justify-start mb-2">Сотрудники</Tab>
          )}
          
          {}
          {user && hasRole('Admin') && (
            <Tab className="w-full justify-start mb-2">Отделы</Tab>
          )}
          
          {}
          <Tab className="w-full justify-start mb-2">
            <Icon as={FiUser} mr={2} />
            Профиль
          </Tab>
        </TabList>
      </Tabs>

      {}
      {activeTab === 0 && user && !hasRole('Employee') && (
        <Box className="p-4 border-t">
          <Button
            colorScheme="blue"
            size="sm"
            width="full"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Отменить' : 'Создать поломку'}
          </Button>
        </Box>
      )}

      {}
      {activeTab === 1 && user && hasRole('Admin') && (
        <Box className="p-4 border-t">
          <Button
            colorScheme="blue"
            size="sm"
            width="full"
            onClick={() => setShowCreateEmployeeForm(!showCreateEmployeeForm)}
          >
            {showCreateEmployeeForm ? 'Отменить' : 'Добавить сотрудника'}
          </Button>
        </Box>
      )}

      {}
      {activeTab === 2 && user && hasRole('Admin') && (
        <Box className="p-4 border-t">
          <Button
            colorScheme="blue"
            size="sm"
            width="full"
            onClick={() => setShowCreateDepartmentForm(!showCreateDepartmentForm)}
          >
            {showCreateDepartmentForm ? 'Отменить' : 'Создать отдел'}
          </Button>
        </Box>
      )}

      {}
      {!user && (
        <Box className="p-4 border-t">
          <VStack spacing={2}>
            <Button
              leftIcon={<FiLogIn />}
              colorScheme="blue"
              size="sm"
              width="full"
              onClick={onLoginOpen}
            >
              Вход
            </Button>
            <Button
              leftIcon={<FiUserPlus />}
              colorScheme="green"
              variant="outline"
              size="sm"
              width="full"
              onClick={onRegisterOpen}
            >
              Регистрация
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;