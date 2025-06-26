import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import EditEmployeeForm from '../Forms/Employee/EditEmployeeForm';

function EmployeeModals({
  selectedEmployee,
  isEditModalOpen,
  isDeleteModalOpen,
  onCloseEdit,
  onCloseDelete,
  onUpdate,
  onConfirmDelete,
  departments,
  employeeUsers
}) {
  const cancelRef = React.useRef();

  return (
    <>
      {}
      <EditEmployeeForm
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        onUpdate={onUpdate}
        employee={selectedEmployee}
        departments={departments}
        employeeUsers={employeeUsers} 
      />

      {}
      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Удалить сотрудника
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы уверены, что хотите удалить сотрудника{' '}
              <strong>{selectedEmployee?.fullName}</strong>? Это действие нельзя
              отменить.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDelete}>
                Отмена
              </Button>
              <Button
                colorScheme="red"
                onClick={() => onConfirmDelete(selectedEmployee?.id)}
                ml={3}
              >
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default EmployeeModals;