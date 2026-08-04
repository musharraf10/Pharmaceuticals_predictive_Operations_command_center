export const queryKeys = Object.freeze({
  auth: {
    me: ["auth", "me"],
  },

  users: {
    all: ["users"],
    list: (params) => ["users", "list", params],
    detail: (id) => ["users", "detail", id],
  },

  products: {
    all: ["products"],
    list: (params) => ["products", "list", params],
    detail: (id) => ["products", "detail", id],
  },

  inventory: {
    all: ["inventory"],
    list: (params) => ["inventory", "list", params],
    detail: (id) => ["inventory", "detail", id],
  },

  suppliers: {
    all: ["suppliers"],
    list: (params) => ["suppliers", "list", params],
    detail: (id) => ["suppliers", "detail", id],
  },

  production: {
    all: ["production"],
    list: (params) => ["production", "list", params],
    detail: (id) => ["production", "detail", id],
  },

  orders: {
    all: ["orders"],
    list: (params) => ["orders", "list", params],
    detail: (id) => ["orders", "detail", id],
  },

  dashboard: {
    stats: ["dashboard"],
  },

  forecast: {
    all: ["forecast"],
    list: (params) => ["forecast", "list", params],
    detail: (id) => ["forecast", "detail", id],
  },

  tasks: {
    all: ["tasks"],
    list: (params) => ["tasks", "list", params],
    detail: (id) => ["tasks", "detail", id],
  },

  complaints: {
    all: ["complaints"],
    list: (params) => ["complaints", "list", params],
    detail: (id) => ["complaints", "detail", id],
  },

  approvals: {
    all: ["approvals"],
    list: (params) => ["approvals", "list", params],
    detail: (id) => ["approvals", "detail", id],
  },

  notifications: {
    all: ["notifications"],
    list: (params) => ["notifications", "list", params],
  },

  reports: {
    summary: ["reports", "summary"],
    inventory: ["reports", "inventory"],
    orders: ["reports", "orders"],
    production: ["reports", "production"],
    forecast: ["reports", "forecast"],
    complaints: ["reports", "complaints"],
    tasks: ["reports", "tasks"],
  },

  auditLogs: {
    all: ["audit-logs"],
    list: (params) => ["audit-logs", "list", params],
    detail: (id) => ["audit-logs", "detail", id],
  },
});
