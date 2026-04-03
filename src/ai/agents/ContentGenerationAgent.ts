import { GoogleGenAI } from "@google/genai";
import { EventPlan, DocType } from "../types";
import { EventTemplate } from "../eventTypeTemplates";

export class ContentGenerationAgent {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async generate(docType: DocType, plan: EventPlan, template: EventTemplate): Promise<string> {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a Content Generation Agent. Your job is to generate a ${docType} for the following event.
      
      Event Details: ${JSON.stringify(plan)}
      Template: ${JSON.stringify(template)}
      
      CRITICAL INSTRUCTION: The user requested a specific theme: "${plan.theme}". 
      You MUST heavily incorporate this theme into the tone, vocabulary, structure, and presentation of the document.
      If it's a Pokemon theme, use Pokemon terms. If it's Cyberpunk, use futuristic terms, etc.
      
      The tone should be: ${docType === 'proposal' ? template.proposalTone : template.flyerTone}
      
      Generate a highly professional, beautifully formatted ${docType} document.
      
      Return the document formatted in clean, professional Markdown. 
      Do NOT use JSON. Use markdown headings, bold text, lists, and blockquotes to make it look like a real document.
      For flyers, use expressive language and perhaps relevant emojis if it fits the theme.
    `;

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return response.text || "";
  }
}
