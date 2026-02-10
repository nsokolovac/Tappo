// Service for interacting with Google Gemini API using @google/genai
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client correctly with a named parameter
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a marketing description for a business based on its name and category.
 * @param name Business name
 * @param category Business category (e.g., Kafić, Restoran)
 * @returns A generated description string or undefined
 */
export async function generateDescription(name: string, category: string): Promise<string | undefined> {
  try {
    // Basic Text Tasks: 'gemini-3-flash-preview' is the appropriate model for this task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy, professional, and inviting marketing description (max 2 sentences) for a ${category} named "${name}" in Serbian language. Focus on the unique atmosphere and quality of service.`,
    });
    
    // Correctly extract the generated text using the .text property (not a method)
    const text = response.text;
    return text?.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return undefined;
  }
}
