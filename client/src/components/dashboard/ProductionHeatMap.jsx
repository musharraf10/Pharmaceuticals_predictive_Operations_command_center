import { Activity, AlertCircle, CheckCircle2, Factory } from "lucide-react";
import Card, { CardHeader } from "../ui/Card";
import Badge from "../ui/Badge";

const ProductionHeatMap = ({ data = [], onSelectLine }) => {
  const getHeatStyle = (status) => {
    switch (status) {
      case "OVERLOADED":
        return {
          bg: "bg-danger-50 dark:bg-danger-950/60 border-danger-300 dark:border-danger-800/80",
          text: "text-danger-700 dark:text-rose-300 font-bold",
          badge: "danger",
          icon: AlertCircle,
          bar: "bg-danger-500",
        };
      case "HIGH":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800/80",
          text: "text-amber-700 dark:text-amber-300 font-bold",
          badge: "warning",
          icon: Activity,
          bar: "bg-amber-500",
        };
      case "LOW":
        return {
          bg: "bg-secondary-50 dark:bg-slate-900 border-secondary-200 dark:border-slate-800",
          text: "text-secondary-700 dark:text-slate-200 font-bold",
          badge: "secondary",
          icon: CheckCircle2,
          bar: "bg-secondary-400 dark:bg-slate-600",
        };
      case "OPTIMAL":
      default:
        return {
          bg: "bg-success-50 dark:bg-emerald-950/60 border-success-300 dark:border-emerald-800/80",
          text: "text-success-700 dark:text-emerald-300 font-bold",
          badge: "success",
          icon: CheckCircle2,
          bar: "bg-success-500",
        };
    }
  };

  return (
    <Card padding={false}>
      <div className="border-b border-secondary-200 dark:border-slate-800 p-6">
        <CardHeader
          title="Production Capacity Heat Map"
          subtitle="Real-time manufacturing line load & capacity utilization"
          className="mb-0"
        />
      </div>

      <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => {
          const style = getHeatStyle(item.capacityStatus);
          const Icon = style.icon;

          return (
            <div
              key={item.line}
              onClick={() => onSelectLine && onSelectLine(item)}
              className={`rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-card ${style.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-secondary-100 dark:border-slate-700">
                    <Factory size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-bold text-secondary-900 dark:text-white text-base">
                    {item.line}
                  </span>
                </div>
                <Badge color={style.badge} size="sm" icon={Icon}>
                  {item.capacityStatus}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary-700 dark:text-slate-200 font-semibold">Capacity Utilization</span>
                  <span className={`font-bold ${style.text}`}>{item.utilizationPercent}%</span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary-200/60 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${Math.min(item.utilizationPercent, 100)}%` }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-secondary-700 dark:text-slate-200 font-semibold">
                  <span>{item.activeBatches} Active / {item.maxCapacity} Max</span>
                  <span>{item.totalQuantity} Units</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProductionHeatMap;
