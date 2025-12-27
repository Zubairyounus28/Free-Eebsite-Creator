
import { GoogleGenAI, Type } from "@google/genai";

// Use a new instance for each call with the environment API key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIResponse {
  headline: string;
  aboutText: string;
  productDescriptions: string[];
  businessName?: string;
  sourceUrls?: string[];
}

export async function enhanceWebsiteContent(
  businessDescription: string,
  businessName: string
): Promise<AIResponse> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate professional website copy for a business named "${businessName}". 
               Description: ${businessDescription}. 
               Return a punchy headline, a 2-paragraph "About Us" section, and 3 hypothetical product descriptions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          aboutText: { type: Type.STRING },
          productDescriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["headline", "aboutText", "productDescriptions"]
      }
    }
  });

  // Access text property directly as a getter
  return JSON.parse(response.text || '{}');
}

export async function analyzeMockup(base64Image: string): Promise<AIResponse> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    // Use the parts-based content structure for multimodal input
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg",
          },
        },
        {
          text: "Analyze this website mockup or business-related image. Extract or generate a suitable business name, a hero headline, a professional 'About Us' description, and a list of at least 3 products or services mentioned or suggested by the image. Return the result in JSON format.",
        },
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          headline: { type: Type.STRING },
          aboutText: { type: Type.STRING },
          productDescriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["businessName", "headline", "aboutText", "productDescriptions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeWebsiteUrl(url: string): Promise<AIResponse> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Upgrade to Pro for complex tasks involving tools
    model: "gemini-3-pro-preview",
    contents: `Analyze this business website URL: ${url}. Using your search capabilities, find information about the site and extract:
               1. The official Business Name
               2. A professional hero headline
               3. A compelling "About Us" story (2 paragraphs)
               4. A list of 3-5 main products or services offered.
               Return the result in strictly valid JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          headline: { type: Type.STRING },
          aboutText: { type: Type.STRING },
          productDescriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["businessName", "headline", "aboutText", "productDescriptions"]
      }
    }
  });

  // Extract URLs from grounding metadata as required for Search Grounding
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sourceUrls = groundingChunks
    ?.map((chunk: any) => chunk.web?.uri)
    .filter(Boolean) || [];

  const result = JSON.parse(response.text || '{}');
  return { ...result, sourceUrls };
}

export async function improveCopy(text: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Improve the following website copy to be more professional and persuasive: "${text}"`,
  });

  return response.text || text;
}
