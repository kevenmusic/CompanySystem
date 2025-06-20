import React from 'react';
import {
  Box,
  Heading,
  Center,
  VStack,
  Icon,
  Text,
  HStack,
  Button,
  Card,
  CardBody,
  Avatar,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FiUser, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';

function ProfileTab({ user, handleLogout, onLoginOpen, onRegisterOpen }) {
  return (
    <Box>
      <Heading size="lg" className="mb-6">Профиль пользователя</Heading>
      {user ? (
        <Card maxW="500px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <Avatar size="xl" name={user.username} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                  <Text color="gray.500">{user.email}</Text>
                  {user.phone && <Text color="gray.500">{user.phone}</Text>}
                </VStack>
              </HStack>
              
              <Divider />
              
              <Box>
                <Text fontWeight="semibold" mb={2}>Роли:</Text>
                <HStack>
                  {user.roles.map((role, index) => (
                    <Badge key={index} colorScheme="blue" variant="subtle">
                      {role}
                    </Badge>
                  ))}
                </HStack>
              </Box>
              
              <Divider />
              
              <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                onClick={handleLogout}
                alignSelf="flex-start"
              >
                Выйти из аккаунта
              </Button>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <Center h="50vh">
          <VStack spacing={6}>
            <Icon as={FiUser} boxSize={20} color="gray.300" />
            <VStack spacing={4}>
              <Heading size="lg" color="gray.600">
                Вы не авторизованы
              </Heading>
              <Text color="gray.500" fontSize="lg" textAlign="center">
                Войдите в аккаунт или зарегистрируйтесь
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
      )}
    </Box>
  );
}

export default ProfileTab;