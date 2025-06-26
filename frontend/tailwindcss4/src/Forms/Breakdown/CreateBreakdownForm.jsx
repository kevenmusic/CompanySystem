import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { AuthContext } from '../../Context/AuthContext';

function CreateBreakdownForm({
  onCreate,
  onCreateByUser,
  allEmployeesWithEmployeeRole,
  users,
}) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    description: '',
    employeeId: '',
    userId: '',
    status: 'Открыто',
    dateReported: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const isAdmin = user?.roles?.includes('Admin');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Описание поломки обязательно',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.employeeId) {
      toast({
        title: 'Ошибка',
        description: 'Выберите сотрудника',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isAdmin && !formData.userId) {
      toast({
        title: 'Ошибка',
        description: 'Выберите пользователя',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const breakdownData = {
        description: formData.description,
        employeeId: formData.employeeId,
        userId: isAdmin ? formData.userId : user?.id || null,
        status: isAdmin ? formData.status : 'Открыто',
        dateReported: isAdmin ? formData.dateReported : new Date().toISOString(),
      };

      console.log('Creating breakdown with data:', breakdownData);

      if (isAdmin) {
        await onCreate(breakdownData);
      } else {
        await onCreateByUser(breakdownData);
      }

      setFormData({
        description: '',
        employeeId: '',
        userId: '',
        status: 'Открыто',
        dateReported: new Date().toISOString(),
      });

      toast({
        title: 'Успех',
        description: 'Поломка успешно создана',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать поломку',
        status: 'error',
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
              {allEmployeesWithEmployeeRole?.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </Select>
          </FormControl>

          {isAdmin && (
            <>
              <FormControl isRequired>
                <FormLabel>Пользователь</FormLabel>
                <Select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Выберите пользователя"
                >
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Статус</FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Сообщено">Сообщено</option>
                  <option value="В работе">В работе</option>
                  <option value="Завершена">Завершена</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Дата создания</FormLabel>
                <Input
                  type="datetime-local"
                  name="dateReported"
                  value={formData.dateReported.slice(0, 16)} 
                  onChange={handleChange}
                />
              </FormControl>
            </>
          )}

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
