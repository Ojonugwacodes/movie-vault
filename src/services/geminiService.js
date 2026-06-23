import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function analyzePreferences(prompt) {
    try{
        const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    return JSON.parse(response.contents);
    } catch(error){
        console.error("Error analyzing preferences:", error);
        throw error;
    }
}

export { analyzePreferences };