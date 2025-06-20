import React from "react";
import {
  Center,
  VStack,
  Icon,
  Heading,
  Text,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { FiUser, FiLogIn, FiUserPlus } from "react-icons/fi";

function BreakdownsTab({
  user,
  hasRole,
  breakdowns,
  employees,
  departments,
  users = [],
  onEdit,
  onDelete,
  onLoginOpen,
  onRegisterOpen,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "В работе":
        return "blue";
      case "Выполнено":
        return "green";
      case "Отменено":
        return "red";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : "Неизвестно";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Неизвестно";
  };

  // Улучшенная функция поиска пользователя
  const getUserName = (userId) => {
    console.log('Debug - getUserName called with userId:', userId, typeof userId);
    
    // Проверяем, что userId существует и не равен null/undefined/0
    if (userId === null || userId === undefined || userId === 0 || userId === '0') {
      return "Не назначен";
    }
    
    // Проверяем наличие массива пользователей
    if (!users || !Array.isArray(users) || users.length === 0) {
      console.log('Debug - No users array available');
      return "Пользователи не загружены";
    }
    
    // Приводим userId к числу для сравнения (на случай если приходит строка)
    const userIdToFind = parseInt(userId, 10);
    
    // Если после приведения к числу получили 0 или NaN, считаем не назначенным
    if (userIdToFind === 0 || isNaN(userIdToFind)) {
      return "Не назначен";
    }
    
    // Ищем пользователя по ID
    const foundUser = users.find((usr) => {
      const currentUserId = parseInt(usr.id, 10);
      return currentUserId === userIdToFind;
    });
    
    console.log('Debug - Found user for ID', userIdToFind, ':', foundUser);
    
    if (foundUser) {
      return foundUser.username || foundUser.name || `User ID: ${foundUser.id}`;
    }
    
    return `Пользователь ID: ${userId}`;
  };

  if (!user) {
    return (
      <Center h="60vh">
        <VStack spacing={6}>
          <Icon as={FiUser} boxSize={20} color="gray.300" />
          <VStack spacing={4}>
            <Heading size="lg" color="gray.600">
              Требуется авторизация
            </Heading>
            <Text color="gray.500" fontSize="lg" textAlign="center">
              Пожалуйста, войдите в аккаунт
            </Text>
            <HStack spacing={4}>
              <Button
                leftIcon={<FiLogIn />}
                colorScheme="blue"
                onClick={onLoginOpen}
              >
                Войти
              </Button>
              <Button
                leftIcon={<FiUserPlus />}
                colorScheme="green"
                variant="outline"
                onClick={onRegisterOpen}
              >
                Регистрация
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Center>
    );
  }

  if (!hasRole("Admin")) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <Text color="gray.500" fontSize="lg" textAlign="center">
            Поломки доступны только администратору
          </Text>
        </VStack>
      </Center>
    );
  }

  // Дополнительная отладочная информация
  console.log('Debug - All breakdowns:', breakdowns);
  console.log('Debug - All users in component:', users);
  console.log('Debug - Users array length:', users?.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {breakdowns.length > 0 ? (
        breakdowns.map((breakdown) => {
          console.log('Debug - Processing breakdown:', breakdown.id, 'userId:', breakdown.userId, 'type:', typeof breakdown.userId);
          return (
            <Card key={breakdown.id} shadow="md">
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Поломка #{breakdown.id}</Heading>
                  <Badge colorScheme={getStatusColor(breakdown.status)}>
                    {breakdown.status}
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text className="mb-2">
                  <strong>Описание:</strong> {breakdown.description}
                </Text>
                <Text className="mb-2">
                  <strong>Дата:</strong> {formatDate(breakdown.dateReported)}
                </Text>
                <Text className="mb-2">
                  <strong>Сотрудник:</strong>{" "}
                  {getEmployeeName(breakdown.employeeId)}
                </Text>
                <Text className="mb-2">
                  <strong>Отдел:</strong>{" "}
                  {getDepartmentName(breakdown.departmentId)}
                </Text>
                <Text className="mb-4">
                  <strong>Пользователь:</strong> {getUserName(breakdown.userId)}
                </Text>
                <Flex gap={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => onEdit(breakdown)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => onDelete(breakdown)}
                  >
                    Удалить
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          );
        })
      ) : (
        <div className="col-span-full">
          <Card>
            <CardBody>
              <Text color="gray.500" fontSize="lg" textAlign="center">
                Нет поломок для отображения
              </Text>
            </CardBody>
          </Card>
        </div>
      )}
      {breakdowns.length < 6 &&
        breakdowns.length > 0 &&
        Array.from({ length: 6 - breakdowns.length }).map((_, index) => (
          <Card key={`empty-${index}`} bg="gray.50">
            <CardBody>
              <Text color="gray.400" textAlign="center">
                Пусто
              </Text>
            </CardBody>
          </Card>
        ))}
    </div>
  );
}

export default BreakdownsTab;