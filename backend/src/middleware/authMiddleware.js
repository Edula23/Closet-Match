import jwt from 'jsonwebtoken'

 export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" "); 
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.user = decoded;
        next();
    }   catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }   
}
