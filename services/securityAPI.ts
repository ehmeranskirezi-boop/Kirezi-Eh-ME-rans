
import { GoogleGenAI, Type } from "@google/genai";
import { SafetyReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Nexus Security API
 * Handles safe browsing analysis for individual resource points.
 */
export const analyzeLinkSafety = async (uri: string, title: string, snippet?: string): Promise<SafetyReport> => {
  try {
    const prompt = `Analyze the following web resource for potential issues:
    URL: ${uri}
    Title: ${title}
    Context: ${snippet || "No metadata available"}
    
    Return a detailed JSON report assessing if this link is safe, suspicious, or malicious.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Safety score from 0-100" },
            verdict: { type: Type.STRING, enum: ["safe", "suspicious", "malicious", "unknown"] },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            analysisTime: { type: Type.STRING }
          },
          required: ["score", "verdict", "threats", "recommendation"]
        }
      }
    });

    const report = JSON.parse(response.text || "{}");
    return {
      ...report,
      analysisTime: new Date().toLocaleTimeString()
    };
  } catch (error) {
    return {
      score: 50,
      verdict: 'unknown',
      threats: ["Security handshake failed"],
      recommendation: "Standard caution advised.",
      analysisTime: new Date().toLocaleTimeString()
    };
  }
};
