// src/Forms/Employee/CreateEmployeeForm.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';

function CreateEmployeeForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ name: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Имя сотрудника обязательно",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
      };

      console.log('Debug - Creating employee with data:', employeeData);

      await onCreate(employeeData);

      // Сброс формы после успешного создания
      setFormData({
        name: '',
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

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Имя</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите имя сотрудника"
            />
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
