import { Router } from "express";

import {
  createApproval,
  getApprovals,
  getApprovalById,
  deleteApproval,
} from "../controllers/approval.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST"), getApprovals)
  .post(authorize("ADMIN", "MANAGER"), createApproval);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST"), getApprovalById)
  .delete(authorize("ADMIN"), deleteApproval);

export default router;
