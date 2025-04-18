import { Router } from "express";

const router = Router();
import { onboardMentor } from "../controllers/mentor.controller.js";

router.post("/onboard", onboardMentor);

export default router;
