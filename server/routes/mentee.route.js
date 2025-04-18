import { Router } from "express";

const router = Router();
import { onboardMentee } from "../controllers/mentee.controller.js";

router.post("/onboard", onboardMentee);

export default router;
