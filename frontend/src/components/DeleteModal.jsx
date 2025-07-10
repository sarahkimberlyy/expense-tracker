import React from 'react';

const DeleteModal = ({ 
  isOpen, 
  expenseToDelete, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this expense?</p>
          {expenseToDelete && (
            <div className="expense-preview">
              <div className="expense-preview-item">
                <strong>{expenseToDelete.description}</strong>
              </div>
              <div className="expense-preview-item">
                <span className="expense-category">{expenseToDelete.category}</span>
                <span className="expense-date">{expenseToDelete.date}</span>
              </div>
              <div className="expense-preview-amount">
                Rp{parseFloat(expenseToDelete.amount).toLocaleString('id-ID')}
              </div>
            </div>
          )}
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button 
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;