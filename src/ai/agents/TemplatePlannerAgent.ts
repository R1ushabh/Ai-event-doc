import { GoogleGenAI, Type } from "@google/genai";
import { EventPlan } from "../types";
import { EVENT_TEMPLATES, EventTemplate } from "../eventTypeTemplates";

export class TemplatePlannerAgent {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async run(plan: EventPlan): Promise<{ plan: EventPlan, template: EventTemplate }> {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a Template Planner Agent. Your job is to classify the event type and recommend a template.
      
      Event Details: ${JSON.stringify(plan)}
      
      Available Templates: ${JSON.stringify(EVENT_TEMPLATES)}
      
      Classify the event type into one of the available templates. If it doesn't fit perfectly, pick the closest one.
      
      Return ONLY a valid JSON object with:
      - classifiedType (string)
      - recommendationReason (string)
    `;

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classifiedType: { type: Type.STRING },
            recommendationReason: { type: Type.STRING }
          }
        }
      }
    });

    try {
      const result = JSON.parse(response.text);
      const template = EVENT_TEMPLATES[result.classifiedType] || EVENT_TEMPLATES["Workshop"];
      
      // Update plan with classified type if needed
      plan.eventType = result.classifiedType;

      return { plan, template };
    } catch (error) {
      console.error("TemplatePlannerAgent failed to parse JSON:", error, response.text);
      // Fallback to a default template
      return { plan, template: EVENT_TEMPLATES["Workshop"] };
    }
  }
}
