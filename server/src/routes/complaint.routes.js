import { Router } from "express";

import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaint.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getComplaints)
  .post(authorize("ADMIN", "MANAGER", "OPERATOR"), createComplaint);

router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER"),
  updateComplaintStatus,
);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getComplaintById)
  .put(authorize("ADMIN", "MANAGER"), updateComplaint)
  .delete(authorize("ADMIN"), deleteComplaint);

export default router;
