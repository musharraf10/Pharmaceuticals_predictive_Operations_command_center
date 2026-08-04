import { useEffect } from "react";
import { createPortal } from "react-dom";
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

  const drawerContent = (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/75 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-[101] ml-auto flex h-full w-full flex-col border-l border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-secondary-900 dark:text-white shadow-2xl animate-slide-up",
          width,
        )}
      >
        <div className="flex items-center justify-between border-b border-secondary-200 dark:border-slate-800 px-6 py-4">
          <h2 className="font-heading text-lg font-bold text-secondary-900 dark:text-white">{title}</h2>

          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-secondary-200 dark:border-slate-800 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default Drawer;
