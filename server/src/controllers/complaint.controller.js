import Complaint from "../models/Complaint.js";
import Product from "../models/Product.js";
import Task from "../models/Task.js";
import AuditLog from "../models/AuditLog.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, product, reportedBy, severity } = req.body;

  const productExists = await Product.findById(product);

  if (!productExists) {
    throw new ApiError(404, "Product not found.");
  }

  const complaint = await Complaint.create({
    title,
    description,
    product,
    reportedBy,
    severity,
  });

  if (["HIGH", "CRITICAL"].includes(severity)) {
    await Task.create({
      title: `Investigate Complaint - ${productExists.name}`,
      description,
      priority: severity === "CRITICAL" ? "CRITICAL" : "HIGH",
      assignedBy: req.user._id,
      status: "PENDING",
    });
  }

  await AuditLog.create({
    user: req.user._id,
    action: "COMPLAINT_CREATED",
    module: "COMPLAINT",
    description: `Complaint created for ${productExists.name}`,
    ipAddress: req.ip,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, complaint, "Complaint created successfully."));
});

export const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("product", "name sku")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, complaints, "Complaints fetched successfully."));
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(
    "product",
    "name sku",
  );

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  return res.status(200).json(new ApiResponse(200, complaint));
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  await AuditLog.create({
    user: req.user._id,
    action: "COMPLAINT_UPDATED",
    module: "COMPLAINT",
    description: `Complaint ${complaint._id} updated.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, complaint, "Complaint updated successfully."));
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  complaint.status = status;

  await complaint.save();

  await AuditLog.create({
    user: req.user._id,
    action: "COMPLAINT_STATUS_UPDATED",
    module: "COMPLAINT",
    description: `Complaint status changed to ${status}.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, complaint, "Complaint status updated successfully."),
    );
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  await complaint.deleteOne();

  await AuditLog.create({
    user: req.user._id,
    action: "COMPLAINT_DELETED",
    module: "COMPLAINT",
    description: `Complaint ${complaint._id} deleted.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Complaint deleted successfully."));
});
