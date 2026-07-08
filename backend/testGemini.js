// backend/testGemini.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testImageCall() {
  // Use a local test image first — easier than fetching from Supabase Storage right now
  const imageBuffer = fs.readFileSync("../cute.jpg");
  const base64Image = imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: "Describe this clothing item in one sentence: color, type, and style." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        ],
      },
    ],
  });

  console.log("Gemini response:");
  console.log(response.text);
}

testImageCall().catch((err) => console.error("Error:", err));