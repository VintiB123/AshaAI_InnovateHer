import { Router } from "express";

const router = Router();
import { registerUser } from "../controllers/user.controller.js";

router.post("/register", registerUser);

export default router;
