import { Router } from "express";
import {
  getOutfitRecommendations,
  getSellDonateRecommendations,
} from "../controllers/recommendationController.js";

const router = Router();

router.get("/", getOutfitRecommendations);

router.get("/sell", getSellDonateRecommendations);

export default router;
