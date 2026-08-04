import { cn } from "../../utils/cn";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
    secondary:
      "bg-secondary-100 text-secondary-800 hover:bg-secondary-200 border border-secondary-200",
    success: "bg-success-600 text-white hover:bg-success-700",
    danger: "bg-danger-600 text-white hover:bg-danger-700",
    warning: "bg-warning-500 text-white hover:bg-warning-600",
    outline:
      "border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50",
    ghost: "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-[15px] gap-2",
    lg: "px-6 py-3 text-base gap-2",
    icon: "p-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "hover:scale-[1.01] active:scale-[0.99]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={size === "sm" ? 16 : 18} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
