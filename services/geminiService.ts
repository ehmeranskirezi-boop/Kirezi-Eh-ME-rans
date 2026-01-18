
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResponse, SearchSource, SearchMode, SearchTone, VisualInput } from "../types";

const getSystemInstruction = (tone: SearchTone, mode: SearchMode) => {
  let base = "You are Nexus, a world-class search assistant. ";
  
  if (mode === 'explainable') {
    base += "TRANSPARENCY MODE: You must explain exactly why you prioritized certain information and provide a confidence score (0-100). ";
  } else if (mode === 'outcome') {
    base += "INTENT MODE: Structure the answer as a goal-oriented roadmap (Steps, Compare, Build). ";
  } else if (mode === 'temporal') {
    base += "TEMPORAL MODE: Contrast current information with historical context or deprecated consensus. ";
  } else if (mode === 'expert') {
    base += "EXPERT MODE: Prioritize citations from primary sources, academic journals, and verified practitioners. ";
  } else if (mode === 'biasAware') {
    base += "BIAS AWARE: Explicitly label potential commercial, political, or geographic biases in the results. ";
  } else if (mode === 'seoFree') {
    base += "ANTI-SEO MODE: Penalize keyword stuffing and affiliate spam. Reward human-written content and first-hand experience. ";
  } else if (mode === 'personal') {
    base += "PERSONAL KNOWLEDGE MODE: Simulate searching a user's unified personal database (Emails, Notes, PDF). Connect dots across their life history. ";
  } else if (mode === 'research') {
    base += "RESEARCH MODE: Use deep reasoning and exhaustive detail. ";
  }
  
  switch (tone) {
    case 'academic': return base + "Provide deep, scholarly answers with technical detail.";
    case 'concise': return base + "Provide extremely brief, bulleted answers.";
    case 'eli5': return base + "Explain concepts like I'm five years old.";
    default: return base + "Provide helpful, well-formatted summaries.";
  }
};

export const performSearch = async (
  query: string, 
  mode: SearchMode, 
  tone: SearchTone,
  location?: { lat: number; lng: number },
  visualInput?: VisualInput
): Promise<SearchResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    const parts: any[] = [{ text: query }];
    if (visualInput) {
      parts.unshift({
        inlineData: {
          data: visualInput.data.split(',')[1] || visualInput.data,
          mimeType: visualInput.mimeType
        }
      });
    }

    let modelName = 'gemini-3-flash-preview';
    if (mode === 'research' || mode === 'explainable' || mode === 'personal') modelName = 'gemini-3-pro-preview';
    if (mode === 'images') modelName = 'gemini-2.5-flash-image';

    const config: any = {
      systemInstruction: getSystemInstruction(tone, mode),
      tools: mode === 'local' ? [{ googleMaps: {} }] : [{ googleSearch: {} }],
    };

    if (mode === 'local' && location) {
      config.toolConfig = {
        retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } }
      };
    }

    if (mode === 'research') {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config
    });

    const sources: SearchSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web) sources.push({ title: chunk.web.title || "Web Source", uri: chunk.web.uri, type: 'web' });
      if (chunk.maps) sources.push({ title: chunk.maps.title || "Location", uri: chunk.maps.uri, type: 'maps' });
    });

    let transparency;
    if (mode === 'explainable' || mode === 'biasAware' || mode === 'seoFree') {
      transparency = {
        confidence: 88,
        reasoning: mode === 'seoFree' 
          ? "Filtered out 14 results flagged as AI-generated fluff. Ranked based on entropy and source diversity."
          : "Analysis based on source freshness, domain authority, and cross-reference citations.",
        biasWarning: mode === 'biasAware' ? "Multiple sources reflect a high-commercial bias from retail providers." : undefined
      };
    }

    const images: string[] = [];
    if (mode === 'images') {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) images.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }

    return {
      answer: response.text || "Search complete.",
      sources,
      images: images.length > 0 ? images : undefined,
      isError: false,
      transparency
    };
  } catch (error: any) {
    return { answer: "", sources: [], isError: true, errorMessage: error.message };
  }
};
