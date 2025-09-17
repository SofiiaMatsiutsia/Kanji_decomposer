
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function translateWord(word: string): Promise<string> {
  try {
    const prompt = `Translate the following Japanese word to English. Provide only the most common, concise translation(s), separated by a comma if multiple are common. Do not add any extra explanation or phrases like "The translation is:". Word: "${word}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error translating with Gemini:", error);
    throw new Error("Failed to get translation from Gemini API.");
  }
}
