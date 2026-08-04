import { Router } from "express";

import {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  updateStock,
  deleteInventory,
} from "../controllers/inventory.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

// View Inventory
router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getInventory)
  .post(authorize("ADMIN", "MANAGER"), createInventory);

// Inventory Details
router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "OPERATOR"), getInventoryById)
  .put(authorize("ADMIN", "MANAGER"), updateInventory)
  .delete(authorize("ADMIN", "MANAGER"), deleteInventory);

// Operator Stock Update
router.patch(
  "/:id/stock",
  authorize("ADMIN", "MANAGER", "OPERATOR"),
  updateStock,
);

export default router;
