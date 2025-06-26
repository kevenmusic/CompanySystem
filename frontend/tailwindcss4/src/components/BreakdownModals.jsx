import React from 'react';
import EditBreakdownForm from '../Forms/Breakdown/EditBreakdownForm';
import DeleteBreakdownForm from '../Forms/Breakdown/DeleteBreakdownForm';

function BreakdownModals({
  selectedBreakdown,
  isEditModalOpen,
  isDeleteModalOpen,
  onCloseEdit,
  onCloseDelete,
  onUpdate,
  onConfirmDelete,
  onUpdateByEmployee,
  allEmployeesWithEmployeeRole,
  isCompleteMode,
  users,
  isEmployee = false, 
  }) {
  return (
    <>
      {selectedBreakdown && (
        <EditBreakdownForm
          isOpen={isEditModalOpen}
          onClose={onCloseEdit}
          {...(isEmployee 
            ? { onUpdateByEmployee } 
            : { onUpdate }
          )}
          isCompleteMode={isCompleteMode}
          breakdown={selectedBreakdown}
          allEmployeesWithEmployeeRole={allEmployeesWithEmployeeRole}
          users={users}
        />
      )}

      {selectedBreakdown && (
        <DeleteBreakdownForm
          isOpen={isDeleteModalOpen}
          onClose={onCloseDelete}
          onConfirm={onConfirmDelete}
          breakdown={selectedBreakdown}
        />
      )}
    </>
  );
}

export default BreakdownModals;