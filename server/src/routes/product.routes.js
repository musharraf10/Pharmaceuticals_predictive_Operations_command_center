import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getProducts)
  .post(authorize("ADMIN", "MANAGER"), createProduct);

router
  .route("/:id")
  .get(authorize("ADMIN", "MANAGER", "ANALYST", "OPERATOR"), getProductById)
  .put(authorize("ADMIN", "MANAGER"), updateProduct)
  .delete(authorize("ADMIN", "MANAGER"), deleteProduct);

export default router;
