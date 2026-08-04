import { cn } from "../../utils/cn";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = true,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 text-secondary-900 dark:text-slate-100 shadow-card transition-all duration-200",
        padding && "p-6",
        hover &&
          "transition-all duration-200 hover:scale-[1.01] hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = "" }) => (
  <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
    <div>
      {title && <h3 className="card-title text-secondary-900 dark:text-white">{title}</h3>}
      {subtitle && <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default Card;
