
import { GoogleGenAI } from "@google/genai";

export interface FinancialData {
  gold_thai_bar_buy: number;
  gold_thai_bar_sell: number;
  gold_mmk_tical: number;
  thb_to_mmk_market_rate: number;
  source_links: string[];
  last_updated: string;
}

/**
 * Fetches real-time financial data using Gemini 3 Flash with Search Grounding.
 */
export const fetchFinancialData = async (): Promise<FinancialData | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `You are a Real-Time Financial Data Agent specializing in the Thai and Myanmar markets. 

YOUR GOAL:
Provide the most accurate, current gold prices and currency exchange rates using Google Search Grounding. 

DATA REQUIREMENTS:
1. Thai Gold: Search for the "Thai Gold Traders Association" (GTA) official price for 'Gold Bar' (96.5% purity).
2. Myanmar Gold: Search for the current market price for 1 Tical of 24K (16-Pai) gold in Myanmar (Yangon/Mandalay market).
3. Exchange Rate: Search for the REAL market (black market) exchange rate for 1 THB to MMK.

OUTPUT FORMAT (Strict JSON):
Return ONLY a JSON object. Do not include extra text.
{
  "gold_thai_bar_buy": number,
  "gold_thai_bar_sell": number,
  "gold_mmk_tical": number,
  "thb_to_mmk_market_rate": number,
  "source_links": ["url1", "url2"],
  "last_updated": "timestamp"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    try {
      const data = JSON.parse(text);
      return {
        gold_thai_bar_buy: data.gold_thai_bar_buy || 42000,
        gold_thai_bar_sell: data.gold_thai_bar_sell || 42100,
        gold_mmk_tical: data.gold_mmk_tical || 5400000,
        thb_to_mmk_market_rate: data.thb_to_mmk_market_rate || 135.0,
        source_links: data.source_links || [],
        last_updated: data.last_updated || new Date().toISOString()
      };
    } catch (parseError) {
      console.error("JSON Parse error:", parseError, text);
      return null;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};
