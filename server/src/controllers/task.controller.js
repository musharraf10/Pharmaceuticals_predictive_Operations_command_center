import Task from "../models/Task.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    assignedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully."));
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name role")
    .populate("assignedBy", "name role")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, tasks));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name role")
    .populate("assignedBy", "name role");

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return res.status(200).json(new ApiResponse(200, task));
});

export const assignTask = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;

  const user = await User.findById(assignedTo);

  if (!user) {
    throw new ApiError(404, "Assigned user not found.");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  task.assignedTo = assignedTo;

  await task.save();

  await AuditLog.create({
    user: req.user._id,
    action: "TASK_ASSIGNED",
    module: "TASK",
    description: `Task "${task.title}" assigned to ${user.name}.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task assigned successfully."));
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  task.status = status;

  await task.save();

  await AuditLog.create({
    user: req.user._id,
    action: "TASK_STATUS_UPDATED",
    module: "TASK",
    description: `Task "${task.title}" status changed to ${status}.`,
    ipAddress: req.ip,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated."));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully."));
});
