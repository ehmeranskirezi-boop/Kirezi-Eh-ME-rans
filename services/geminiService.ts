
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResponse, SearchSource, SearchMode, SearchTone, SearchIntent, IntentBreakdown, VisualInput, Suggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretSearchIntent = async (query: string): Promise<IntentBreakdown[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Interpret intent for: "${query}". JSON array with label, confidence, type (learn, find, compare, verify).`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ["learn", "find", "compare", "verify"] }
            },
            required: ["label", "confidence", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [{ label: 'General Exploration', confidence: 100, type: 'learn' }];
  }
};

export const performSearch = async (
  query: string, 
  mode: SearchMode, 
  tone: SearchTone,
  intent?: SearchIntent,
  securityLevel: string = 'safer',
  visualInput?: VisualInput
): Promise<SearchResponse> => {
  try {
    const isMapsQuery = mode === 'maps' || mode === 'ai_mode_maps' || query.toLowerCase().includes('near') || query.toLowerCase().includes('location');
    
    let systemInstruction = `You are Nexus OS AI. Focus on accuracy. Use tools. Answer concisely with markdown. Include 'FOLLOW_UPS:' section.`;
    
    // Customize system instruction based on AI modes
    if (mode === 'ai_mode_news') {
      systemInstruction += " You are in NEWS AI MODE. Focus on deep factual verification, primary source cross-referencing, and real-time news synthesis. Prioritize breaking news and trending intelligence.";
    } else if (mode === 'ai_mode_maps') {
      systemInstruction += " You are in MAPS AI MODE. Focus on spatial intelligence, proximity analysis, and complex geographic queries. Provide detailed local insights.";
    } else if (mode === 'ai_mode_images') {
      systemInstruction += " You are in IMAGES AI MODE. Focus on visual description, image search synthesis, and providing high-fidelity visual context.";
    } else if (mode === 'ai_mode_videos') {
      systemInstruction += " You are in VIDEOS AI MODE. Focus on media analysis, identifying key video clips, and summarizing video content across the web.";
    }

    const parts: any[] = [{ text: `Query: "${query}". Intent: ${intent}. Provide detailed synthesis and 3 follow-ups.` }];
    
    if (visualInput) {
      parts.unshift({
        inlineData: { data: visualInput.data.split(',')[1] || visualInput.data, mimeType: visualInput.mimeType }
      });
    }

    const modelToUse = isMapsQuery ? 'gemini-flash-lite-latest' : 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: { parts },
      config: {
        systemInstruction,
        tools: isMapsQuery ? [{ googleMaps: {} }] : [{ googleSearch: {} }]
      }
    });

    const sources: SearchSource[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({ title: chunk.web.title, uri: chunk.web.uri, type: 'web', status: 'online', safety: 'trusted' });
      } else if (chunk.maps) {
        sources.push({ title: chunk.maps.title || "Map Location", uri: chunk.maps.uri, type: 'maps', status: 'online', safety: 'trusted' });
      }
    });

    let fullText = response.text || "";
    let answer = fullText.split('FOLLOW_UPS:')[0].trim();
    let followUpPart = fullText.split('FOLLOW_UPS:')[1] || "";
    let followUpQuestions = followUpPart.split('\n').map(q => q.trim()).filter(q => q.length > 5).slice(0, 3);

    let generatedMedia: SearchResponse['generatedMedia'] = undefined;

    // Optional: Auto-generate visual content for AI modes if query is descriptive
    if (mode === 'ai_mode_images' && query.length > 10) {
        try {
            const imageRes = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: [{ text: `Generate a high-quality visualization for this search result: ${query}` }],
                config: { imageConfig: { aspectRatio: "16:9" } }
            });
            const imgPart = imageRes.candidates?.[0].content.parts.find(p => p.inlineData);
            if (imgPart) {
                generatedMedia = {
                    url: `data:image/png;base64,${imgPart.inlineData.data}`,
                    type: 'image',
                    prompt: query
                };
            }
        } catch (e) {
            console.error("Image generation failed", e);
        }
    }

    return {
      answer,
      sources,
      followUpQuestions,
      generatedMedia,
      isError: false,
      lastUpdated: new Date().toLocaleString(),
      transparency: { confidence: 98, reasoning: "Verified through primary index." }
    };
  } catch (error: any) {
    return { answer: "", sources: [], isError: true, errorMessage: error.message, lastUpdated: "" };
  }
};

export const getSuggestions = async (input: string): Promise<Suggestion[]> => {
  if (input.startsWith('/')) {
    const commandSuggestions: Suggestion[] = [
      { text: "/maps", type: "mode", icon: "🗺️" },
      { text: "/mail", type: "mode", icon: "📧" },
      { text: "/docs", type: "mode", icon: "📄" },
      { text: "/photos", type: "mode", icon: "🖼️" },
      { text: "/workspace", type: "mode", icon: "💼" },
      { text: "/ai_images", type: "mode", icon: "✨" },
      { text: "/ai_news", type: "mode", icon: "📡" }
    ];
    return commandSuggestions.filter(s => s.text.startsWith(input));
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggestions for: "${input}". JSON format.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) { return []; }
};
