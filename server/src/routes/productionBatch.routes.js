import { Router } from "express";

import {
  createProductionBatch,
  getProductionBatches,
  getProductionBatchById,
  updateProductionBatch,
  updateBatchStatus,
  deleteProductionBatch,
} from "../controllers/productionBatch.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(
    authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
    getProductionBatches,
  )
  .post(authorize("ADMIN", "MANAGER"), createProductionBatch);

router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER", "OPERATOR"),
  updateBatchStatus,
);

router
  .route("/:id")
  .get(
    authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
    getProductionBatchById,
  )
  .put(authorize("ADMIN", "MANAGER"), updateProductionBatch)
  .delete(authorize("ADMIN"), deleteProductionBatch);

export default router;
