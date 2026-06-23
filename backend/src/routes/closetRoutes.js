import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    postCloset, getClosets, getCloset, deleteCloset
} from "../controllers/closetController.js";


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", authMiddleware, upload.any(), postCloset);
router.get("/", authMiddleware, getClosets);
router.get("/:id", authMiddleware, getCloset);
router.delete("/:id", authMiddleware, deleteCloset);



export default router;