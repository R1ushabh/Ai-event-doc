import { GoogleGenAI, Type } from "@google/genai";
import { EventPlan, ConsistencyReport, DocType } from "../types";

export class ReviewConsistencyAgent {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async run(plan: EventPlan, docs: Array<{ type: DocType, content: string }>): Promise<{ docs: Array<{ type: DocType, content: string }>, report: ConsistencyReport }> {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a Review & Consistency Agent. Your job is to check all generated documents for consistency with the event plan.
      
      Event Plan: ${JSON.stringify(plan)}
      Generated Documents (Markdown): ${JSON.stringify(docs)}
      
      Check for:
      - Dates match across all documents
      - Venue matches everywhere
      - Organizer matches everywhere
      - Budget references are aligned
      - Timeline matches flyer/event details
      
      If you find minor inconsistencies, fix them in the document content.
      
      Return ONLY a valid JSON object with:
      - updatedDocs (array of { type, content } where content is the fixed Markdown string)
      - report (ConsistencyReport object)
    `;

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            updatedDocs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            },
            report: {
              type: Type.OBJECT,
              properties: {
                isConsistent: { type: Type.BOOLEAN },
                mismatches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      field: { type: Type.STRING },
                      issue: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                      autoFixed: { type: Type.BOOLEAN }
                    }
                  }
                },
                summary: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    try {
      const result = JSON.parse(response.text);
      return { docs: result.updatedDocs || docs, report: result.report || { isConsistent: true, mismatches: [], summary: "Consistency check failed to parse" } };
    } catch (error) {
      console.error("ReviewConsistencyAgent failed to parse JSON:", error, response.text);
      // Fallback: return original docs and a basic report
      return { 
        docs, 
        report: { 
          isConsistent: false, 
          mismatches: [], 
          summary: "Consistency check output was malformed or truncated. Documents may still be consistent." 
        } 
      };
    }
  }
}
