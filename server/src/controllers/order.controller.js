import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notification.js";
import Inventory from "../models/Inventory.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import Task from "../models/Task.js";

export const createOrder = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.product);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const inventory = await Inventory.findOne({
    product: req.body.product,
  });

  if (!inventory) {
    throw new ApiError(404, "Inventory not found.");
  }

  if (inventory.quantity < req.body.quantity) {
    throw new ApiError(400, "Requested quantity exceeds available stock.");
  }

  const order = await Order.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully."));
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("product").sort({ createdAt: -1 });

  return res.json(new ApiResponse(200, orders));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("product");

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res.json(new ApiResponse(200, order));
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res.json(new ApiResponse(200, order, "Order updated successfully."));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Reduce stock only once
  if (status === "DISPATCHED" && order.status !== "DISPATCHED") {
    const inventory = await Inventory.findOne({
      product: order.product,
    }).populate("product");

    if (!inventory) {
      throw new ApiError(404, "Inventory not found.");
    }

    if (inventory.quantity < order.quantity) {
      throw new ApiError(400, "Insufficient inventory available.");
    }

    inventory.quantity -= order.quantity;

    if (inventory.quantity === 0) {
      inventory.status = "OUT_OF_STOCK";
    } else if (inventory.quantity < inventory.product.reorderLevel) {
      inventory.status = "LOW_STOCK";
    } else {
      inventory.status = "AVAILABLE";
    }

    await inventory.save();

    if (inventory.status === "LOW_STOCK") {
      await Task.create({
        title: "Low Inventory Alert",
        description: `${inventory.product.name} stock is below reorder level.`,
        priority: "HIGH",
        status: "PENDING",
        assignedTo: undefined,
        assignedBy: req.user._id,
      });
    }

    await createNotification({
      title: "Inventory Updated",
      message: `${order.quantity} units of ${inventory.product.name} dispatched successfully.`,
      severity: "MEDIUM",
    });

    await AuditLog.create({
      user: req.user._id,
      action: "ORDER_DISPATCHED",
      module: "ORDER",
      description: `Order ${order._id} dispatched. Inventory updated.`,
      ipAddress: req.ip,
    });
  }

  order.status = status;

  if (status === "DELIVERED") {
    order.deliveredAt = new Date();

    await AuditLog.create({
      user: req.user._id,
      action: "ORDER_DELIVERED",
      module: "ORDER",
      description: `Order ${order._id} delivered successfully.`,
      ipAddress: req.ip,
    });
  }

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully."));
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  await order.deleteOne();

  return res.json(new ApiResponse(200, null, "Order deleted successfully."));
});
