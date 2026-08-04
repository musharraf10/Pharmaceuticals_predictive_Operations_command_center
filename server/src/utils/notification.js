import Notification from "../models/Notification.js";

export const createNotification = async ({
  title,
  message,
  severity = "LOW",
}) => {
  return Notification.create({
    title,
    message,
    severity,
  });
};
