import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm} className="confirm-button">Evet</button>
        <button onClick={onCancel} className="cancel-button">Hayır</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
