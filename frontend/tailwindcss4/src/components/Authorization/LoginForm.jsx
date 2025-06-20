// src/components/LoginForm.js
import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';

const LoginForm = ({ onSuccess }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', { name, value });
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting loginData:', loginData);
    if (!loginData.username || !loginData.password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );
      await Promise.race([onSuccess(loginData), timeoutPromise]);
    } catch (error) {
      console.error('LoginForm submission error:', error.message);
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Не удалось войти в систему',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl id="username" isRequired>
          <FormLabel>Имя пользователя</FormLabel>
          <Input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            autoComplete="username"
            isDisabled={isLoading}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Пароль</FormLabel>
          <Input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            autoComplete="current-password"
            isDisabled={isLoading}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Войти
        </Button>
      </VStack>
    </form>
  );
};

export default LoginForm;