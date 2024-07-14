import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { authUser, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllCategories);
router
  .route("/one/:id")
  .get(getCategory)
  .put(authUser, isAdmin, updateCategory)
  .delete(authUser, isAdmin, deleteCategory);
router.post("/add", authUser, isAdmin, addCategory);

export default router;
