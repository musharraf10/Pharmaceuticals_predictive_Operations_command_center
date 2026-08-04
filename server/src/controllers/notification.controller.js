import Notification from "../models/Notification.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "Notifications fetched successfully.",
      ),
    );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  notification.isRead = true;

  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read."));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications marked as read."));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  await notification.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully."));
});
