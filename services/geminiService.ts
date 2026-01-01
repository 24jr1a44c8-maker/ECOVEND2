
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { RecyclableItem } from "../types";

export const identifyRecyclable = async (base64Image: string): Promise<RecyclableItem | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            material: { type: Type.STRING },
            reward: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["name", "material", "reward", "confidence", "description"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as RecyclableItem;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateProductImage = async (productName: string, description: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Professional studio product photography of ${productName}. ${description}. 250ml small PET bottle, chilled with water droplets, clean white background, high resolution, 8k, sharp focus.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64 = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64}`;
    }
    return null;
  } catch (error: any) {
    console.error("Imagen Error Detail:", error);
    const errorMsg = typeof error === 'string' ? error : (error.message || "");
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return 'QUOTA_EXHAUSTED';
    }
    return null;
  }
};
