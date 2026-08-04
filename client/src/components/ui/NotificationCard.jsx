import { Bell } from "lucide-react";

import Badge from "./Badge";
import { cn } from "../../utils/cn";
import { formatRelativeTime } from "../../utils/formatDate";

const NotificationCard = ({
  title,
  message,
  type = "info",
  isRead = false,
  createdAt,
  onClick,
  className = "",
}) => {
  const typeColors = {
    info: "border-l-info-500",
    success: "border-l-success-600",
    warning: "border-l-warning-500",
    danger: "border-l-danger-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full gap-3 rounded-xl border border-secondary-200 dark:border-slate-800 border-l-4 bg-white dark:bg-slate-900/80 p-4 text-left transition-all duration-200",
        "hover:scale-[1.01] hover:shadow-card-hover",
        !isRead && "bg-primary-50/30 dark:bg-slate-800/80",
        typeColors[type],
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-slate-800">
        <Bell size={16} className="text-secondary-500 dark:text-slate-300" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-secondary-900 dark:text-white">
            {title}
          </p>
          {!isRead && <Badge color="primary" size="sm" dot>New</Badge>}
        </div>

        {message && (
          <p className="mt-0.5 line-clamp-2 text-[13px] text-secondary-500 dark:text-slate-300">
            {message}
          </p>
        )}

        {createdAt && (
          <p className="mt-1.5 text-[13px] text-secondary-400 dark:text-slate-400">
            {formatRelativeTime(createdAt)}
          </p>
        )}
      </div>
    </button>
  );
};

export default NotificationCard;
