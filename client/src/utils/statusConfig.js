export const ORDER_STATUS = {
  PENDING: { label: "Pending", color: "warning" },
  PROCESSING: { label: "Processing", color: "info" },
  READY_TO_DISPATCH: { label: "Ready", color: "primary" },
  DISPATCHED: { label: "Dispatched", color: "primary" },
  DELIVERED: { label: "Delivered", color: "success" },
  CANCELLED: { label: "Cancelled", color: "danger" },
};

export const INVENTORY_STATUS = {
  AVAILABLE: { label: "Available", color: "success" },
  LOW_STOCK: { label: "Low Stock", color: "warning" },
  OUT_OF_STOCK: { label: "Out of Stock", color: "danger" },
};

export const TASK_STATUS = {
  PENDING: { label: "Pending", color: "warning" },
  IN_PROGRESS: { label: "In Progress", color: "info" },
  COMPLETED: { label: "Completed", color: "success" },
  ESCALATED: { label: "Escalated", color: "danger" },
};

export const TASK_PRIORITY = {
  LOW: { label: "Low", color: "secondary" },
  MEDIUM: { label: "Medium", color: "info" },
  HIGH: { label: "High", color: "warning" },
  CRITICAL: { label: "Critical", color: "danger" },
};

export const COMPLAINT_STATUS = {
  OPEN: { label: "Open", color: "danger" },
  UNDER_REVIEW: { label: "Under Review", color: "warning" },
  RESOLVED: { label: "Resolved", color: "success" },
  CLOSED: { label: "Closed", color: "secondary" },
};

export const SEVERITY = {
  LOW: { label: "Low", color: "secondary" },
  MEDIUM: { label: "Medium", color: "warning" },
  HIGH: { label: "High", color: "danger" },
  CRITICAL: { label: "Critical", color: "danger" },
};

export const BATCH_STATUS = {
  PLANNED: { label: "Planned", color: "secondary" },
  IN_PROGRESS: { label: "In Progress", color: "info" },
  QUALITY_CHECK: { label: "Quality Check", color: "warning" },
  COMPLETED: { label: "Completed", color: "success" },
  REJECTED: { label: "Rejected", color: "danger" },
};

export const APPROVAL_STATUS = {
  PENDING: { label: "Pending", color: "warning" },
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "danger" },
  OVERRIDDEN: { label: "Overridden", color: "info" },
};

export const RISK_LEVEL = {
  LOW: { label: "Low Risk", color: "success" },
  MEDIUM: { label: "Medium Risk", color: "warning" },
  HIGH: { label: "High Risk", color: "danger" },
};

export const getStatusConfig = (map, status) =>
  map[status] ?? { label: status ?? "Unknown", color: "secondary" };
