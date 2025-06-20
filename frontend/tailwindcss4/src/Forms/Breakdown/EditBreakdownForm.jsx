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
  Textarea,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditBreakdownForm({
  isOpen,
  onClose,
  onUpdate,
  breakdown,
  employees,
  departments,
  users,
}) {
  const [form, setForm] = useState({
    description: "",
    dateReported: "",
    status: "",
    employeeId: "",
    departmentId: "",
    userId: "",
  });

  useEffect(() => {
    if (breakdown) {
      setForm({
        description: breakdown.description || "",
        dateReported: breakdown.dateReported
          ? new Date(breakdown.dateReported).toISOString().slice(0, 16)
          : "",
        status: breakdown.status || "",
        employeeId: breakdown.employeeId || "",
        departmentId: breakdown.departmentId || "",
        userId: breakdown.userId || "",
      });
    }
  }, [breakdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) {
      console.log('Submitting form:', form); // Добавляем логирование
      onUpdate({
        ...form,
        employeeId: parseInt(form.employeeId),
        departmentId: parseInt(form.departmentId),
        userId: parseInt(form.userId),
      });
      onClose();
    }
  };

  // ИСПРАВЛЕНИЕ: Добавляем проверку на существование массивов
  if (!employees || !departments || !users) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="p-4">
        <ModalHeader className="font-bold text-2xl">
          Редактирование поломки
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-3">
          <Textarea
            name="description"
            placeholder="Описание поломки"
            value={form.description}
            onChange={handleChange}
          />

          <Input
            type="datetime-local"
            name="dateReported"
            placeholder="Дата и время отчета"
            value={form.dateReported}
            onChange={handleChange}
          />

          <Select
            name="status"
            placeholder="Выберите статус поломки"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Новая">Новая</option>
            <option value="В работе">В работе</option>
            <option value="Завершена">Завершена</option>
          </Select>

          <Select
            name="employeeId"
            placeholder="Выберите сотрудника"
            value={form.employeeId}
            onChange={handleChange}
          >
            {employees.map((employee) => (
              <option key={employee.value} value={employee.value}>
                {employee.label}
              </option>
            ))}
          </Select>

          <Select
            name="departmentId"
            placeholder="Выберите отдел"
            value={form.departmentId}
            onChange={handleChange}
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>

          <Select
            name="userId"
            placeholder="Выберите пользователя"
            value={form.userId}
            onChange={handleChange}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
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