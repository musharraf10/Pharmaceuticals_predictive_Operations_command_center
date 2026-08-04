import { forwardRef } from "react";

const Input = forwardRef(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-secondary-700">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={`
            w-full
            rounded-xl
            border
            border-secondary-300
            px-4
            py-2.5
            focus:border-primary-600
            focus:ring-2
            focus:ring-primary-100
            ${className}
          `}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-danger-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;