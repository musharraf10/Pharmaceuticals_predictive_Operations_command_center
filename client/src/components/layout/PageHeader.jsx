import Button from "../ui/Button";
import { cn } from "../../utils/cn";

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onClick,
  action,
  className = "",
}) => {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="page-title">{title}</h1>

        {subtitle && (
          <p className="mt-2 text-[15px] text-secondary-500">{subtitle}</p>
        )}
      </div>

      {action ?? (buttonText && <Button onClick={onClick}>{buttonText}</Button>)}
    </div>
  );
};

export default PageHeader;
