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

export default function EditDepartmentForm({
  isOpen,
  onClose,
  onUpdate,
  department,
}) {
  const [form, setForm] = useState({
    name: "",
    managerFullName: "",
  });

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name || "",
        managerFullName: department.managerFullName || "",
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate && department) {
      const updatedDepartment = {
        ...department,
        ...form,
      };
      console.log("Submitting updated department:", updatedDepartment);
      onUpdate(updatedDepartment);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="p-4">
        <ModalHeader className="font-bold text-2xl">
          Редактирование департамента
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-3">
          <Input
            name="name"
            placeholder="Название департамента"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="managerFullName"
            placeholder="ФИО менеджера"
            value={form.managerFullName}
            onChange={handleChange}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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
