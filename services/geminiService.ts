import { GoogleGenAI } from "@google/genai";
import { LotteryDraw } from "../types";

const API_KEY = process.env.API_KEY;

// Mock data fallback in case API key is missing or fails
const MOCK_LATEST_DRAW: LotteryDraw = {
  issue: "2024135",
  date: new Date().toLocaleDateString('zh-CN'),
  winningNumbers: [1, 3, 5, 8, 12, 15, 18, 22, 25, 33, 36, 41, 45, 48, 52, 58, 63, 66, 72, 78]
};

export const fetchLatestHappy8Result = async (): Promise<LotteryDraw> => {
  if (!API_KEY) {
    console.warn("No API Key found, using mock data.");
    return MOCK_LATEST_DRAW;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Using Google Search Grounding to get the real latest result
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find the latest China Welfare Lottery Happy 8 (快乐8) draw result. I need the Issue Number (期号) and the 20 winning numbers. Return only the JSON data.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    // Attempt to parse the JSON response. 
    // The model might return a JSON object with specific structure based on the prompt.
    // We expect something we can map to LotteryDraw.
    const data = JSON.parse(text);
    
    // Defensive mapping in case the structure varies slightly
    let result: LotteryDraw = {
        issue: data.issue || data.issueNumber || MOCK_LATEST_DRAW.issue,
        date: data.date || data.drawDate || MOCK_LATEST_DRAW.date,
        winningNumbers: Array.isArray(data.winningNumbers) 
            ? data.winningNumbers.map(Number) 
            : (Array.isArray(data.numbers) ? data.numbers.map(Number) : MOCK_LATEST_DRAW.winningNumbers)
    };
    
    // Basic validation
    if (result.winningNumbers.length < 10) {
        result.winningNumbers = MOCK_LATEST_DRAW.winningNumbers;
    }

    return result;

  } catch (error) {
    console.error("Failed to fetch lottery data via Gemini:", error);
    return MOCK_LATEST_DRAW;
  }
};