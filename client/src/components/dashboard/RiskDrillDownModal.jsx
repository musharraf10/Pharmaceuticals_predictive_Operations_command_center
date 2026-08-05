import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, ArrowUpRight, CheckCircle2, ShieldAlert, Sliders } from "lucide-react";

import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const RiskDrillDownModal = ({ open, onClose, items = [], selectedCategory = "ALL" }) => {
  const [filterCategory, setFilterCategory] = useState(selectedCategory);

  const filteredItems = items.filter((item) => {
    if (filterCategory === "ALL") return true;
    return item.category === filterCategory;
  });

  const categories = [
    { label: "All Risks", value: "ALL" },
    { label: "Inventory", value: "INVENTORY" },
    { label: "Forecast", value: "FORECAST" },
    { label: "Capacity", value: "CAPACITY" },
    { label: "Complaints", value: "COMPLAINT" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Risk Telemetry & Drill-Down Analysis"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close Analysis
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-secondary-200 dark:border-slate-800 pb-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterCategory === cat.value
                  ? "bg-primary-600 text-white shadow-xs"
                  : "bg-secondary-100 dark:bg-slate-800 text-secondary-600 dark:text-slate-300 hover:bg-secondary-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Risk Items List */}
        <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-xs transition hover:border-primary-400 dark:hover:border-primary-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger-50 dark:bg-danger-950/40 text-danger-600 dark:text-danger-400">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-900 dark:text-white text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-secondary-500 dark:text-slate-400">
                        Category: {item.category}
                      </p>
                    </div>
                  </div>
                  <Badge color={item.severity === "HIGH" ? "danger" : "warning"}>
                    {item.severity} SEVERITY
                  </Badge>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 rounded-lg bg-secondary-50 dark:bg-slate-800/60 p-3 text-xs">
                  <div>
                    <span className="text-secondary-500 dark:text-slate-400 block font-medium">Current Metric:</span>
                    <span className="font-bold text-secondary-900 dark:text-white">{item.currentValue}</span>
                  </div>
                  <div>
                    <span className="text-secondary-500 dark:text-slate-400 block font-medium">Configured Threshold:</span>
                    <span className="font-semibold text-secondary-700 dark:text-slate-300">{item.thresholdValue}</span>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-secondary-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {item.actionPath && (
                  <div className="mt-3 flex justify-end">
                    <Link
                      to={item.actionPath}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Take Corrective Action <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-secondary-500 dark:text-slate-400">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-success-500" />
              No risk alerts flagged for this category under current thresholds.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RiskDrillDownModal;
