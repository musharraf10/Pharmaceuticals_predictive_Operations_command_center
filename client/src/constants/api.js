export const API_ENDPOINTS = Object.freeze({
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  USERS: "/users",

  PRODUCTS: "/products",

  INVENTORY: "/inventory",

  SUPPLIERS: "/suppliers",

  PRODUCTION: "/production-batches",

  ORDERS: "/orders",

  DASHBOARD: "/dashboard",

  FORECAST: "/forecast",
  FORECAST_RUN: "/forecast/run",

  TASKS: "/tasks",

  COMPLAINTS: "/complaints",

  APPROVALS: "/approvals",

  REPORTS: Object.freeze({
    SUMMARY: "/reports/summary",
    INVENTORY: "/reports/inventory",
    ORDERS: "/reports/orders",
    PRODUCTION: "/reports/production",
    FORECAST: "/reports/forecast",
    COMPLAINTS: "/reports/complaints",
    TASKS: "/reports/tasks",
  }),

  NOTIFICATIONS: "/notifications",
  NOTIFICATIONS_MARK_ALL_READ: "/notifications/mark-all-read",

  AUDIT_LOGS: "/audit-logs",
});
