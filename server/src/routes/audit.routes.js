import { Router } from "express";

import {
  getAuditLogs,
  getAuditLogById,
} from "../controllers/audit.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.get("/", authorize("ADMIN", "MANAGER", "ANALYST"), getAuditLogs);

router.get("/:id", authorize("ADMIN", "MANAGER", "ANALYST"), getAuditLogById);

export default router;
