import React from 'react';
import EditEmployeeForm from '../Forms/Employee/EditEmployeeForm';
import DeleteEmployeeForm from '../Forms/Employee/DeleteEmployeeForm';

function EmployeeModals({
  selectedEmployee,
  isEditModalOpen,
  isDeleteModalOpen,
  onCloseEdit,
  onCloseDelete,
  onUpdate,
  onConfirmDelete,
  departments,
}) {
  return (
    <>
      {selectedEmployee && isEditModalOpen && (
        <EditEmployeeForm
          isOpen={isEditModalOpen}
          onClose={() => {
            onCloseEdit();
          }}
          onUpdate={onUpdate}
          employee={selectedEmployee}
          departments={departments}
        />
      )}

      {selectedEmployee && isDeleteModalOpen && (
        <DeleteEmployeeForm
          isOpen={isDeleteModalOpen}
          onClose={() => {
            onCloseDelete();
          }}
          onConfirm={onConfirmDelete}
          employee={selectedEmployee}
        />
      )}
    </>
  );
}

export default EmployeeModals;