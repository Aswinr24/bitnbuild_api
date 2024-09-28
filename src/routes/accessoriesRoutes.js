import { Router } from "express";
import {
  getAccessories,
  addAccessory,
  removeAccessory,
} from "../controllers/accessoriesController.js";
import { uploadImageMiddleware } from "../middleware/imageUpload.js";

const router = Router();

router.get("/", getAccessories);
router.post("/add", uploadImageMiddleware, addAccessory);
router.delete("/remove", removeAccessory);

export default router;
