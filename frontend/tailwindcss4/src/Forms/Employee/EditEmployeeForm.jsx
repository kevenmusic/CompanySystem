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
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditEmployeeForm({
  isOpen,
  onClose,
  onUpdate,
  employee,
  departments, // массив объектов { id, name }
  employeeUsers, // массив объектов { id, username }
}) {
  const [form, setForm] = useState({
    fullName: "",
    departmentId: "",
    userId: "",
  });

  useEffect(() => {
    if (isOpen && employee) {
      setForm({
        fullName: employee.fullName || "",
        departmentId: employee.departmentId ? String(employee.departmentId) : "",
        userId: employee.userId ? String(employee.userId) : "",
      });
    }
  }, [employee, departments, employeeUsers, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) {
      const updatedEmployee = {
        fullName: form.fullName,
        departmentId: parseInt(form.departmentId, 10),
        userId: parseInt(form.userId, 10),
      };
      onUpdate(updatedEmployee);
      onClose();
    }
  };

  if (!departments || !employeeUsers) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="p-4">
        <ModalHeader className="font-bold text-2xl">Редактирование сотрудника</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-3">
          <Input
            name="fullName"
            placeholder="ФИО сотрудника"
            value={form.fullName}
            onChange={handleChange}
          />

          <Select
            name="userId"
            placeholder="Выберите пользователя"
            value={form.userId}
            onChange={handleChange}
          >
            {employeeUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Select>

          <Select
            name="departmentId"
            placeholder="Выберите отдел"
            value={form.departmentId}
            onChange={handleChange}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Select>
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
