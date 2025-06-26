// src/Forms/Department/CreateDepartmentForm.js
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

function CreateDepartmentForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    managerFullName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название департамента обязательно",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.managerFullName.trim()) {
      toast({
        title: "Ошибка",
        description: "ФИО руководителя обязательно",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const departmentData = {
        ...formData,
      };

      await onCreate(departmentData);

      // Сброс формы после успешного создания
      setFormData({
        name: '',
        managerFullName: '',
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать департамент",
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
            <FormLabel>Название департамента</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название департамента"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>ФИО руководителя</FormLabel>
            <Input
              name="managerFullName"
              value={formData.managerFullName}
              onChange={handleChange}
              placeholder="Введите ФИО руководителя"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isSubmitting}
            loadingText="Создание..."
          >
            Создать отдел
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateDepartmentForm;
