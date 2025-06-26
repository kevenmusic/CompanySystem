// src/components/Tabs/DepartmentsTab.js
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
import { FiLayers } from 'react-icons/fi';

function DepartmentsTab({ user, departments, onEdit, onDelete, hasRole }) {
  if (!user || !hasRole('Admin')) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <Icon as={FiLayers} boxSize={20} color="gray.300" />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {departments.length > 0 ? (
        departments.map((department) => (
          <Card key={department.id} shadow="md">
            <CardHeader>
              <Heading size="md">Отдел #{department.id}</Heading>
            </CardHeader>
            <CardBody>
              <Text className="mb-2">
                <strong>Название:</strong> {department.name}
              </Text>
              <Text className="mb-4">
                <strong>Менеджер:</strong> {department.managerFullName}
              </Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onEdit(department)}
                >
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(department)}
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
                Нет отделов для отображения
              </Text>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DepartmentsTab;
