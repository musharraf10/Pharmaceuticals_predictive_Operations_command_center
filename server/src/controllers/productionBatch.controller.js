import ProductionBatch from "../models/ProductionBatch.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProductionBatch = asyncHandler(async (req, res) => {
  const {
    batchNumber,
    product,
    quantity,
    manufacturedDate,
    expiryDate,
    productionLine,
    supervisor,
    remarks,
  } = req.body;

  const existingBatch = await ProductionBatch.findOne({ batchNumber });

  if (existingBatch) {
    throw new ApiError(400, "Batch number already exists.");
  }

  const productExists = await Product.findById(product);

  if (!productExists) {
    throw new ApiError(404, "Product not found.");
  }

  const batch = await ProductionBatch.create({
    batchNumber,
    product,
    quantity,
    manufacturedDate,
    expiryDate,
    productionLine,
    supervisor,
    remarks,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, batch, "Production batch created successfully."),
    );
});

export const getProductionBatches = asyncHandler(async (req, res) => {
  const batches = await ProductionBatch.find()
    .populate("product")
    .populate("supervisor", "name email")
    .sort({ createdAt: -1 });

  return res.json(
    new ApiResponse(200, batches, "Production batches fetched successfully."),
  );
});

export const getProductionBatchById = asyncHandler(async (req, res) => {
  const batch = await ProductionBatch.findById(req.params.id)
    .populate("product")
    .populate("supervisor", "name email");

  if (!batch) {
    throw new ApiError(404, "Production batch not found.");
  }

  return res.json(new ApiResponse(200, batch));
});

export const updateProductionBatch = asyncHandler(async (req, res) => {
  const batch = await ProductionBatch.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!batch) {
    throw new ApiError(404, "Production batch not found.");
  }

  return res.json(
    new ApiResponse(200, batch, "Production batch updated successfully."),
  );
});

export const updateBatchStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const batch = await ProductionBatch.findById(req.params.id);

  if (!batch) {
    throw new ApiError(404, "Production batch not found.");
  }

  batch.status = status;

  await batch.save();

  return res.json(
    new ApiResponse(200, batch, "Production status updated successfully."),
  );
});

export const deleteProductionBatch = asyncHandler(async (req, res) => {
  const batch = await ProductionBatch.findById(req.params.id);

  if (!batch) {
    throw new ApiError(404, "Production batch not found.");
  }

  await batch.deleteOne();

  return res.json(
    new ApiResponse(200, null, "Production batch deleted successfully."),
  );
});
