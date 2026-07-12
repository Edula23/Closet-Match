// backend/src/services/aiMatch.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// No more fetch — just convert the Buffer already stored in the DB
function bufferToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

export async function getOutfitSuggestion(targetItem, closetItems) {
  const parts = [
    { text: `This is the target item (id: ${targetItem.id}).` },
    {
      inlineData: {
        mimeType: targetItem.mimeType || "image/jpeg",
        data: bufferToBase64(targetItem.image),
      },
    },
    { text: "Here are the other items in the user's closet:" },
  ];

  for (const item of closetItems) {
    parts.push({ text: `Item id: ${item.id}` });
    parts.push({
      inlineData: {
        mimeType: item.mimeType || "image/jpeg",
        data: bufferToBase64(item.image),
      },
    });
  }

  parts.push({
    text: `Based on color, style, and occasion, suggest the best 2-4 items from the closet to pair with the target item to form a complete outfit. Respond ONLY with valid JSON in this exact format, no other text. When writing the "reasoning" field, describe items by their visible traits (color, type, style) — never mention numeric IDs, database keys, or item indexes. IDs should only appear in the "suggested_item_ids" array.
{
  "suggested_item_ids": ["id1", "id2"],
  "reasoning": "short explanation of why these work together"
}`,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts }],
  });

  const jsonMatch = response.text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}