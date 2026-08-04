import { Router } from "express";

import {
  summaryReport,
  inventoryReport,
  ordersReport,
  productionReport,
  forecastReport,
  complaintReport,
  taskReport,
} from "../controllers/report.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.get("/summary", authorize("ADMIN", "MANAGER", "ANALYST"), summaryReport);

router.get(
  "/inventory",
  authorize("ADMIN", "MANAGER", "ANALYST"),
  inventoryReport,
);

router.get("/orders", authorize("ADMIN", "MANAGER", "ANALYST"), ordersReport);

router.get(
  "/production",
  authorize("ADMIN", "MANAGER", "ANALYST"),
  productionReport,
);

router.get(
  "/forecast",
  authorize("ADMIN", "MANAGER", "ANALYST"),
  forecastReport,
);

router.get(
  "/complaints",
  authorize("ADMIN", "MANAGER", "ANALYST"),
  complaintReport,
);

router.get("/tasks", authorize("ADMIN", "MANAGER", "ANALYST"), taskReport);

export default router;
