import { GoogleGenAI, Type } from "@google/genai";
import { EventInput, EventPlan } from "../types";

export class EventUnderstandingAgent {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async run(input: EventInput): Promise<EventPlan> {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are an Event Understanding Agent. Your job is to extract structured event details from raw user input.
      
      User Input: "${input.prompt}"
      Requested Theme: "${input.theme}"
      
      Extract the following fields. If not provided, infer them based on the context or use sensible defaults.
      Make sure to heavily incorporate the requested theme into the inferred context and objectives.
      - eventName
      - eventType (e.g., Workshop, Seminar, Hackathon, Webinar, Cultural Event, Conference)
      - objectives (list)
      - targetAudience
      - date
      - time
      - venue
      - expectedParticipants (number)
      - theme
      - keyActivities (list)
      - budgetEstimate (number)
      - inferredContext (tone, requirements, riskFactors)
      
      Return ONLY a valid JSON object.
    `;

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eventName: { type: Type.STRING },
            eventType: { type: Type.STRING },
            objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetAudience: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            venue: { type: Type.STRING },
            expectedParticipants: { type: Type.NUMBER },
            theme: { type: Type.STRING },
            keyActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
            budgetEstimate: { type: Type.NUMBER },
            inferredContext: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (error) {
      console.error("EventUnderstandingAgent failed to parse JSON:", error, response.text);
      throw new Error("Failed to parse event details from AI output.");
    }
  }
}
