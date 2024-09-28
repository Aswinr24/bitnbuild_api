import { Router } from "express";
import {
  getAccessories,
  addAccessory,
} from "../controllers/accessoriesController.js";

const router = Router();

router.get("/", getAccessories);
router.post("/add", addAccessory);

export default router;
