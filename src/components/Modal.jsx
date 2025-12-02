import { useEffect, useState, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, onShowFormula, onShowInfo, isTop }) => {
  const [isModalFocused, setIsModalFocused] = useState(false);

  // Overlay ref (full screen background)
  const modalRef = useRef(null);

  // Content box ref (actual interactive modal panel)
  const contentRef = useRef(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close if clicking outside the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC key handling — only when modal content has focus
  useEffect(() => {
    if (!isOpen || !isTop) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalFocused) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isTop, onClose, isModalFocused]);

  // Autofocus modal content on open
  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        contentRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Track direct focus on modal content
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onFocus = () => {
      setIsModalFocused(true);
    };

    const onBlur = () => {
      setIsModalFocused(false);
    };

    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);

    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[100] transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        onMouseDown={(e) => {
          const tag = e.target.tagName.toLowerCase();
          const focusables = ["input", "textarea", "select", "button"];

          if (focusables.includes(tag)) return;

          contentRef.current?.focus();
        }}
        className="bg-[#282828] p-6 rounded-lg max-w-[1400px] max-h-[95vh] overflow-y-auto shadow-lg transform transition-transform duration-300 outline-none"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <button
              onClick={onShowFormula}
              className="text-[#e0e0e0] hover:text-[#fa7532] hover:bg-[#383838] p-1 rounded transition hover:cursor-pointer"
              title="Visa formel"
            >
              <i className="fas fa-square-root-alt"></i>
            </button>
            <button
              onClick={onShowInfo}
              className="text-[#e0e0e0] hover:text-[#fa7532] hover:bg-[#383838] p-1 rounded transition hover:cursor-pointer"
              title="Visa information"
            >
              <i className="fas fa-info-circle"></i>
            </button>
          </div>

          <h3 className="text-xl text-[#fa7532] flex-grow text-center font-bold">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="top-4 right-4 text-[#e0e0e0] hover:text-[#fa7532] text-xl hover:cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
