// backend/testGeminiOutfit.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function loadImageAsBase64(path) {
  return fs.readFileSync(path).toString("base64");
}

async function testOutfitSuggestion() {
  // Simulate a "target item" and a "closet" of other items
  const targetItem = { id: "1", name: "blue shirt", path: "../cute.jpg" };
  const closetItems = [
    { id: "2", name: "jeans", path: "../jeans.jpg" },
    { id: "3", name: "pants", path: "../pants.jpg" },
    { id: "4", name: "jacket", path: "../jacket.jpg" },
  ];

  const parts = [
    { text: `This is the target item (id: ${targetItem.id}, name: ${targetItem.name}).` },
    { inlineData: { mimeType: "image/jpeg", data: loadImageAsBase64(targetItem.path) } },
    { text: "Here are the other items in the user's closet:" },
  ];

  for (const item of closetItems) {
    parts.push({ text: `Item id: ${item.id}, name: ${item.name}` });
    parts.push({ inlineData: { mimeType: "image/jpeg", data: loadImageAsBase64(item.path) } });
  }

  parts.push({
    text: `Based on color, style, and occasion, suggest the best 2-4 items from the closet to pair with the target item to form a complete outfit. Respond ONLY with valid JSON in this exact format, no other text:
{
  "suggested_item_ids": ["id1", "id2"],
  "reasoning": "short explanation of why these work together"
}`,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts }],
  });

  console.log("Raw response text:");
  console.log(response.text);

  console.log("\nParsed JSON:");
  const clean = response.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  console.log(parsed);
}

testOutfitSuggestion().catch((err) => console.error("Error:", err));