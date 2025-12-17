import { GoogleGenAI } from "@google/genai";
import { FuelLog } from "../types";

export const analyzeDrivingHabits = async (logs: FuelLog[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Please check your environment setup.";
  }

  if (logs.length < 2) {
    return "Not enough data to perform AI analysis. Please add at least 2 fuel logs.";
  }

  // Prepare a lightweight summary to send to the model to save tokens
  const dataSummary = logs.slice(0, 10).map(l => ({
    date: l.date,
    brand: l.fuelBrand,
    dist: l.distance,
    kmL: l.kmPerLiter,
    cost: l.amountRM
  }));

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      As a senior automotive engineer, analyze these recent fuel logs for a driver.
      Data (Newest first): ${JSON.stringify(dataSummary)}
      
      Provide a concise, 3-bullet point summary focusing on:
      1. Fuel efficiency trend (improving or worsening?).
      2. Cost efficiency analysis.
      3. One actionable tip to improve their specific KM/L stats.
      
      Keep the tone professional yet sporty/encouraging. 
      Output as Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to contact AI services at the moment.";
  }
};