
import { GoogleGenAI } from "@google/genai";
import { StockMovement, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInventoryInsights(movements: StockMovement[], products: Product[]) {
  try {
    const prompt = `
      You are an AI Supply Chain Director. Analyze this warehouse data for critical exceptions.
      
      Inventory Value & Stock:
      ${JSON.stringify(products.map(p => ({ 
        sku: p.sku, 
        name: p.name, 
        stock: p.currentStock, 
        min: p.minStockLevel,
        category: p.abcCategory,
        valuation: p.currentStock * p.unitCost
      })))}
      
      Recent Throughput:
      ${JSON.stringify(movements.slice(0, 20).map(m => ({ 
        type: m.type, 
        qty: m.quantity, 
        date: m.createdAt,
        user: m.createdBy
      })))}
      
      Tasks:
      1. PREDICT: Estimated stockout dates for high-velocity items.
      2. ANOMALY: Detect unusual stock adjustments or high-volume outliers.
      3. VALUATION: Summarize high-value capital exposure in Category A.
      
      Output professionally. Use symbols (🔴, 🟡, 🟢) for risk levels.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Director Error:", error);
    return "AI Director temporarily offline. Review valuation and ROP manually.";
  }
}
