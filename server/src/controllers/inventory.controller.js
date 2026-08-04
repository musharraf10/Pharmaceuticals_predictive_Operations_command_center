import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInventory = asyncHandler(async (req, res) => {
  const { product, quantity, warehouse, location, expiryDate } = req.body;

  const productExists = await Product.findById(product);

  if (!productExists) {
    throw new ApiError(404, "Product not found.");
  }

  const inventory = await Inventory.create({
    product,
    quantity,
    warehouse,
    location,
    expiryDate,
    status:
      quantity <= 0
        ? "OUT_OF_STOCK"
        : quantity < productExists.reorderLevel
          ? "LOW_STOCK"
          : "AVAILABLE",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, inventory, "Inventory created successfully."));
});

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find()
    .populate("product")
    .sort({ createdAt: -1 });

  return res.json(
    new ApiResponse(200, inventory, "Inventory fetched successfully."),
  );
});

export const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id).populate("product");

  if (!inventory) {
    throw new ApiError(404, "Inventory not found.");
  }

  return res.json(new ApiResponse(200, inventory));
});

export const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    throw new ApiError(404, "Inventory not found.");
  }

  Object.assign(inventory, req.body);

  const product = await Product.findById(inventory.product);

  inventory.status =
    inventory.quantity <= 0
      ? "OUT_OF_STOCK"
      : inventory.quantity < product.reorderLevel
        ? "LOW_STOCK"
        : "AVAILABLE";

  await inventory.save();

  return res.json(
    new ApiResponse(200, inventory, "Inventory updated successfully."),
  );
});

export const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    throw new ApiError(404, "Inventory not found.");
  }

  await inventory.deleteOne();

  return res.json(
    new ApiResponse(200, null, "Inventory deleted successfully."),
  );
});

export const updateStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (typeof quantity !== "number") {
    throw new ApiError(400, "Quantity must be a number.");
  }

  const inventory = await Inventory.findById(req.params.id).populate("product");

  if (!inventory) {
    throw new ApiError(404, "Inventory not found.");
  }

  const newQuantity = inventory.quantity + quantity;

  if (newQuantity < 0) {
    throw new ApiError(400, "Insufficient stock.");
  }

  inventory.quantity = newQuantity;

  if (inventory.quantity === 0) {
    inventory.status = "OUT_OF_STOCK";
  } else if (inventory.quantity < inventory.product.reorderLevel) {
    inventory.status = "LOW_STOCK";
  } else {
    inventory.status = "AVAILABLE";
  }

  await inventory.save();

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Stock updated successfully."));
});
