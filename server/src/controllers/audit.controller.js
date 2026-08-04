import AuditLog from "../models/AuditLog.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, user, module, action } = req.query;

  const filter = {};

  if (user) filter.user = user;
  if (module) filter.module = module.toUpperCase();
  if (action) filter.action = action.toUpperCase();

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
      "Audit logs fetched successfully.",
    ),
  );
});

export const getAuditLogById = asyncHandler(async (req, res) => {
  const log = await AuditLog.findById(req.params.id).populate(
    "user",
    "name email role",
  );

  if (!log) {
    throw new ApiError(404, "Audit log not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, log, "Audit log fetched successfully."));
});
