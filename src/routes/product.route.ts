import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.post("/add", addProduct);
router.get("/", getAllProducts);
router.route("/:id").get(getProduct).put(updateProduct).delete(removeProduct);

export default router;
