import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    manufacturer,
    description,
    unitPrice,
    reorderLevel,
  } = req.body;

  const existingProduct = await Product.findOne({ sku });

  if (existingProduct) {
    throw new ApiError(400, "Product with this SKU already exists.");
  }

  const product = await Product.create({
    name,
    sku,
    category,
    manufacturer,
    description,
    unitPrice,
    reorderLevel,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully."));
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully."));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully."));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully."));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully."));
});
