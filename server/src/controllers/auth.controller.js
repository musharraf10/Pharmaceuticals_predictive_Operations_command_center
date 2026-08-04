import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateToken,
  sendTokenCookie,
  clearTokenCookie,
} from "../utils/jwt.js";

// export const register = asyncHandler(async (req, res) => {
//   const { name, email, password, role, department } = req.body;

//   const exists = await User.findOne({ email });

//   if (exists) {
//     throw new ApiError(400, "User already exists.");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role,
//     department,
//   });

//   const token = generateToken(user._id);

//   sendTokenCookie(res, token);

//   user.password = undefined;

//   return res
//     .status(201)
//     .json(new ApiResponse(201, user, "User registered successfully."));
// });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  sendTokenCookie(res, token);

  user.password = undefined;

  return res.json(new ApiResponse(200, user, "Login successful."));
});

export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);

  return res.json(new ApiResponse(200, null, "Logged out successfully."));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, req.user));
});
