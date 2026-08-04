import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateForecastAnalysis = async (data) => {
  const prompt = `
You are an AI Pharmaceutical Operations Expert.

Analyze the following operational data.

Current Stock: ${data.currentStock}

Reorder Level: ${data.reorderLevel}

Pending Orders: ${data.pendingOrders}

Delivered Orders: ${data.deliveredOrders}

Complaints: ${data.complaintCount}

Active Production Batches: ${data.activeBatches}

Generate:

1. Risk Level
2. Confidence (%)
3. Recommendation
4. Explanation
5. Immediate Action

Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};
