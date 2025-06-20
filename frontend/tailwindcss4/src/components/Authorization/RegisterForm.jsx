import { useState } from 'react';
import { register } from '../../services/auth';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';

const RegisterForm = ({ onSuccess }) => {
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (registerData.username.length < 3 || registerData.username.length > 50) {
      newErrors.username = 'Логин должен содержать от 3 до 50 символов';
      isValid = false;
    }
    if (registerData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать не менее 8 символов';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      toast({
        title: 'Ошибка',
        description: 'Исправьте ошибки в форме',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(registerData);
      onSuccess();
      toast({
        title: 'Регистрация успешна',
        description: 'Теперь вы можете войти в систему',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('RegisterForm error:', error.message);
      toast({
        title: 'Ошибка регистрации',
        description: error.message || 'Не удалось зарегистрироваться',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl isRequired isInvalid={!!errors.username}>
        <FormLabel>Имя пользователя</FormLabel>
        <Input
          value={registerData.username}
          onChange={(e) =>
            setRegisterData({ ...registerData, username: e.target.value })
          }
        />
        <FormErrorMessage>{errors.username}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.password}>
        <FormLabel>Пароль</FormLabel>
        <Input
          type="password"
          value={registerData.password}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
        />
        <FormErrorMessage>{errors.password}</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="green"
        onClick={handleSubmit}
        isLoading={isLoading}
        width="full"
      >
        Зарегистрироваться
      </Button>
    </VStack>
  );
};

export default RegisterForm;