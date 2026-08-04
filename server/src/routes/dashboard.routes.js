import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/",
  protect,
  authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"),
  getDashboard,
);

export default router;
