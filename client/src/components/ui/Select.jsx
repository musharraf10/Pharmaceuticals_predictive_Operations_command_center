import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

const Select = forwardRef(
  ({ label, error, options = [], placeholder, className = "", ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">{label}</label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-10 text-[15px] text-secondary-900 dark:text-white",
              "transition-all duration-200",
              "focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/40",
              error && "border-danger-500",
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-white dark:bg-slate-800 text-secondary-900 dark:text-white">
                {placeholder}
              </option>
            )}

            {options.map((opt) =>
              typeof opt === "string" ? (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-800 text-secondary-900 dark:text-white">
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-secondary-900 dark:text-white">
                  {opt.label}
                </option>
              ),
            )}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-slate-400"
          />
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
