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
import { FiUser, FiLogIn, FiUserPlus, FiCheck, FiPlay } from "react-icons/fi";

function BreakdownsTab({
  user,
  hasRole,
  breakdowns,
  allEmployeesWithEmployeeRole,
  users,
  onEdit,
  onDelete,
  onLoginOpen,
  onRegisterOpen,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Сообщено":
        return "orange";
      case "В работе":
        return "blue";
      case "Завершена":
        return "green";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getEmployeeName = (employeeId) => {
    const employee = allEmployeesWithEmployeeRole.find((emp) => emp.id === employeeId);
    return employee ? employee.fullName : "Неизвестно";
  };

  const getUserName = (userId) => {
    const foundUser = users.find((us) => us.id == userId);
    return foundUser ? foundUser.username : `ID: ${userId}`;
  };

  const getEmployeeButtonText = (status) => {
    switch (status) {
      case "Сообщено":
        return "Принять";
      case "В работе":
        return "Завершить";
      case "Завершена":
        return "Завершена";
      default:
        return "Действие";
    }
  };

  const getEmployeeButtonIcon = (status) => {
    switch (status) {
      case "Сообщено":
        return FiPlay;
      case "В работе":
        return FiCheck;
      default:
        return FiCheck;
    }
  };

  const getEmployeeButtonColor = (status) => {
    switch (status) {
      case "Сообщено":
        return "blue";
      case "В работе":
        return "green";
      default:
        return "gray";
    }
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
              Пожалуйста, войдите в аккаунт для просмотра поломок
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

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg" color="gray.700">
        {hasRole("Admin") ? "Все поломки в системе" : "Мои поломки"}
      </Heading>

      {!hasRole("Admin") && (
        <Text color="gray.600" fontSize="md">
          Здесь отображаются поломки, которые вам назначены для выполнения
        </Text>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {breakdowns.length > 0 ? (
          breakdowns.map((breakdown) => (
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
                {/* Поле "Сотрудник" показываем только админам */}
                {hasRole("Admin") && (
                  <Text className="mb-2">
                    <strong>Сотрудник:</strong> {getEmployeeName(breakdown.employeeId)}
                  </Text>
                )}
                {hasRole("Admin") && (
                  <Text className="mb-4">
                    <strong>Создал:</strong> {getUserName(breakdown.userId)}
                  </Text>
                )}
                <Flex gap={2}>
                  {hasRole("Admin") && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => onEdit(breakdown)}
                    >
                      Редактировать
                    </Button>
                  )}
                  {hasRole("Employee") && !hasRole("Admin") && (
                    <Button
                      size="sm"
                      colorScheme={getEmployeeButtonColor(breakdown.status)}
                      leftIcon={React.createElement(getEmployeeButtonIcon(breakdown.status))}
                      onClick={() => onEdit(breakdown)}
                      disabled={breakdown.status === "Завершена"}
                    >
                      {getEmployeeButtonText(breakdown.status)}
                    </Button>
                  )}
                  {hasRole("Admin") && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => onDelete(breakdown)}
                    >
                      Удалить
                    </Button>
                  )}
                </Flex>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardBody>
                <Center py={8}>
                  <VStack spacing={4}>
                    <Text color="gray.500" fontSize="lg" textAlign="center">
                      {hasRole("Admin")
                        ? "Нет поломок в системе"
                        : "У вас нет созданных поломок"}
                    </Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      {hasRole("Admin")
                        ? "Поломки будут отображаться здесь после их создания"
                        : "Создайте новую поломку, чтобы она появилась в этом списке"}
                    </Text>
                  </VStack>
                </Center>
              </CardBody>
            </Card>
          </div>
        )}

        {breakdowns.length < 6 &&
          breakdowns.length > 0 &&
          Array.from({ length: 6 - breakdowns.length }).map((_, index) => (
            <Card key={`empty-${index}`} bg="gray.50" opacity={0.5}>
              <CardBody>
                <Center py={8}>
                  <Text color="gray.400" textAlign="center" fontSize="sm">
                    Пусто
                  </Text>
                </Center>
              </CardBody>
            </Card>
          ))}
      </div>
    </VStack>
  );
}

export default BreakdownsTab;