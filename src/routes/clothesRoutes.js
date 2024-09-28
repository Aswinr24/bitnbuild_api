import { Router } from "express";
import { getClothes, addClothes } from "../controllers/clothesController.js";

const router = Router();

router.get("/", getClothes);
router.post("/add", addClothes);

export default router;
