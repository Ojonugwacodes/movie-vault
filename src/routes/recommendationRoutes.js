import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getRecommendations } from "../controllers/generateRecommendations.js";

const router = express.Router();

router.get("/", authMiddleware, getRecommendations);

export default router;