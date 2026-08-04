import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    {
      label,
      error,
      className = "",
      inputClassName = "",
      icon: Icon,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium text-secondary-700">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400"
            />
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-[15px] text-secondary-900",
              "placeholder:text-secondary-400",
              "transition-all duration-200",
              "focus:border-primary-600 focus:ring-2 focus:ring-primary-100",
              Icon && "pl-10",
              isPassword && "pr-11",
              error && "border-danger-500 focus:border-danger-500 focus:ring-danger-100",
              inputClassName,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-secondary-400 hover:text-secondary-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-danger-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
