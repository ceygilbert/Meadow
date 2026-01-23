
import { GoogleGenAI } from "@google/genai";

// Use the recommended model for Basic Text Tasks
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Generates a professional product description using Gemini AI.
 */
export const generateProductDescription = async (productName: string, category: string, brand: string, specs?: string) => {
  try {
    // Always initialize GoogleGenAI strictly following the guideline:
    // const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Write a compelling, professional e-commerce product description for an IT store. 
    Product: ${productName}
    Brand: ${brand}
    Category: ${category}
    ${specs ? `Specifications: ${specs}` : ''}
    The tone should be tech-savvy but accessible. Highlight performance and value. Keep it under 150 words.`;

    // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    // The simplest and most direct way to get the generated text content is by accessing the .text property.
    return response.text || "Failed to generate description. Please write manually.";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Failed to generate description. Please write manually.";
  }
};
