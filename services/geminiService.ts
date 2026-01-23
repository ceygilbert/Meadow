
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateProductDescription = async (productName: string, category: string, brand: string, specs?: string) => {
  try {
    const ai = getAI();
    const prompt = `Write a compelling, professional e-commerce product description for an IT store. 
    Product: ${productName}
    Brand: ${brand}
    Category: ${category}
    ${specs ? `Specifications: ${specs}` : ''}
    The tone should be tech-savvy but accessible. Highlight performance and value. Keep it under 150 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Failed to generate description. Please write manually.";
  }
};
