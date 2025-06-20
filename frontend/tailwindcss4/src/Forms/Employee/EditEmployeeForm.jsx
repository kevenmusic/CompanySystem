import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  
  export default function EditEmployeeForm({
    isOpen,
    onClose,
    onUpdate,
    employee,
  }) {
    const [form, setForm] = useState({
      name: "",
    });
  
    useEffect(() => {
      if (employee) {
        setForm({
          name: employee.name || "",
        });
      }
    }, [employee]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onUpdate) {
        console.log("Submitting employee form:", form);
        onUpdate({
          ...form,
        });
        onClose();
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="p-4">
          <ModalHeader className="font-bold text-2xl">
            Редактирование сотрудника
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col gap-3">
            <Input
              name="name"
              placeholder="Имя сотрудника"
              value={form.name}
              onChange={handleChange}
            />
          </ModalBody>
  
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Сохранить
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  