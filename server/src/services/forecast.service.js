import Forecast from "../models/Forecast.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";
import Complaint from "../models/Complaint.js";
import ProductionBatch from "../models/ProductionBatch.js";
import { generateForecastAnalysis } from "./gemini.service.js";

export const generateForecast = async () => {
  const products = await Product.find();

  // Clear previous forecasts to store new AI prediction run
  await Forecast.deleteMany({});

  const forecasts = [];

  for (const product of products) {
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

    // Call Real-Time Google Gemini AI API Prediction Service
    const aiPrediction = await generateForecastAnalysis({
      productName: product.name,
      category: product.category,
      currentStock,
      reorderLevel,
      pendingOrders,
      deliveredOrders,
      totalOrders,
      activeBatches,
      complaintCount,
    });

    let predictedDemand;
    let confidence;
    let riskLevel;
    let recommendation;
    let explanation;
    let modelVersion;

    if (aiPrediction) {
      predictedDemand = aiPrediction.predictedDemand;
      confidence = aiPrediction.confidence;
      riskLevel = aiPrediction.riskLevel;
      recommendation = aiPrediction.recommendation;
      explanation = aiPrediction.explanation;
      modelVersion = aiPrediction.usedModel || "Gemini AI";
    } else {
      // Fallback baseline if API quota or connection issue occurs
      predictedDemand =
        deliveredOrders + pendingOrders + Math.max(reorderLevel - currentStock, 0);

      let riskScore = 0;
      if (currentStock < reorderLevel) riskScore += 40;
      if (pendingOrders > currentStock) riskScore += 30;
      if (complaintCount > 3) riskScore += 15;
      if (activeBatches === 0) riskScore += 15;

      if (riskScore >= 70 || currentStock < reorderLevel) {
        riskLevel = "HIGH";
      } else if (riskScore >= 40 || currentStock < reorderLevel * 2) {
        riskLevel = "MEDIUM";
      } else {
        riskLevel = "LOW";
      }

      confidence = Math.max(85 - (totalOrders < 5 ? 20 : 0) - (complaintCount > 3 ? 5 : 0), 60);

      recommendation =
        riskLevel === "HIGH"
          ? "Increase production immediately, replenish inventory, and reorder raw materials."
          : riskLevel === "MEDIUM"
          ? "Monitor demand closely, prepare the next production batch, and schedule additional production."
          : "Current operations and stock levels are stable.";

      explanation = `Baseline Telemetry: Delivered (${deliveredOrders}), Pending (${pendingOrders}), Current Stock (${currentStock}), Active Batches (${activeBatches}).`;
      modelVersion = "Heuristic Baseline";
    }

    const forecast = await Forecast.create({
      product: product._id,
      predictedDemand,
      confidence,
      riskLevel,
      recommendation,
      modelVersion,
      generatedAt: new Date(),
      explanation,
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
