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
        "rounded-xl border border-secondary-200 bg-white shadow-card",
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
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="mt-1 text-[13px] text-secondary-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default Card;
