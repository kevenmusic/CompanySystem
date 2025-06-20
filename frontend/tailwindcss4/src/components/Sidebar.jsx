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
import { FiUser, FiLogIn, FiUserPlus } from 'react-icons/fi';

function Sidebar({
  activeTab,
  setActiveTab,
  user,
  showCreateForm,
  setShowCreateForm,
  showCreateEmployeeForm,
  setShowCreateEmployeeForm,
  onLoginOpen,
  onRegisterOpen,
}) {
  return (
    <Box className="w-64 bg-gray-50 border-r">
      <Tabs orientation="vertical" variant="enclosed" index={activeTab} onChange={setActiveTab}>
        <TabList className="p-4">
          <Tab className="w-full justify-start mb-2">Поломки</Tab>
          <Tab className="w-full justify-start mb-2">Сотрудники</Tab>
          <Tab className="w-full justify-start mb-2">Отделы</Tab>
          <Tab className="w-full justify-start mb-2">
            <Icon as={FiUser} mr={2} />
            Профиль
          </Tab>
        </TabList>
      </Tabs>

      {activeTab === 0 && user && (
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

      {activeTab === 1 && user && (
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
