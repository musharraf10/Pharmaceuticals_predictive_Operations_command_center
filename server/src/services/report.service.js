import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";
import ProductionBatch from "../models/ProductionBatch.js";
import Forecast from "../models/Forecast.js";
import Complaint from "../models/Complaint.js";
import Supplier from "../models/Supplier.js";
import Task from "../models/Task.js";

export const getSummaryReport = async () => {
  const [
    totalProducts,
    totalSuppliers,
    totalInventoryItems,
    totalOrders,
    totalProductionBatches,
    totalForecasts,
    totalComplaints,
    totalTasks,

    lowStockItems,
    outOfStockItems,

    pendingOrders,
    deliveredOrders,

    completedBatches,
    rejectedBatches,

    pendingTasks,
    completedTasks,

    openComplaints,
    closedComplaints,
  ] = await Promise.all([
    Product.countDocuments(),

    Supplier.countDocuments(),

    Inventory.countDocuments(),

    Order.countDocuments(),

    ProductionBatch.countDocuments(),

    Forecast.countDocuments(),

    Complaint.countDocuments(),

    Task.countDocuments(),

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
      status: "DELIVERED",
    }),

    ProductionBatch.countDocuments({
      status: "COMPLETED",
    }),

    ProductionBatch.countDocuments({
      status: "REJECTED",
    }),

    Task.countDocuments({
      status: {
        $ne: "COMPLETED",
      },
    }),

    Task.countDocuments({
      status: "COMPLETED",
    }),

    Complaint.countDocuments({
      status: {
        $ne: "CLOSED",
      },
    }),

    Complaint.countDocuments({
      status: "CLOSED",
    }),
  ]);

  return {
    generatedAt: new Date(),

    overview: {
      totalProducts,
      totalSuppliers,
      totalInventoryItems,
      totalOrders,
      totalProductionBatches,
      totalForecasts,
      totalComplaints,
      totalTasks,
    },

    inventory: {
      lowStockItems,
      outOfStockItems,
    },

    orders: {
      pendingOrders,
      deliveredOrders,
    },

    production: {
      completedBatches,
      rejectedBatches,
    },

    tasks: {
      pendingTasks,
      completedTasks,
    },

    complaints: {
      openComplaints,
      closedComplaints,
    },
  };
};

export const getInventoryReport = async () => {
  const inventory = await Inventory.find()
    .populate("product", "name sku manufacturer reorderLevel")
    .sort({
      quantity: 1,
    });

  return inventory;
};

export const getOrdersReport = async () => {
  const orders = await Order.find()
    .populate("product", "name sku manufacturer")
    .sort({
      createdAt: -1,
    });

  return orders;
};

export const getProductionReport = async () => {
  const production = await ProductionBatch.find()
    .populate("product", "name sku")
    .populate("supervisor", "name role")
    .sort({
      manufacturedDate: -1,
    });

  return production;
};

export const getForecastReport = async () => {
  const forecasts = await Forecast.find()
    .populate("product", "name sku manufacturer")
    .sort({
      createdAt: -1,
    });

  return forecasts;
};

export const getComplaintReport = async () => {
  const complaints = await Complaint.find()
    .populate("product", "name sku")
    .sort({
      createdAt: -1,
    });

  return complaints;
};

export const getTaskReport = async () => {
  const tasks = await Task.find()
    .populate("assignedTo", "name role")
    .populate("assignedBy", "name role")
    .sort({
      createdAt: -1,
    });

  return tasks;
};
