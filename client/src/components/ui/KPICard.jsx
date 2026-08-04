import { TrendingDown, TrendingUp } from "lucide-react";

import Card from "./Card";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../utils/formatCurrency";

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = "primary",
  className = "",
}) => {
  const iconColors = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
    success: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
    info: "bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400",
  };

  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card
      hover
      className={cn("transition-all duration-200", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-secondary-500 dark:text-slate-300">
            {title}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white font-mono">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>

          {subtitle && (
            <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-300">{subtitle}</p>
          )}

          {trend != null && (
            <div className="mt-3 flex items-center gap-1.5">
              {isPositive && (
                <TrendingUp size={14} className="text-success-600 dark:text-success-400" />
              )}
              {isNegative && (
                <TrendingDown size={14} className="text-danger-600 dark:text-danger-400" />
              )}
              <span
                className={cn(
                  "text-[13px] font-semibold",
                  isPositive && "text-success-600 dark:text-success-400",
                  isNegative && "text-danger-600 dark:text-danger-400",
                  !isPositive && !isNegative && "text-secondary-500 dark:text-slate-300",
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
              {trendLabel && (
                <span className="text-[13px] text-secondary-400 dark:text-slate-400">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              iconColors[color],
            )}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPICard;
