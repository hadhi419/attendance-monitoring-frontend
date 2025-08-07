import React, { useEffect, useState } from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    setIsVisible(true);
  }, []);

  const handleClose = () => {

    setIsVisible(false);

    setTimeout(onCancel, 300); 
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50
        transition-opacity duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div
        className={`bg-white rounded-lg p-6 w-80 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isVisible ? 'scale-100' : 'scale-90'}
        `}
      >
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
