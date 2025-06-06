import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "auto";
    }

    return () => {
      dialog.close();
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(e) => {
        const dialogDimensions = e.target.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 w-full h-full bg-transparent backdrop:bg-black/50 p-0"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-full">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;