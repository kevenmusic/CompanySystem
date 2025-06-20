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
  employees,
  users,  
  departments,
}) {
  return (
    <>
      {selectedBreakdown && (
        <EditBreakdownForm
          isOpen={isEditModalOpen}
          onClose={onCloseEdit}
          onUpdate={onUpdate}
          breakdown={selectedBreakdown}
          employees={employees}
          users={users}
          departments={departments}
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