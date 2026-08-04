import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getOrders)
  .post(authorize("ADMIN", "MANAGER", "OPERATOR"), createOrder);

router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER", "OPERATOR"),
  updateOrderStatus,
);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getOrderById)
  .put(authorize("ADMIN", "MANAGER"), updateOrder)
  .delete(authorize("ADMIN"), deleteOrder);

export default router;
