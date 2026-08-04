import Forecast from "../models/Forecast.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";
import Complaint from "../models/Complaint.js";
import ProductionBatch from "../models/ProductionBatch.js";

export const generateForecast = async () => {
  const products = await Product.find();

  const forecasts = [];

  for (const product of products) {
    // Run all database queries for a product in parallel
    const [
      inventory,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      activeBatches,
      complaintCount,
    ] = await Promise.all([
      Inventory.findOne({ product: product._id }),
      Order.countDocuments({ product: product._id }),
      Order.countDocuments({ product: product._id, status: "DELIVERED" }),
      Order.countDocuments({
        product: product._id,
        status: { $in: ["PENDING", "PROCESSING", "READY_TO_DISPATCH"] },
      }),
      ProductionBatch.countDocuments({
        product: product._id,
        status: { $in: ["PLANNED", "IN_PROGRESS", "QUALITY_CHECK"] },
      }),
      Complaint.countDocuments({
        product: product._id,
        status: { $ne: "CLOSED" },
      }),
    ]);

    const currentStock = inventory?.quantity || 0;
    const reorderLevel = product.reorderLevel || 0;

    // 1. Predicted Demand Calculation
    const predictedDemand =
      deliveredOrders +
      pendingOrders +
      Math.max(reorderLevel - currentStock, 0);

    // 2. Risk Score Calculation
    let riskScore = 0;

    if (currentStock < reorderLevel) riskScore += 40;
    if (pendingOrders > currentStock) riskScore += 30;
    if (complaintCount > 3) riskScore += 15;
    if (activeBatches === 0) riskScore += 15;

    let riskLevel = "LOW";
    if (riskScore >= 70 || currentStock < reorderLevel) {
      riskLevel = "HIGH";
    } else if (riskScore >= 40 || currentStock < reorderLevel * 2) {
      riskLevel = "MEDIUM";
    }

    // 3. Confidence Calculation
    let confidence = 95;

    if (totalOrders < 5) confidence -= 20;
    else if (totalOrders < 20) confidence -= 10;

    if (complaintCount > 3) confidence -= 5;
    if (activeBatches === 0) confidence -= 10;

    confidence = Math.max(confidence, 60);

    // 4. Recommendation Logic
    let recommendation = "Current operations and stock levels are stable.";

    if (riskLevel === "HIGH") {
      recommendation =
        "Increase production immediately, replenish inventory, and reorder raw materials.";
    } else if (riskLevel === "MEDIUM") {
      recommendation =
        "Monitor demand closely, prepare the next production batch, and schedule additional production.";
    }

    // const aiResponse = await generateForecastAnalysis({
    //   currentStock,

    //   reorderLevel: product.reorderLevel,

    //   pendingOrders,

    //   deliveredOrders,

    //   complaintCount,

    //   activeBatches,
    // });
    // recommendation: aiResponse;

    // 5. Create Forecast Record
    const forecast = await Forecast.create({
      product: product._id,
      predictedDemand,
      confidence,
      riskLevel,
      recommendation,
      modelVersion: "gemini-2.5-flash-v1",
      generatedAt: new Date(),
      explanation: `Forecast generated using:

        Delivered Orders : ${deliveredOrders}
        Pending Orders : ${pendingOrders}
        Current Stock : ${currentStock}
        Active Production : ${activeBatches}
        Complaints : ${complaintCount}`,
      inputSnapshot: {
        currentStock,
        deliveredOrders,
        pendingOrders,
        activeBatches,
        complaintCount,
        totalOrders,
      },
    });

    forecasts.push(forecast);
  }

  return forecasts;
};
