import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  VStack,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';

function EmployeesTab({ 
  user, 
  allDepartments, 
  allEmployees,
  employeeUsers, 
  employees, 
  users, // Добавляем users в пропсы
  onEdit, 
  onDelete, 
  hasRole 
}) {
  if (!user || !hasRole('Admin')) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <Icon as={FiUsers} boxSize={20} color="gray.300" />
          <Heading size="lg" color="gray.600">
            Доступ запрещен
          </Heading>
          <Text color="gray.500" fontSize="lg" textAlign="center">
            Этот раздел доступен только администраторам.
          </Text>
        </VStack>
      </Center>
    );
  }

  // Функция для получения имени отдела
  const getDepartmentName = (departmentId) => {
    const department = allDepartments.find((dep) => dep.id === departmentId);
    return department ? department.name : "Неизвестно";
  };

  // Функция для получения имени пользователя
  const getUserName = (userId) => {
    const foundUser = employeeUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.username : "Неизвестно";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {employees.length > 0 ? (
        employees.map((employee) => (
          <Card key={employee.id} shadow="md">
            <CardHeader>
              <Heading size="md">Сотрудник #{employee.id}</Heading>
            </CardHeader>
            <CardBody>
              <Text className="mb-2">
                <strong>Имя:</strong> {employee.fullName}
              </Text>
              <Text className="mb-2">
                <strong>Пользователь:</strong> {getUserName(employee.userId)}
              </Text>
              <Text className="mb-4">
                <strong>Отдел:</strong> {getDepartmentName(employee.departmentId)}
              </Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onEdit(employee)}
                >
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(employee)}
                >
                  Удалить
                </Button>
              </Flex>
            </CardBody>
          </Card>
        ))
      ) : (
        <div className="col-span-full">
          <Card>
            <CardBody>
              <Text color="gray.500" fontSize="lg" textAlign="center">
                Нет сотрудников для отображения
              </Text>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EmployeesTab;