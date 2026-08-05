import { AlertTriangle, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "../ui/ChartCard";
import Badge from "../ui/Badge";
import { useLayout } from "../../hooks/useLayout";

const CustomDot = (props) => {
  const { cx, cy, payload, onSelectNode } = props;
  if (!payload || !cx || !cy) return null;

  if (payload.isAnomaly) {
    return (
      <g
        className="cursor-pointer group"
        onClick={() => onSelectNode && onSelectNode(payload)}
      >
        <circle cx={cx} cy={cy} r={10} className="fill-danger-500/20 stroke-danger-400 stroke-2 hover:fill-danger-500/40 transition-colors" />
        <circle cx={cx} cy={cy} r={5} className="fill-danger-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
      </g>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      className="fill-primary-500 stroke-white dark:stroke-slate-900 cursor-pointer hover:r-6 transition-all"
      onClick={() => onSelectNode && onSelectNode(payload)}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-dropdown text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between border-b border-secondary-100 dark:border-slate-800 pb-2">
        <p className="font-bold text-secondary-900 dark:text-white">{label}</p>
        {data?.isAnomaly && (
          <Badge color="danger" size="sm" icon={AlertTriangle}>
            Anomaly
          </Badge>
        )}
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-secondary-500 dark:text-slate-400">Predicted Demand:</span>
          <span className="font-bold text-primary-600 dark:text-primary-400">{data?.predictedDemand} units</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary-500 dark:text-slate-400">Current Stock:</span>
          <span className="font-semibold text-secondary-800 dark:text-slate-200">{data?.currentStock} units</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary-500 dark:text-slate-400">Delivered Orders:</span>
          <span className="font-semibold text-success-600 dark:text-success-400">{data?.deliveredOrders} units</span>
        </div>
      </div>

      {data?.anomalyReason && (
        <div className="mt-2 rounded-lg bg-danger-50 dark:bg-danger-950/40 p-2 text-danger-700 dark:text-danger-300 font-medium">
          ⚠️ {data.anomalyReason}
        </div>
      )}
    </div>
  );
};

const DemandForecastChart = ({ data = [], thresholds = {}, onSelectNode }) => {
  const { theme } = useLayout();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const tickColor = isDark ? "#CBD5E1" : "#64748B";

  const anomalyCount = data.filter((d) => d.isAnomaly).length;

  return (
    <ChartCard
      title="Demand Forecast & Anomaly Detection"
      subtitle="AI demand trajectory with automated risk markers"
      action={
        anomalyCount > 0 ? (
          <Badge color="danger" icon={AlertTriangle}>
            {anomalyCount} Anomaly Spike{anomalyCount > 1 ? "s" : ""}
          </Badge>
        ) : (
          <Badge color="success" icon={Sparkles}>
            Stable Trajectory
          </Badge>
        )
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="predictedDemand"
            name="Predicted Demand"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#demandGradient)"
            dot={<CustomDot onSelectNode={onSelectNode} />}
          />
          <Area
            type="monotone"
            dataKey="currentStock"
            name="Current Stock"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#stockGradient)"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DemandForecastChart;
