import React from 'react';
import EditDepartmentForm from '../Forms/Department/EditDepartmentForm';
import DeleteDepartmentForm from '../Forms/Department/DeleteDepartmentForm';

function DepartmentModals({
  selectedDepartment,
  isEditModalOpen,
  isDeleteModalOpen,
  onCloseEdit,
  onCloseDelete,
  onUpdate,
  onConfirmDelete,
}) {
  return (
    <>
      {selectedDepartment && isEditModalOpen && (
        <EditDepartmentForm
          isOpen={isEditModalOpen}
          onClose={() => {
            onCloseEdit();
          }}
          onUpdate={onUpdate}
          department={selectedDepartment}
        />
      )}

      {selectedDepartment && isDeleteModalOpen && (
        <DeleteDepartmentForm
          isOpen={isDeleteModalOpen}
          onClose={() => {
            onCloseDelete();
          }}
          onConfirm={onConfirmDelete}
          department={selectedDepartment}
        />
      )}
    </>
  );
}

export default DepartmentModals;
