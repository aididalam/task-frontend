import React, { useEffect } from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  useEffect(() => {
    // Close modal when clicking outside of it
    if (isOpen) {
      const closeOnClickOutside = (e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      };
      document.addEventListener("click", closeOnClickOutside);
      return () => document.removeEventListener("click", closeOnClickOutside);
    }
  }, [isOpen, closeModal]);

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative mt-16">
        <button className="absolute top-2 text-2xl right-3 text-gray-500" onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
