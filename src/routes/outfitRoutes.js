import { Router } from "express";
import { getOutfits, addOutfit } from "../controllers/outfitController.js";

const router = Router();

router.get("/", getOutfits);
router.post("/add", addOutfit);

export default router;
