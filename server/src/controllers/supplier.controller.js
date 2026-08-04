import Supplier from "../models/Supplier.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSupplier = asyncHandler(async (req, res) => {
  const exists = await Supplier.findOne({ name: req.body.name });

  if (exists) {
    throw new ApiError(400, "Supplier already exists.");
  }

  const supplier = await Supplier.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, supplier, "Supplier created successfully."));
});

export const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, suppliers, "Suppliers fetched successfully."));
});

export const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, "Supplier not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier fetched successfully."));
});

export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!supplier) {
    throw new ApiError(404, "Supplier not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier updated successfully."));
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, "Supplier not found.");
  }

  await supplier.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Supplier deleted successfully."));
});
