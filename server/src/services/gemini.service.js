import { env } from "../config/env.js";

export const generateForecastAnalysis = async (data) => {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing from server environment.");
    return null;
  }

  const prompt = `You are an expert AI Operational Intelligence Engine for a Pharmaceutical Manufacturing Command Center.

Analyze the live operational telemetry data for this pharmaceutical SKU:
- Product Name: ${data.productName}
- Category: ${data.category || "General"}
- Current Stock: ${data.currentStock} units
- Reorder Level Threshold: ${data.reorderLevel} units
- Pending Orders: ${data.pendingOrders}
- Delivered Orders (Historical Demand): ${data.deliveredOrders}
- Total Orders: ${data.totalOrders}
- Active Production Batches: ${data.activeBatches}
- Quality Complaints Reported: ${data.complaintCount}

Task:
Perform real-time AI predictive demand analytics for this SKU.

Respond strictly with a JSON object matching this schema (do NOT include markdown code blocks or backticks):
{
  "predictedDemand": <number - predicted demand units for upcoming cycle>,
  "confidence": <number - integer between 65 and 98 representing confidence percentage>,
  "riskLevel": <"LOW" | "MEDIUM" | "HIGH">,
  "recommendation": <"string - 1 to 2 sentence strategic operational action">,
  "explanation": <"string - technical breakdown of key demand, stock, and risk factors">
}`;

  const modelsToTry = [
    "gemini-flash-lite-latest",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const jsonResult = await response.json();
      const rawText =
        jsonResult.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const cleanedText = rawText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleanedText);

        console.log(`✨ [Real AI Prediction] Successfully generated using model: ${model} for ${data.productName}`);

        return {
          predictedDemand: Number(parsed.predictedDemand) || Math.max(data.deliveredOrders + data.pendingOrders, 100),
          confidence: Number(parsed.confidence) || 85,
          riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(String(parsed.riskLevel).toUpperCase())
            ? String(parsed.riskLevel).toUpperCase()
            : "MEDIUM",
          recommendation: String(parsed.recommendation || "").trim(),
          explanation: String(parsed.explanation || "").trim(),
          usedModel: `Gemini (${model})`,
        };
      } else if (jsonResult.error) {
        console.warn(`Model ${model} returned error: ${jsonResult.error.message}`);
      }
    } catch (err) {
      console.warn(`Model ${model} request error:`, err.message);
    }
  }

  return null;
};
