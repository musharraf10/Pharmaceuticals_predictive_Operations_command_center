import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";
import ProductionBatch from "../models/ProductionBatch.js";
import Supplier from "../models/Supplier.js";
import Complaint from "../models/Complaint.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import Forecast from "../models/Forecast.js";

export const getDashboardData = async () => {
  const [
    totalProducts,
    totalSuppliers,
    totalInventoryItems,
    totalOrders,
    totalComplaints,
    totalTasks,
    totalForecasts,

    lowStock,
    outOfStock,

    pendingOrders,
    processingOrders,
    dispatchedOrders,
    deliveredOrders,

    plannedBatches,
    batchesInProgress,
    completedBatches,
    rejectedBatches,

    unreadNotifications,

    highPriorityTasks,
    openComplaints,
  ] = await Promise.all([
    Product.countDocuments(),

    Supplier.countDocuments(),

    Inventory.countDocuments(),

    Order.countDocuments(),

    Complaint.countDocuments(),

    Task.countDocuments(),

    Forecast.countDocuments(),

    Inventory.countDocuments({
      status: "LOW_STOCK",
    }),

    Inventory.countDocuments({
      status: "OUT_OF_STOCK",
    }),

    Order.countDocuments({
      status: "PENDING",
    }),

    Order.countDocuments({
      status: "PROCESSING",
    }),

    Order.countDocuments({
      status: "DISPATCHED",
    }),

    Order.countDocuments({
      status: "DELIVERED",
    }),

    ProductionBatch.countDocuments({
      status: "PLANNED",
    }),

    ProductionBatch.countDocuments({
      status: "IN_PROGRESS",
    }),

    ProductionBatch.countDocuments({
      status: "COMPLETED",
    }),

    ProductionBatch.countDocuments({
      status: "REJECTED",
    }),

    Notification.countDocuments({
      isRead: false,
    }),

    Task.countDocuments({
      priority: "HIGH",
      status: {
        $ne: "COMPLETED",
      },
    }),

    Complaint.countDocuments({
      status: {
        $ne: "CLOSED",
      },
    }),
  ]);

  const recentActivities = await AuditLog.find()
    .populate("user", "name role")
    .sort({ createdAt: -1 })
    .limit(10);

  const liveQueue = await Order.find({
    status: {
      $in: ["PENDING", "PROCESSING", "READY_TO_DISPATCH"],
    },
  })
    .populate("product", "name sku")
    .sort({ createdAt: -1 })
    .limit(10);

  const latestNotifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    kpis: {
      totalProducts,
      totalSuppliers,
      totalInventoryItems,
      totalOrders,
      totalForecasts,

      lowStock,
      outOfStock,

      pendingOrders,
      processingOrders,
      dispatchedOrders,
      deliveredOrders,

      plannedBatches,
      batchesInProgress,
      completedBatches,
      rejectedBatches,

      totalComplaints,
      openComplaints,

      totalTasks,
      highPriorityTasks,

      unreadNotifications,
    },

    liveQueue,

    recentActivities,

    notifications: latestNotifications,
  };
};
