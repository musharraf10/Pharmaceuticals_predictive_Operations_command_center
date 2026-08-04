import { cn } from "../../utils/cn";

const Badge = ({ children, color = "primary", size = "md", dot = false }) => {
  const colors = {
    primary: "bg-primary-50 text-primary-700 ring-primary-100 dark:bg-primary-950/80 dark:text-primary-300 dark:ring-primary-800/60",
    secondary: "bg-secondary-100 text-secondary-700 ring-secondary-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
    success: "bg-success-50 text-success-700 ring-success-100 dark:bg-success-950/80 dark:text-success-300 dark:ring-success-800/60",
    warning: "bg-warning-50 text-warning-600 ring-warning-100 dark:bg-warning-950/80 dark:text-warning-300 dark:ring-warning-800/60",
    danger: "bg-danger-50 text-danger-700 ring-danger-100 dark:bg-danger-950/80 dark:text-danger-300 dark:ring-danger-800/60",
    info: "bg-info-50 text-info-600 ring-info-100 dark:bg-info-950/80 dark:text-info-300 dark:ring-info-800/60",
  };

  const dotColors = {
    primary: "bg-primary-500 dark:bg-primary-400",
    secondary: "bg-secondary-500 dark:bg-slate-400",
    success: "bg-success-600 dark:bg-success-400",
    warning: "bg-warning-500 dark:bg-warning-400",
    danger: "bg-danger-600 dark:bg-danger-400",
    info: "bg-info-500 dark:bg-info-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-[13px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
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
