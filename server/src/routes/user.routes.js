import { Router } from "express";

import {
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router.get("/", authorize("ADMIN", "MANAGER"), getUsers);

router.post("/", authorize("ADMIN", "MANAGER"), createUser);

router.get("/:id", authorize("ADMIN", "MANAGER"), getUserById);

router.put("/:id", authorize("ADMIN", "MANAGER"), updateUser);

router.delete("/:id", authorize("ADMIN"), deleteUser);

export default router;
