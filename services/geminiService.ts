
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export async function generateGCPSolution(challenge: string) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `You are a Senior Google Cloud Solution Architect. 
  A client has presented the following challenge: "${challenge}"
  
  Propose a comprehensive Google Cloud architecture. Provide the response in valid JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the solution." },
          summary: { type: Type.STRING, description: "Executive summary of the approach." },
          services: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of core GCP services used." 
          },
          architecture: { type: Type.STRING, description: "Textual description of data flow and architecture." },
          bestPractices: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Security, cost, and reliability best practices." 
          }
        },
        required: ["title", "summary", "services", "architecture", "bestPractices"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON", e);
    throw new Error("Failed to generate a structured solution. Please try again.");
  }
}
