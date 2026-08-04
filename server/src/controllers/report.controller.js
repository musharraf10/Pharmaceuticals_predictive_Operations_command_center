import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  getSummaryReport,
  getInventoryReport,
  getOrdersReport,
  getProductionReport,
  getForecastReport,
  getComplaintReport,
  getTaskReport,
} from "../services/report.service.js";

export const summaryReport = asyncHandler(async (req, res) => {
  const data = await getSummaryReport();

  res.status(200).json(new ApiResponse(200, data, "Summary report generated."));
});

export const inventoryReport = asyncHandler(async (req, res) => {
  const data = await getInventoryReport();

  res
    .status(200)
    .json(new ApiResponse(200, data, "Inventory report generated."));
});

export const ordersReport = asyncHandler(async (req, res) => {
  const data = await getOrdersReport();

  res.status(200).json(new ApiResponse(200, data, "Orders report generated."));
});

export const productionReport = asyncHandler(async (req, res) => {
  const data = await getProductionReport();

  res
    .status(200)
    .json(new ApiResponse(200, data, "Production report generated."));
});

export const forecastReport = asyncHandler(async (req, res) => {
  const data = await getForecastReport();

  res
    .status(200)
    .json(new ApiResponse(200, data, "Forecast report generated."));
});

export const complaintReport = asyncHandler(async (req, res) => {
  const data = await getComplaintReport();

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Complaint report generated."));
});

export const taskReport = asyncHandler(async (req, res) => {
  const data = await getTaskReport();

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Task report generated."));
});
