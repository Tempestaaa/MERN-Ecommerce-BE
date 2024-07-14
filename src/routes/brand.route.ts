import { Router } from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller";
import { authUser, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllBrands);
router
  .route("/one/:id")
  .get(getBrand)
  .put(authUser, isAdmin, updateBrand)
  .delete(authUser, isAdmin, deleteBrand);
router.post("/add", authUser, isAdmin, addBrand);

export default router;
