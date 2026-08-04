import { Router } from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getSuppliers)
  .post(authorize("ADMIN", "MANAGER"), createSupplier);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getSupplierById)
  .put(authorize("ADMIN", "MANAGER"), updateSupplier)
  .delete(authorize("ADMIN"), deleteSupplier);

export default router;
