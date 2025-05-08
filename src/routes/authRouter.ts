import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = Router();


authRouter.get("/", authController.getAllUsers);
authRouter.post("/register", authController.createUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", authController.logoutUser);

authRouter.get("/me", authenticateToken, authController.getCurrentUser);

export default authRouter;