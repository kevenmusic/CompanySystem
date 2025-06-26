import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';

function CreateEmployeeForm({ onCreate, departments, users, employeeUsers }) {
  const [formData, setFormData] = useState({
    fullName: '',
    departmentId: '',
    userId: '', 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setFormData({ fullName: '', departmentId: '', userId: '' });
  }, [departments, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast({
        title: "Ошибка",
        description: "ФИО сотрудника обязательно",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.userId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите пользователя",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.departmentId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите отдел",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        fullName: formData.fullName,
        departmentId: parseInt(formData.departmentId, 10), 
        userId: parseInt(formData.userId, 10), 
      };

      console.log('Debug - Creating employee with data:', employeeData);

      await onCreate(employeeData);

      setFormData({
        fullName: '',
        departmentId: '',
        userId: '',
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать сотрудника",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!departments || !users) return null;

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>ФИО сотрудника</FormLabel>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Введите ФИО сотрудника"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Пользователь</FormLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Выберите пользователя"
            >
              {employeeUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
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
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
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
            Создать сотрудника
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateEmployeeForm;