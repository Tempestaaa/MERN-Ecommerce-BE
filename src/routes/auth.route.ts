import { Router } from "express";
import {
  getMe,
  handleRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/me", authUser, getMe);

export default router;
