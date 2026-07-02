import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    postOutfit, getOutfits, getOutfit, deleteOutfit, updateOutfit
} from "../controllers/outfitController.js";


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/new", authMiddleware, upload.any(), postOutfit);
router.get("/", authMiddleware, getOutfits);
router.get("/:id", authMiddleware, getOutfit);
router.put("/:id", authMiddleware, upload.any(), updateOutfit);
router.delete("/:id", authMiddleware, deleteOutfit);



export default router;