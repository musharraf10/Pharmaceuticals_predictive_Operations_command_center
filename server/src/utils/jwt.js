import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_COOKIE_NAME = "token";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || "7d",
  });
};

export const sendTokenCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
};
