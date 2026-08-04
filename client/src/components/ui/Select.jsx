import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

const Select = forwardRef(
  ({ label, error, options = [], placeholder, className = "", ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium text-secondary-700">{label}</label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-xl border border-secondary-300 bg-white px-4 py-2.5 pr-10 text-[15px] text-secondary-900",
              "transition-all duration-200",
              "focus:border-primary-600 focus:ring-2 focus:ring-primary-100",
              error && "border-danger-500",
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((opt) =>
              typeof opt === "string" ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ),
            )}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
