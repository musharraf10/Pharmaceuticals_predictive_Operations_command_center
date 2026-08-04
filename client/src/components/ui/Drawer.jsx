import { useEffect } from "react";
import { X } from "lucide-react";

import Button from "./Button";
import { cn } from "../../utils/cn";

const Drawer = ({ open, title, children, onClose, footer, width = "max-w-md" }) => {
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

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-secondary-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-modal animate-slide-up",
          width,
        )}
      >
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-secondary-900">{title}</h2>

          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-secondary-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
