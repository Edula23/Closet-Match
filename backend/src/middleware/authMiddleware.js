import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js';

function extractJwtToken(value = "") {
    const normalized = value.trim().replace(/^Bearer\s+/i, "").replace(/^['\"]|['\"]$/g, "");
    const jwtMatch = normalized.match(/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);

    return jwtMatch ? jwtMatch[0] : normalized;
}

function readTokenFromCookie(cookieHeader = "") {
    const tokenCookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("token="));

    return tokenCookie ? extractJwtToken(decodeURIComponent(tokenCookie.slice("token=".length))) : "";
}

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const cookieToken = readTokenFromCookie(req.headers.cookie || "");
    const authToken = authHeader ? extractJwtToken(authHeader) : cookieToken;

    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, tokenVersion: true },
        });

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Unauthorized: Token has been revoked." });
        }

        req.userId = decoded.id;
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
}
