import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    postCloset, getClosets, getCloset, deleteCloset, postClosetStarter
} from "../controllers/closetController.js";


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), postCloset);
router.get("/", authMiddleware, getClosets);
router.get("/:id", authMiddleware, getCloset);
router.delete("/:id", authMiddleware, deleteCloset);
router.post("/starter", authMiddleware, postClosetStarter);



export default router;