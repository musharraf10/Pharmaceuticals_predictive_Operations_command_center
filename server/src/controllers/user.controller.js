import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const loggedInUser = req.user;

  // 1. Basic Input Validation
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password, and role are required.");
  }

  // 2. Authorization Rules
  const allowedRoles = ["ADMIN", "MANAGER", "ANALYST", "OPERATOR"];

  if (loggedInUser.role === "ADMIN") {
    if (!allowedRoles.includes(role)) {
      throw new ApiError(400, "Invalid target role specified.");
    }
  } else if (loggedInUser.role === "MANAGER") {
    if (role !== "OPERATOR") {
      throw new ApiError(403, "Managers can only create Operator accounts.");
    }
  } else {
    // Blocks ANALYST, OPERATOR, or any unhandled role by default
    throw new ApiError(403, "You are not authorized to create users.");
  }

  // 3. Existing User Check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email.");
  }

  // 4. Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
  });

  // Remove password from returned document
  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User created successfully."));
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  return res.json(new ApiResponse(200, users, "Users retrieved successfully."));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.json(new ApiResponse(200, user, "User fetched successfully."));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const { name, department, role } = req.body;

  if (name) user.name = name;
  if (department) user.department = department;

  // Only ADMIN can change user roles
  if (role) {
    if (req.user.role !== "ADMIN") {
      throw new ApiError(403, "Only admins can update user roles.");
    }
    user.role = role;
  }

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.json(
    new ApiResponse(200, userResponse, "User updated successfully."),
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  // Authorization Guard: Only ADMIN can delete users
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only admins are allowed to delete users.");
  }

  // Prevent admin from deleting themselves accidentally
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own admin account.");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await user.deleteOne();

  return res.json(new ApiResponse(200, null, "User deleted successfully."));
});
