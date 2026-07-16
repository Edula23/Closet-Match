import prisma from '../prismaClient.js';
import { getOutfitSuggestion } from '../services/aiMatch.js';
import crypto from "crypto";
function parseIntegerList(value) {
	if (Array.isArray(value)) {
		return value
			.map((entry) => Number(entry))
			.filter((entry) => Number.isInteger(entry));
	}

	if (typeof value === "string") {
		const trimmedValue = value.trim();

		if (!trimmedValue) {
			return [];
		}

		try {
			const parsedValue = JSON.parse(trimmedValue);

			if (Array.isArray(parsedValue)) {
				return parsedValue
					.map((entry) => Number(entry))
					.filter((entry) => Number.isInteger(entry));
			}
		} catch {
			// Fall through to comma-separated parsing.
		}

		return trimmedValue
			.split(",")
			.map((entry) => Number(entry.trim()))
			.filter((entry) => Number.isInteger(entry));
	}

	return [];
}

function getRequestedClosetIds(body) {
	return parseIntegerList(
		body?.closetIds ??
		body?.selectedClosetIds ??
		body?.itemIds ??
		body?.closets ??
		body?.items
	);
}

function getOutfitName(body) {
	return body?.name?.trim() || body?.outfitName?.trim() || "Untitled Outfit";
}

function getOutfitDescription(body) {
	return body?.description?.trim() || body?.notes?.trim() || null;
}

async function loadUserClosets(userId, closetIds) {
	if (!closetIds.length) {
		return [];
	}
	const items = await prisma.closet.findMany({
		where: {
			userId,
			id: {
				in: closetIds,
			},
		},
		select: {
			id: true,
			userId: true,
			image: true,
			fileName: true,
			mimeType: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return items.map((item) => ({
		...item,
		image: item.image
			? `data:${item.mimeType || "application/octet-stream"};base64,${Buffer.from(item.image).toString("base64")}`
			: null,
	}));
}

function formatOutfit(outfit, closetItems = []) {
	if (!outfit) {
		return null;
	}

	const closetItemMap = new Map(closetItems.map((item) => [item.id, item]));
	const closetIds = Array.isArray(outfit.closetIds)
		? outfit.closetIds.map((entry) => Number(entry)).filter((entry) => Number.isInteger(entry))
		: [];

	return {
		id: outfit.id,
		userId: outfit.userId,
		name: outfit.name,
		description: outfit.description,
		closetIds,
		closetItems: closetIds.map((closetId) => closetItemMap.get(closetId)).filter(Boolean),
		createdAt: outfit.createdAt,
		updatedAt: outfit.updatedAt,
	};
}

export async function postOutfit(req, res) {
	try {
		const userId = req.userId || req.user?.id;
		const closetIds = [...new Set(getRequestedClosetIds(req.body))];
		const name = getOutfitName(req.body);
		const description = getOutfitDescription(req.body);

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized." });
		}

		if (!closetIds.length) {
			return res.status(400).json({ message: "At least one closet item is required to create an outfit." });
		}

		const closetItems = await loadUserClosets(userId, closetIds);

		if (closetItems.length !== closetIds.length) {
			const foundIds = new Set(closetItems.map((closetItem) => closetItem.id));
			const missingClosetIds = closetIds.filter((closetId) => !foundIds.has(closetId));

			return res.status(404).json({
				message: "One or more closet items were not found for this user.",
				missingClosetIds,
			});
		}

		const createdOutfitRows = await prisma.$queryRaw`
			INSERT INTO "Outfit" ("userId", "name", "description", "closetIds", "createdAt", "updatedAt")
			VALUES (${userId}, ${name}, ${description}, ${JSON.stringify(closetIds)}::jsonb, NOW(), NOW())
			RETURNING "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
		`;

		const createdOutfit = createdOutfitRows[0];

		return res.status(201).json({
			message: "Outfit created successfully.",
			outfit: formatOutfit(createdOutfit, closetItems),
		});
	} catch (error) {
		console.error("postOutfit error:", error.message);
		return res.status(500).json({ message: "Server error creating outfit." });
	}
}
export async function getOutfits(req, res) {
	try {
		const userId = req.userId || req.user?.id;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized." });
		}

		const outfits = await prisma.$queryRaw`
			SELECT "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
			FROM "Outfit"
			WHERE "userId" = ${userId}
			ORDER BY "createdAt" DESC
		`;

		const allClosetIds = [...new Set(
			outfits.flatMap((outfit) => Array.isArray(outfit.closetIds)
				? outfit.closetIds.map((closetId) => Number(closetId)).filter((closetId) => Number.isInteger(closetId))
				: [])
		)];

		const closetItems = await loadUserClosets(userId, allClosetIds);

		return res.status(200).json({
			outfits: outfits.map((outfit) => formatOutfit(outfit, closetItems)),
		});
	} catch (error) {
		console.error("getOutfits error:", error.message);
		return res.status(500).json({ message: "Server error fetching outfits." });
	}
}
export async function getOutfit(req, res) {
	try {
		const userId = req.userId || req.user?.id;
		const outfitId = Number(req.params.id);

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized." });
		}

		if (!Number.isInteger(outfitId)) {
			return res.status(400).json({ message: "Invalid outfit id." });
		}

		const outfits = await prisma.$queryRaw`
			SELECT "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
			FROM "Outfit"
			WHERE "id" = ${outfitId} AND "userId" = ${userId}
			LIMIT 1
		`;

		const outfit = outfits[0];

		if (!outfit) {
			return res.status(404).json({ message: "Outfit not found." });
		}

		const closetIds = Array.isArray(outfit.closetIds)
			? outfit.closetIds.map((closetId) => Number(closetId)).filter((closetId) => Number.isInteger(closetId))
			: [];

		const closetItems = await loadUserClosets(userId, closetIds);

		return res.status(200).json({
			outfit: formatOutfit(outfit, closetItems),
		});
	} catch (error) {
		console.error("getOutfit error:", error.message);
		return res.status(500).json({ message: "Server error fetching outfit." });
	}

}
export async function updateOutfit(req, res) {
	try {
		const userId = req.userId || req.user?.id;
		const outfitId = Number(req.params.id);

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized." });
		}

		if (!Number.isInteger(outfitId)) {
			return res.status(400).json({ message: "Invalid outfit id." });
		}

		const existingOutfits = await prisma.$queryRaw`
			SELECT "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
			FROM "Outfit"
			WHERE "id" = ${outfitId} AND "userId" = ${userId}
			LIMIT 1
		`;

		const existingOutfit = existingOutfits[0];

		if (!existingOutfit) {
			return res.status(404).json({ message: "Outfit not found." });
		}

		const requestedClosetIds = getRequestedClosetIds(req.body);
		const nextClosetIds = requestedClosetIds.length
			? [...new Set(requestedClosetIds)]
			: Array.isArray(existingOutfit.closetIds)
				? existingOutfit.closetIds.map((entry) => Number(entry)).filter((entry) => Number.isInteger(entry))
				: [];
		const nextName = req.body?.name?.trim() || req.body?.outfitName?.trim() || existingOutfit.name;
		const nextDescription = req.body?.description?.trim() || req.body?.notes?.trim() || existingOutfit.description;

		if (!nextClosetIds.length) {
			return res.status(400).json({ message: "An outfit must include at least one closet item." });
		}

		const closetItems = await loadUserClosets(userId, nextClosetIds);

		if (closetItems.length !== nextClosetIds.length) {
			const foundIds = new Set(closetItems.map((closetItem) => closetItem.id));
			const missingClosetIds = nextClosetIds.filter((closetId) => !foundIds.has(closetId));

			return res.status(404).json({
				message: "One or more closet items were not found for this user.",
				missingClosetIds,
			});
		}

		const updatedOutfits = await prisma.$queryRaw`
			UPDATE "Outfit"
			SET "name" = ${nextName},
				"description" = ${nextDescription},
				"closetIds" = ${JSON.stringify(nextClosetIds)}::jsonb,
				"updatedAt" = NOW()
			WHERE "id" = ${outfitId} AND "userId" = ${userId}
			RETURNING "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
		`;

		return res.status(200).json({
			message: "Outfit updated successfully.",
			outfit: formatOutfit(updatedOutfits[0], closetItems),
		});
	} catch (error) {
		console.error("updateOutfit error:", error.message);
		return res.status(500).json({ message: "Server error updating outfit." });
	}
}

