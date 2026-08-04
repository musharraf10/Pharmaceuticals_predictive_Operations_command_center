import { Router } from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  assignTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getTasks)
  .post(authorize("ADMIN", "MANAGER"), createTask);

router.patch("/:id/assign", authorize("ADMIN", "MANAGER"), assignTask);

router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER", "OPERATOR"),
  updateTaskStatus,
);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getTaskById)
  .put(authorize("ADMIN", "MANAGER", "OPERATOR"), updateTask)
  .delete(authorize("ADMIN"), deleteTask);

export default router;
