import crypto from "crypto";
import prisma from '../prismaClient.js';

function toBuffer(imageFile) {
    if (!imageFile?.buffer) {
        return null;
    }

    return Buffer.isBuffer(imageFile.buffer)
        ? imageFile.buffer
        : Buffer.from(imageFile.buffer);
}

export async function postCloset(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const imageFile = Array.isArray(req.files) ? req.files[0] : req.file;
        const imageBuffer = toBuffer(imageFile);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        if (!imageBuffer) {
            return res.status(400).json({ message: "Image file is required." });
        }

        const imageHash = crypto.createHash("sha256").update(imageBuffer).digest("hex");

        const closetItem = await prisma.closet.create({
            data: {
                userId,
                image: imageBuffer,
                fileName: imageFile.originalname || null,
                mimeType: imageFile.mimetype || null,
                imageHash,
            },
            select: {
                id: true,
                userId: true,
                fileName: true,
                mimeType: true,
                imageHash: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(201).json({
            message: "Image saved to closet.",
            closet: closetItem,
        });
    } catch (error) {
        console.error("postCloset error:", error.message);
        return res.status(500).json({ message: "Server error saving closet image." });
    }

}
export async function getClosets(req, res) {


}
export async function getCloset(req, res) {

}
export async function deleteCloset(req, res) {

}
