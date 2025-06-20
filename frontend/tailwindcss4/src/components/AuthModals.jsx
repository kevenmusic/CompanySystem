import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import LoginForm from './Authorization/LoginForm';
import RegisterForm from './Authorization/RegisterForm';

function AuthModals({
  isLoginOpen,
  isRegisterOpen,
  onLoginClose,
  onRegisterClose,
  onLoginOpen,
  onRegisterOpen,
  handleLogin,
  handleRegisterSuccess,
}) {
  return (
    <>
      <Modal isOpen={isLoginOpen} onClose={onLoginClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FiLogIn} />
              <Text>Вход в систему</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <LoginForm onSuccess={handleLogin} />
          </ModalBody>
          <ModalFooter>
            <VStack spacing={2} width="100%">
              <Divider />
              <HStack>
                <Text color="gray.500" fontSize="sm">
                  Нет аккаунта?
                </Text>
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    onLoginClose();
                    onRegisterOpen();
                  }}
                >
                  Зарегистрироваться
                </Button>
              </HStack>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={onRegisterClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FiUserPlus} />
              <Text>Регистрация</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </ModalBody>
          <ModalFooter>
            <VStack spacing={2} width="100%">
              <Divider />
              <HStack>
                <Text color="gray.500" fontSize="sm">
                  Уже есть аккаунт?
                </Text>
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    onRegisterClose();
                    onLoginOpen();
                  }}
                >
                  Войти
                </Button>
              </HStack>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AuthModals;