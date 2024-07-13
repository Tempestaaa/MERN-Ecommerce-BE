import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware";
import {
  addOrRemoveCart,
  addOrRemoveWishList,
  deleteProfile,
  deleteUser,
  getAllUsers,
  getCart,
  getWishList,
  removeAllInCart,
  removeAllInWishList,
  updatePassword,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();

// ========== USER ==========
router
  .route("/profile")
  .put(authUser, updateProfile)
  .delete(authUser, deleteProfile);
router.patch("/password", authUser, updatePassword);

// ========== CART ==========
router.post("/cart/:productId", authUser, addOrRemoveCart);
router.get("/cart", authUser, getCart);
router.post("/remove-cart", authUser, removeAllInCart);

// ========== WISHLIST ==========
router.post("/wishlist/:productId", authUser, addOrRemoveWishList);
router.get("/wishlist", authUser, getWishList);
router.post("/remove-wishlist", authUser, removeAllInWishList);

// ========== ADMIN ==========
router.get("/", authUser, getAllUsers);
router.delete("/delete-user/:id", authUser, deleteUser);

export default router;
