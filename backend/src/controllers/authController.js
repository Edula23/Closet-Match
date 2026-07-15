import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js"; 

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export async function googleLogin(req, res) {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: "Missing code" });

  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      } else {
        user = await prisma.user.create({
          data: { email, name, googleId },
        });

        // await seedStarterWardrobe(user.id);
      }
    }

    const token = jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true }); // only once now
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
}