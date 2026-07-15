import express from "express";
import { registerUserCon, loginUserCon, getProfileCon } from "../controllers/userController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUserCon);
router.get("/profile", verifyToken, getProfileCon);

router.post("/register", registerUserCon);

router.post("/admin/create-user", verifyToken, requireRole(["admin"]), registerUserCon);

export default router;
