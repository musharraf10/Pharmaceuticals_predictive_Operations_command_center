import { useEffect, useRef, useState } from "react";

import { cn } from "../../utils/cn";

const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] animate-fade-in rounded-xl border border-secondary-200 bg-white py-1.5 shadow-dropdown",
            align === "right" ? "right-0" : "left-0",
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon,
  danger = false,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[15px] transition-colors duration-150",
      danger
        ? "text-danger-600 hover:bg-danger-50"
        : "text-secondary-700 hover:bg-secondary-50",
      className,
    )}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

export const DropdownDivider = () => (
  <div className="my-1.5 border-t border-secondary-200" />
);

export default Dropdown;
