import { cn } from "../../utils/cn";

const Badge = ({ children, color = "primary", size = "md", dot = false }) => {
  const colors = {
    primary: "bg-primary-50 text-primary-700 ring-primary-100",
    secondary: "bg-secondary-100 text-secondary-700 ring-secondary-200",
    success: "bg-success-50 text-success-700 ring-success-100",
    warning: "bg-warning-50 text-warning-600 ring-warning-100",
    danger: "bg-danger-50 text-danger-700 ring-danger-100",
    info: "bg-info-50 text-info-600 ring-info-100",
  };

  const dotColors = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    success: "bg-success-600",
    warning: "bg-warning-500",
    danger: "bg-danger-600",
    info: "bg-info-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-[13px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        colors[color],
        sizes[size],
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[color])} />
      )}
      {children}
    </span>
  );
};

export default Badge;
