import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { googleLogin } from "../controllers/authController.js";


const router = express.Router();

// Public routes
router.post("/google", googleLogin);
// router.post("/login", login);
// router.post("/logout", authMiddleware, logout);
// router.get("/me", authMiddleware, me);



export default router;