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

    forecastsList,
    batchesList,
    inventoryList,
    complaintsList,
  ] = await Promise.all([
    Product.countDocuments(),
    Supplier.countDocuments(),
    Inventory.countDocuments(),
    Order.countDocuments(),
    Complaint.countDocuments(),
    Task.countDocuments(),
    Forecast.countDocuments(),

    Inventory.countDocuments({ status: "LOW_STOCK" }),
    Inventory.countDocuments({ status: "OUT_OF_STOCK" }),

    Order.countDocuments({ status: "PENDING" }),
    Order.countDocuments({ status: "PROCESSING" }),
    Order.countDocuments({ status: "DISPATCHED" }),
    Order.countDocuments({ status: "DELIVERED" }),

    ProductionBatch.countDocuments({ status: "PLANNED" }),
    ProductionBatch.countDocuments({ status: "IN_PROGRESS" }),
    ProductionBatch.countDocuments({ status: "COMPLETED" }),
    ProductionBatch.countDocuments({ status: "REJECTED" }),

    Notification.countDocuments({ isRead: false }),

    Task.countDocuments({ priority: "HIGH", status: { $ne: "COMPLETED" } }),
    Complaint.countDocuments({ status: { $ne: "CLOSED" } }),

    Forecast.find()
      .populate("product", "name sku category reorderLevel price")
      .sort({ createdAt: -1 })
      .limit(10),

    ProductionBatch.find()
      .populate("product", "name sku category")
      .sort({ createdAt: -1 })
      .limit(30),

    Inventory.find()
      .populate("product", "name sku reorderLevel minStockLevel maxStockLevel")
      .sort({ createdAt: -1 }),

    Complaint.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const recentActivities = await AuditLog.find()
    .populate("user", "name role")
    .sort({ createdAt: -1 })
    .limit(10);

  const liveQueue = await Order.find({
    status: { $in: ["PENDING", "PROCESSING", "READY_TO_DISPATCH"] },
  })
    .populate("product", "name sku")
    .sort({ createdAt: -1 })
    .limit(10);

  const latestNotifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // Derived Analytics: Demand Forecast & Anomaly Markers
  let demandForecastData = forecastsList.map((f) => {
    const currentStock = f.inputSnapshot?.currentStock ?? 0;
    const pending = f.inputSnapshot?.pendingOrders ?? 0;
    const delivered = f.inputSnapshot?.deliveredOrders ?? 0;
    const demand = f.predictedDemand ?? 0;
    const isAnomaly =
      f.riskLevel === "HIGH" ||
      demand > currentStock * 1.5 ||
      (currentStock === 0 && demand > 0) ||
      f.confidence < 75;

    return {
      id: f._id,
      name: f.product?.name ?? "Product SKU",
      sku: f.product?.sku ?? "-",
      predictedDemand: demand,
      currentStock,
      deliveredOrders: delivered,
      pendingOrders: pending,
      confidence: f.confidence ?? 85,
      riskLevel: f.riskLevel ?? "LOW",
      recommendation: f.recommendation ?? "",
      isAnomaly,
      anomalyReason: isAnomaly
        ? demand > currentStock * 1.5
          ? "Predicted demand exceeds stock by >50%"
          : currentStock === 0
          ? "Out of stock with pending demand"
          : "Low prediction confidence"
        : null,
    };
  });

  // Fallback for production environments where Forecast collection has no records yet
  if (demandForecastData.length === 0) {
    const allProducts = await Product.find().limit(8);
    const allInventories = await Inventory.find();

    const invMap = {};
    allInventories.forEach((i) => {
      if (i.product) invMap[i.product.toString()] = i.quantity || 0;
    });

    demandForecastData = await Promise.all(
      allProducts.map(async (p) => {
        const stock = invMap[p._id.toString()] || 0;
        const pending = await Order.countDocuments({
          product: p._id,
          status: { $in: ["PENDING", "PROCESSING"] },
        });
        const delivered = await Order.countDocuments({
          product: p._id,
          status: "DELIVERED",
        });
        const reorder = p.reorderLevel || 50;
        const predicted = Math.max(delivered + pending * 2 + Math.max(reorder - stock, 0), 100);
        const isAnomaly = predicted > stock * 1.5 || stock < reorder;

        return {
          id: p._id,
          name: p.name,
          sku: p.sku || "SKU-001",
          predictedDemand: predicted,
          currentStock: stock,
          deliveredOrders: delivered,
          pendingOrders: pending,
          confidence: 88,
          riskLevel: isAnomaly ? "HIGH" : "LOW",
          recommendation: isAnomaly
            ? "Replenish stock immediately to prevent bottleneck."
            : "Current stock and demand balance is optimal.",
          isAnomaly,
          anomalyReason: isAnomaly
            ? stock < reorder
              ? "Stock is below safety reorder level"
              : "Predicted demand exceeds stock by >50%"
            : null,
        };
      })
    );
  }

  // Derived Analytics: Production Lines Capacity Heat Map
  const defaultLines = ["Line 1", "Line 2", "Line 3", "Line 4"];
  const lineStatsMap = {};

  defaultLines.forEach((l) => {
    lineStatsMap[l] = {
      line: l,
      planned: 0,
      inProgress: 0,
      qualityCheck: 0,
      completed: 0,
      totalBatches: 0,
      totalQuantity: 0,
    };
  });

  batchesList.forEach((b) => {
    const l = b.productionLine || "Line 1";
    if (!lineStatsMap[l]) {
      lineStatsMap[l] = {
        line: l,
        planned: 0,
        inProgress: 0,
        qualityCheck: 0,
        completed: 0,
        totalBatches: 0,
        totalQuantity: 0,
      };
    }
    const target = lineStatsMap[l];
    target.totalBatches += 1;
    target.totalQuantity += b.quantity || 0;

    if (b.status === "PLANNED") target.planned += 1;
    else if (b.status === "IN_PROGRESS") target.inProgress += 1;
    else if (b.status === "QUALITY_CHECK") target.qualityCheck += 1;
    else if (b.status === "COMPLETED") target.completed += 1;
  });

  const productionCapacityData = Object.values(lineStatsMap).map((l) => {
    const active = l.planned + l.inProgress + l.qualityCheck;
    // Assume standard max capacity of 6 active batches per line
    const maxCapacity = 6;
    const utilizationPercent = Math.min(Math.round((active / maxCapacity) * 100), 100);

    let status = "OPTIMAL";
    if (utilizationPercent < 30) status = "LOW";
    else if (utilizationPercent >= 85) status = "OVERLOADED";
    else if (utilizationPercent >= 60) status = "HIGH";

    return {
      ...l,
      activeBatches: active,
      maxCapacity,
      utilizationPercent,
      capacityStatus: status,
    };
  });

  // Derived Analytics: Workload Forecast Data
  const workloadForecastData = defaultLines.map((l) => {
    const stats = lineStatsMap[l] || {};
    const batchWorkload = (stats.planned || 0) * 100 + (stats.inProgress || 0) * 150;

    return {
      line: l,
      plannedBatches: stats.planned || 0,
      inProgressBatches: stats.inProgress || 0,
      completedBatches: stats.completed || 0,
      totalBatches: stats.totalBatches || 0,
      workloadUnits: batchWorkload || 50,
      pendingOrders: Math.round(pendingOrders / defaultLines.length),
    };
  });

  // Derived Analytics: Risk Drill-down Telemetry Items
  const riskItems = [];

  inventoryList
    .filter((inv) => inv.status === "LOW_STOCK" || inv.status === "OUT_OF_STOCK")
    .forEach((inv) => {
      riskItems.push({
        id: `inv-${inv._id}`,
        category: "INVENTORY",
        title: `${inv.product?.name || "Item"} Stock Warning`,
        severity: inv.status === "OUT_OF_STOCK" ? "HIGH" : "MEDIUM",
        currentValue: `${inv.quantity} units`,
        thresholdValue: `${inv.product?.reorderLevel || 50} units (Reorder)`,
        description: `Inventory is ${inv.status.replace("_", " ").toLowerCase()}. Immediate restock required.`,
        product: inv.product?.name,
        actionPath: "/inventory",
      });
    });

  forecastsList
    .filter((f) => f.riskLevel === "HIGH")
    .forEach((f) => {
      riskItems.push({
        id: `fc-${f._id}`,
        category: "FORECAST",
        title: `High Demand Risk: ${f.product?.name || "Product"}`,
        severity: "HIGH",
        currentValue: `${f.predictedDemand} units predicted`,
        thresholdValue: `${f.inputSnapshot?.currentStock || 0} units in stock`,
        description: f.recommendation || "Forecast indicates major demand spike exceeding safety stock.",
        product: f.product?.name,
        actionPath: "/forecast",
      });
    });

  productionCapacityData
    .filter((c) => c.capacityStatus === "OVERLOADED" || c.capacityStatus === "HIGH")
    .forEach((c) => {
      riskItems.push({
        id: `cap-${c.line}`,
        category: "CAPACITY",
        title: `${c.line} Capacity Strain`,
        severity: c.capacityStatus === "OVERLOADED" ? "HIGH" : "MEDIUM",
        currentValue: `${c.utilizationPercent}% utilization`,
        thresholdValue: "85% threshold",
        description: `${c.activeBatches} active batches assigned to ${c.line}. Reallocate production batches if needed.`,
        product: c.line,
        actionPath: "/production",
      });
    });

  complaintsList
    .filter((c) => c.severity === "CRITICAL" || c.severity === "HIGH")
    .forEach((c) => {
      riskItems.push({
        id: `cmp-${c._id}`,
        category: "COMPLAINT",
        title: `Quality Issue: ${c.title}`,
        severity: "HIGH",
        currentValue: `${c.severity} severity`,
        thresholdValue: "Requires Resolution",
        description: `Open complaint on ${c.product?.name || "Product"}. Quality team review pending.`,
        product: c.product?.name,
        actionPath: "/complaints",
      });
    });

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

      anomaliesCount: demandForecastData.filter((d) => d.isAnomaly).length,
      overloadedLinesCount: productionCapacityData.filter((c) => c.capacityStatus === "OVERLOADED").length,
    },

    liveQueue,
    recentActivities,
    notifications: latestNotifications,

    demandForecastData,
    workloadForecastData,
    productionCapacityData,
    riskItems,
  };
};