export async function deleteOutfit(req, res) {
	try {
		const userId = req.userId || req.user?.id;
		const outfitId = Number(req.params.id);

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized." });
		}

		if (!Number.isInteger(outfitId)) {
			return res.status(400).json({ message: "Invalid outfit id." });
		}

		const deletedOutfits = await prisma.$queryRaw`
			DELETE FROM "Outfit"
			WHERE "id" = ${outfitId} AND "userId" = ${userId}
			RETURNING "id"
		`;

		if (!deletedOutfits.length) {
			return res.status(404).json({ message: "Outfit not found." });
		}

		return res.status(200).json({
			message: "Outfit deleted successfully.",
		});
	} catch (error) {
		console.error("deleteOutfit error:", error.message);
		return res.status(500).json({ message: "Server error deleting outfit." });
	}
}
export async function suggestOutfit(req, res) {
	try {
		const { targetItemId } = req.body;
		const targetItem = await prisma.closet.findUnique({ where: { id: targetItemId } });
		const closetItems = await prisma.closet.findMany({
			where: { userId: req.userId, id: { not: targetItemId } },
		});

		const result = await getOutfitSuggestion(targetItem, closetItems);
		res.json(result);
	} catch (err) {
		console.error("AI match error:", err);
		res.status(500).json({ message: "Failed to generate suggestion" });
	}
}
// controllers/outfitController.js (or wherever your outfit routes live)
export async function saveStarterOutfit(req, res) {
  try {
    const userId = req.userId || req.user?.id;
    const { name, items } = req.body; // items: [{ name, imageUrl }]

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (!items?.length) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Download each image and store as Buffer, matching your existing Bytes schema
    const createdItems = await Promise.all(
      items.map(async (item) => {
        const imgRes = await fetch(item.imageUrl);
        if (!imgRes.ok) throw new Error(`Failed to fetch ${item.imageUrl}`);

        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
        const imageHash = crypto.createHash("sha256").update(buffer).digest("hex");

        return prisma.closet.create({
          data: {
            userId,
            fileName: `${item.name.replace(/\s+/g, "-").toLowerCase()}.jpg`,
            mimeType,
            image: buffer,
            imageHash,
          },
        });
      })
    );

    const closetIds = createdItems.map((c) => c.id);

    const createdOutfitRows = await prisma.$queryRaw`
      INSERT INTO "Outfit" ("userId", "name", "description", "closetIds", "createdAt", "updatedAt")
      VALUES (${userId}, ${name}, ${""}, ${JSON.stringify(closetIds)}::jsonb, NOW(), NOW())
      RETURNING "id", "userId", "name", "description", "closetIds", "createdAt", "updatedAt"
    `;

    const createdOutfit = createdOutfitRows[0];

    return res.status(201).json({
      message: "Starter outfit created successfully.",
      outfit: formatOutfit(createdOutfit, createdItems),
    });
  } catch (error) {
    console.error("Save starter outfit error:", error.message);
    return res.status(500).json({ message: "Couldn't save outfit." });
  }
}

