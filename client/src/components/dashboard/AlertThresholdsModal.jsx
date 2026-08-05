import { useEffect, useState } from "react";
import { RotateCcw, Save, Sliders } from "lucide-react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AlertThresholdsModal = ({ open, onClose, currentThresholds, onSaveThresholds }) => {
  const [thresholds, setThresholds] = useState(currentThresholds);

  useEffect(() => {
    if (open && currentThresholds) {
      setThresholds(currentThresholds);
    }
  }, [open, currentThresholds]);

  const handleChange = (field, value) => {
    setThresholds((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleReset = () => {
    const defaults = {
      lowStockLimit: 50,
      highDemandMultiplier: 1.5,
      maxLineCapacity: 6,
      maxComplaintThreshold: 3,
    };
    setThresholds(defaults);
  };

  const handleSave = () => {
    onSaveThresholds(thresholds);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configure Operational Alert Thresholds"
      footer={
        <>
          <Button variant="outline" icon={RotateCcw} onClick={handleReset}>
            Reset Defaults
          </Button>
          <Button icon={Save} onClick={handleSave}>
            Apply Thresholds
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-secondary-500 dark:text-slate-400">
          Adjust alert parameters to trigger anomaly flags, high-risk warnings, and capacity strain alerts across the command center dashboard.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Low Stock Threshold (Units)"
            type="number"
            min="1"
            value={thresholds.lowStockLimit}
            onChange={(e) => handleChange("lowStockLimit", e.target.value)}
          />
          <Input
            label="High Demand Multiplier (vs Stock)"
            type="number"
            step="0.1"
            min="1"
            value={thresholds.highDemandMultiplier}
            onChange={(e) => handleChange("highDemandMultiplier", e.target.value)}
          />
          <Input
            label="Max Line Capacity (Active Batches)"
            type="number"
            min="1"
            value={thresholds.maxLineCapacity}
            onChange={(e) => handleChange("maxLineCapacity", e.target.value)}
          />
          <Input
            label="Max Quality Complaints Threshold"
            type="number"
            min="0"
            value={thresholds.maxComplaintThreshold}
            onChange={(e) => handleChange("maxComplaintThreshold", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AlertThresholdsModal;
