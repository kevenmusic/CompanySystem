import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
  } from '@chakra-ui/react';
  
  export default function DeleteBreakdownForm({ isOpen, onClose, onConfirm, breakdown }) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="p-4">
          <ModalHeader className="font-bold text-2xl">Подтверждение удаления</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Вы уверены, что хотите удалить поломку:</Text>
            <Text fontWeight="bold" mt={2}>{breakdown?.description}</Text>
            <Text mt={2}>Это действие нельзя отменить.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                onConfirm(breakdown.id);
                onClose();
              }}
              className="flex items-center"
            >
              Удалить
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }