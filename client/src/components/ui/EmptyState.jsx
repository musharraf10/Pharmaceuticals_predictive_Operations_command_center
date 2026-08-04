import { Inbox } from "lucide-react";

import Button from "./Button";
import { cn } from "../../utils/cn";

const EmptyState = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-8 py-16 text-center shadow-sm dark:shadow-none transition-colors duration-200",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 dark:bg-slate-800 text-secondary-400 dark:text-slate-400">
        <Icon size={28} />
      </div>

      <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{title}</h2>

      {description && (
        <p className="mt-2 max-w-sm text-[15px] text-secondary-500 dark:text-slate-400">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
