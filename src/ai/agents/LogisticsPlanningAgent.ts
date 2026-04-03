import { GoogleGenAI } from "@google/genai";
import { EventPlan, DocType } from "../types";
import { EventTemplate } from "../eventTypeTemplates";

export class LogisticsPlanningAgent {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async generate(docType: DocType, plan: EventPlan, template: EventTemplate): Promise<string> {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a Logistics Planning Agent. Your job is to generate a ${docType} for the following event.
      
      Event Details: ${JSON.stringify(plan)}
      Template: ${JSON.stringify(template)}
      
      CRITICAL INSTRUCTION: The user requested a specific theme: "${plan.theme}". 
      You MUST incorporate this theme into the vocabulary and structure of the document where appropriate.
      
      The timeline style should be: ${template.timelineStyle}
      Budget hints: ${template.budgetHints.join(", ")}
      
      Generate a structured ${docType} document.
      
      Return the document formatted in clean, professional Markdown. 
      Do NOT use JSON. Use markdown tables for budgets and timelines. Use headings and lists to make it look like a real document.
    `;

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return response.text || "";
  }
}
