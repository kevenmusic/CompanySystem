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
  Text,
  VStack,
  Alert,
  AlertIcon,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditBreakdownForm({
  isOpen,
  onClose,
  onUpdate,
  onUpdateByEmployee,
  breakdown,
  allEmployeesWithEmployeeRole,
  users,
}) {
  const [form, setForm] = useState({
    description: "",
    dateReported: "",
    status: "",
    employeeId: "",
    userId: "",
  });

  const isEmployee = !!onUpdateByEmployee;

  useEffect(() => {
    if (breakdown) {
      setForm({
        description: breakdown.description || "",
        dateReported: breakdown.dateReported
          ? new Date(breakdown.dateReported).toISOString().slice(0, 16)
          : "",
        status: breakdown.status || "",
        employeeId: breakdown.employeeId || "",
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
    onUpdate({
      ...form,
      employeeId: parseInt(form.employeeId),
      userId: parseInt(form.userId),
    });
    onClose();
  };

  const handleTakeTicket = () => {
    onUpdateByEmployee({ status: "В работе" });
    onClose();
  };

  const handleCompleteBreakdown = () => {
    onUpdateByEmployee({ status: "Завершена" });
    onClose();
  };

  if (!isEmployee && (!allEmployeesWithEmployeeRole || !users)) {
    return null;
  }

  const canTakeTicket = breakdown?.status === "Сообщено";
  const canComplete = breakdown?.status === "В работе";
  const isCompleted = breakdown?.status === "Завершена";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="p-4">
        <ModalHeader className="font-bold text-2xl">
          {isEmployee ? "Управление поломкой" : "Редактирование поломки"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-3">
          {isEmployee ? (
            <VStack spacing={4} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Text>
                  {canTakeTicket && "Вы можете принять эту поломку в работу."}
                  {canComplete && "Вы можете завершить эту поломку."}
                  {isCompleted && "Эта поломка уже завершена."}
                </Text>
              </Alert>
              <Text><strong>Описание:</strong> {breakdown?.description}</Text>
              <Text><strong>Текущий статус:</strong> {breakdown?.status}</Text>
              <Text>
                <strong>Дата создания:</strong>{" "}
                {breakdown?.dateReported
                  ? new Date(breakdown.dateReported).toLocaleDateString("ru-RU")
                  : "Не указана"}
              </Text>
            </VStack>
          ) : (
            <>
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
                <option value="Сообщено">Сообщено</option>
                <option value="В работе">В работе</option>
                <option value="Завершена">Завершена</option>
              </Select>
              <Select
                name="employeeId"
                placeholder="Выберите сотрудника"
                value={form.employeeId}
                onChange={handleChange}
              >
                {allEmployeesWithEmployeeRole.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
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
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {isEmployee ? (
            <HStack spacing={3}>
              {canTakeTicket && (
                <Button colorScheme="blue" onClick={handleTakeTicket}>
                  Принять в работу
                </Button>
              )}
              {canComplete && (
                <Button colorScheme="green" onClick={handleCompleteBreakdown}>
                  Завершить поломку
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>
                Отмена
              </Button>
            </HStack>
          ) : (
            <>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Сохранить
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Отмена
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
