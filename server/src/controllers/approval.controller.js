import Approval from "../models/Approval.js";
import Forecast from "../models/Forecast.js";
import AuditLog from "../models/AuditLog.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createApproval = asyncHandler(async (req, res) => {
  const { forecast, decision, reason } = req.body;

  const forecastExists = await Forecast.findById(forecast);

  if (!forecastExists) {
    throw new ApiError(404, "Forecast not found.");
  }

  forecastExists.reviewStatus = decision;
  await forecastExists.save();

  const existingApproval = await Approval.findOne({ forecast });

  if (existingApproval) {
    throw new ApiError(400, "This forecast has already been reviewed.");
  }

  const approval = await Approval.create({
    forecast,
    reviewer: req.user._id,
    decision,
    reason,
  });

  await AuditLog.create({
    user: req.user._id,
    action: "FORECAST_REVIEWED",
    module: "APPROVAL",
    description: `Forecast reviewed with decision: ${decision}`,
    ipAddress: req.ip,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, approval, "Decision recorded successfully."));
});

export const getApprovals = asyncHandler(async (req, res) => {
  const approvals = await Approval.find()
    .populate("forecast")
    .populate("reviewer", "name role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, approvals, "Approvals fetched successfully."));
});

export const getApprovalById = asyncHandler(async (req, res) => {
  const approval = await Approval.findById(req.params.id)
    .populate("forecast")
    .populate("reviewer", "name role");

  if (!approval) {
    throw new ApiError(404, "Approval not found.");
  }

  return res.status(200).json(new ApiResponse(200, approval));
});

export const deleteApproval = asyncHandler(async (req, res) => {
  const approval = await Approval.findById(req.params.id);

  if (!approval) {
    throw new ApiError(404, "Approval not found.");
  }

  await approval.deleteOne();

  await AuditLog.create({
    user: req.user._id,
    action: "APPROVAL_DELETED",
    module: "APPROVAL",
    description: `Approval ${approval._id} deleted.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Approval deleted successfully."));
});
