import { Router } from "express";
import {
  getClothes,
  addClothes,
  removeCloth,
} from "../controllers/clothesController.js";
import { uploadImageMiddleware } from "../middleware/imageUpload.js";

const router = Router();

router.get("/", getClothes);
router.post("/add", uploadImageMiddleware, addClothes);
router.delete("/remove", removeCloth);

export default router;
