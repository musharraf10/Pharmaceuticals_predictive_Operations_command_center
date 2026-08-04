import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Button from "./Button";
import { cn } from "../../utils/cn";

const Modal = ({ open, title, children, onClose, footer, size = "md" }) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Full Viewport Blur Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-slate-950/60 dark:bg-slate-950/75 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          "relative z-[101] my-auto w-full animate-slide-up rounded-2xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-secondary-900 dark:text-white",
          sizes[size],
        )}
      >
        <div className="flex items-center justify-between border-b border-secondary-200 dark:border-slate-800 px-6 py-4">
          <h2 id="modal-title" className="font-heading text-lg font-bold text-secondary-900 dark:text-white">
            {title}
          </h2>

          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </Button>
        </div>

        <div className="px-6 py-5 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-secondary-200 dark:border-slate-800 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
