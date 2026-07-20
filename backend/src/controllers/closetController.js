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
                image: true,
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
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const closets = await prisma.closet.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                userId: true,
                fileName: true,
                mimeType: true,
                image: true,
                // imageHash: true,
                // createdAt: true,
                // updatedAt: true,
                
            },
        });

        const formattedClosets = closets.map((closet) => ({
            id: closet.id,
            userId: closet.userId,
            fileName: closet.fileName,
            mimeType: closet.mimeType,
            // imageHash: closet.imageHash,
            // createdAt: closet.createdAt,
            // updatedAt: closet.updatedAt,
            image: closet.image
                ? `data:${closet.mimeType || "application/octet-stream"};base64,${Buffer.from(closet.image).toString("base64")}`
                : null,
        }));

        return res.status(200).json({
            closets: formattedClosets,
        });
    } catch (error) {
        console.error("getClosets error:", error.message);
        return res.status(500).json({ message: "Server error fetching closets." });
    }
}
export async function getCloset(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const closetId = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        if (!Number.isInteger(closetId)) {
            return res.status(400).json({ message: "Invalid closet id." });
        }

        const closet = await prisma.closet.findFirst({
            where: {
                id: closetId,
                userId,
            },
            select: {
                id: true,
                userId: true,
                fileName: true,
                mimeType: true,
                image: true,
                // imageHash: true,
                // createdAt: true,
                // updatedAt: true,
                // image: true,
            },
        });

        if (!closet) {
            return res.status(404).json({ message: "Closet item not found." });
        }

        return res.status(200).json({
            closet: {
                id: closet.id,
                userId: closet.userId,
                fileName: closet.fileName,
                mimeType: closet.mimeType,
                // imageHash: closet.imageHash,
                // createdAt: closet.createdAt,
                // updatedAt: closet.updatedAt,
                image: closet.image
                    ? `data:${closet.mimeType || "application/octet-stream"};base64,${Buffer.from(closet.image).toString("base64")}`
                    : null,
            },
        });
    } catch (error) {
        console.error("getCloset error:", error.message);
        return res.status(500).json({ message: "Server error fetching closet item." });
    }
}
export async function deleteCloset(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const closetId = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        if (!Number.isInteger(closetId)) {
            return res.status(400).json({ message: "Invalid closet id." });
        }

        const closet = await prisma.closet.findFirst({
            where: {
                id: closetId,
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!closet) {
            return res.status(404).json({ message: "Closet item not found." });
        }

        await prisma.closet.delete({
            where: {
                id: closetId,
            },
        });

        return res.status(200).json({
            message: "Closet item deleted successfully.",
        });
    } catch (error) {
        console.error("deleteCloset error:", error.message);
        return res.status(500).json({ message: "Server error deleting closet item." });
    }
}

export async function postClosetStarter(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const { category, fileName, imageUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        if (!imageUrl) {
            return res.status(400).json({ message: "imageUrl is required." });
        }

        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            throw new Error(`Failed to fetch starter image: ${imageRes.status}`);
        }

        const arrayBuffer = await imageRes.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const mimeType = imageRes.headers.get("content-type") || "image/jpeg";
        const imageHash = crypto.createHash("sha256").update(imageBuffer).digest("hex");

        const closetItem = await prisma.closet.create({
            data: {
                userId,
                image: imageBuffer,
                fileName: fileName || category || null,
                mimeType,
                imageHash,
            },
            select: {
                id: true,
                userId: true,
                fileName: true,
                mimeType: true,
                imageHash: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(201).json({
            message: "Starter item saved to closet.",
            closet: closetItem,
        });
    } catch (error) {
        console.error("postClosetStarter error:", error.message);
        return res.status(500).json({ message: "Server error saving starter closet item." });
    }
}
