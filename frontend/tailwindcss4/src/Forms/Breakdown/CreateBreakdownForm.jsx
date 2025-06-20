// src/Forms/Breakdown/CreateBreakdownForm.js
import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { AuthContext } from '../../Context/AuthContext';

function CreateBreakdownForm({ onCreate, employees, departments, users }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    description: '',
    employeeId: '',
    departmentId: '',
    userId: '',
    status: 'Open', // По умолчанию "Открыто"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Ошибка",
        description: "Описание поломки обязательно",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.employeeId) {
      toast({
        title: "Ошибка", 
        description: "Выберите сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.departmentId) {
      toast({
        title: "Ошибка",
        description: "Выберите отдел", 
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.userId) {
      toast({
        title: "Ошибка",
        description: "Выберите отдел", 
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Добавляем userId текущего пользователя
      const breakdownData = {
        ...formData,
        userId: user?.id || null,
        dateReported: new Date().toISOString(),
      };

      console.log('Debug - Creating breakdown with data:', breakdownData);
      
      await onCreate(breakdownData);
      
      // Сбрасываем форму после успешного создания
      setFormData({
        description: '',
        employeeId: '',
        departmentId: '',
        userId: '',
        status: 'Open',
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать поломку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Описание</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите поломку..."
              rows={3}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Сотрудник</FormLabel>
            <Select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Выберите сотрудника"
            >
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Отдел</FormLabel>
            <Select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              placeholder="Выберите отдел"
            >
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Статус</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Открыто</option>
              <option value="In Progress">В работе</option>
              <option value="Closed">Закрыто</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Пользователь</FormLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Выберите пользователя"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </FormControl>


          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isSubmitting}
            loadingText="Создание..."
          >
            Создать поломку
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateBreakdownForm;