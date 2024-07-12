import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers/auth.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);
router.get("/me", authUser, getMe);

export default router;
