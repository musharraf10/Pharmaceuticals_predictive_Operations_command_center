import { Router } from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.get(
  "/",
  authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
  getNotifications,
);

router.patch(
  "/mark-all-read",
  authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
  markAllAsRead,
);

router.patch(
  "/:id/read",
  authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
  markAsRead,
);

router.delete("/:id", authorize("ADMIN"), deleteNotification);

export default router;
