import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { EventDetails } from "./types";

// The platform injects GEMINI_API_KEY into process.env at runtime.
const getApiKey = () => {
  return (process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY || "").trim();
};

const MODEL_NAME = "gemini-3-flash-preview";

export async function extractEventDetails(rawDescription: string): Promise<EventDetails> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your AI Studio Secrets.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = "You are an expert event planner. Extract structured event details from the provided text.";
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      event_name: { type: Type.STRING },
      date: { type: Type.STRING },
      time: { type: Type.STRING },
      venue: { type: Type.STRING },
      description: { type: Type.STRING },
      organizer: { type: Type.STRING },
      department: { type: Type.STRING },
      speaker: { type: Type.STRING },
      theme: { type: Type.STRING },
      target_audience: { type: Type.STRING },
      expected_participants: { type: Type.NUMBER },
      activities: { type: Type.STRING },
      budget_preference: { type: Type.STRING },
      event_mode: { type: Type.STRING },
    },
    required: ["event_name", "date", "venue", "description"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Extract event details from this description: "${rawDescription}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    if (!response.text) throw new Error("No response from Gemini");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key. Please check your AI Studio Secrets.");
    }
    throw new Error(error.message || "Failed to extract event details");
  }
}

const SCHEMAS: Record<string, any> = {
  budget: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            item: { type: Type.STRING },
            estimated_cost: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ["category", "item", "estimated_cost"],
        },
      },
      total_cost: { type: Type.NUMBER },
      cost_per_participant: { type: Type.NUMBER },
      cost_saving_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["items", "total_cost", "cost_per_participant"],
  },
  timeline: {
    type: Type.OBJECT,
    properties: {
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            activity: { type: Type.STRING },
            duration: { type: Type.STRING },
            responsible_person: { type: Type.STRING },
            location: { type: Type.STRING },
          },
          required: ["time", "activity", "duration"],
        },
      },
    },
    required: ["schedule"],
  },
  analytics: {
    type: Type.OBJECT,
    properties: {
      stats: {
        type: Type.OBJECT,
        properties: {
          estimated_reach: { type: Type.NUMBER },
          engagement_score: { type: Type.NUMBER },
          expected_attendance_rate: { type: Type.NUMBER },
          impact_score: { type: Type.NUMBER },
        },
      },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      charts: {
        type: Type.OBJECT,
        properties: {
          budget_distribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
            },
          },
          engagement_metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
    required: ["stats", "recommendations", "charts"],
  },
  summary: {
    type: Type.OBJECT,
    properties: {
      one_paragraph: { type: Type.STRING },
      newsletter: { type: Type.STRING },
      social_media: { type: Type.STRING },
      memo: { type: Type.STRING },
    },
    required: ["one_paragraph", "newsletter", "social_media", "memo"],
  },
};

const PROMPTS: Record<string, string> = {
  proposal: `Generate a high-end, professional Event Proposal. 
  Use a clear hierarchy with H1 for the title, H2 for sections, and H3 for sub-sections.
  Include:
  - Executive Summary (compelling overview)
  - Event Concept & Theme
  - Goals & Objectives (bullet points)
  - Target Audience Profile
  - Detailed Program/Agenda
  - Venue & Logistics Plan
  - Marketing & Promotion Strategy
  - Budget Summary (use a Markdown table)
  - Sponsorship Opportunities (if applicable)
  - Conclusion & Next Steps
  
  Make it look like a premium business document.`,

  flyer: `Create a high-energy, visually striking promotional flyer for this event.
  Use emojis to make it pop! 🚀
  Structure:
  - 🎨 **EYE-CATCHING TITLE** (Centered, Large)
  - 📅 **DATE & TIME** (Bold, clear)
  - 📍 **LOCATION** (With map emoji)
  - 🌟 **WHAT'S HAPPENING?** (Bullet points of key highlights)
  - 🎟️ **TICKET INFO** (How to join)
  - 📞 **CONTACT** (RSVP details)
  
  Make it feel like a real poster. Use horizontal rules (---) to separate sections.`,

  checklist: `Generate a comprehensive, multi-stage Event Planning Checklist.
  Organize by timeline:
  - 6 Months Before (Strategy & Venue)
  - 3-4 Months Before (Vendors & Marketing)
  - 1 Month Before (Final Logistics)
  - 1 Week Before (Confirmations)
  - Day Of (Execution)
  - Post-Event (Evaluation)
  
  Use task list syntax: - [ ] Task description.`,

  budget: `Generate a professional Event Budget Breakdown as JSON.
  Include detailed items with categories, costs, and notes.
  Calculate total cost and cost per participant based on expected participants.
  Provide cost-saving tips.`,

  timeline: `Generate a detailed, minute-by-minute Event Schedule as JSON.
  Include time, activity, duration, responsible person, and location for each item.`,

  marketing: `Generate a strategic Event Marketing & Communication Plan.
  Include:
  - Marketing Objectives
  - Brand Identity & Messaging
  - Social Media Calendar (Weekly breakdown)
  - Email Marketing Sequence (Save the date, Early bird, Last call)
  - Content Strategy (Blog posts, Videos, Graphics)
  - Paid Advertising Plan
  - Community Engagement & PR`,

  report: `Generate a comprehensive Post-Event Evaluation Report.
  Include:
  - Executive Summary
  - Key Performance Indicators (KPIs) vs Results
  - Attendance Analytics (Demographics, Turnout)
  - Feedback Summary (Survey results)
  - Financial Reconciliation (Budget vs Actual)
  - Successes & Challenges
  - Recommendations for Future Events`,
  
  analytics: `Generate a predictive Event Analytics & ROI Forecast as JSON.
  Include summary stats (reach, engagement, attendance rate, impact), recommendations, 
  and data for charts (budget distribution and engagement metrics).`,

  summary: `Generate a polished Event Summary in 4 formats as JSON:
  1. One-paragraph summary
  2. Newsletter summary
  3. Social media version
  4. Memo version`,

  attendance: `Confirm the event details for an Attendance Sheet. 
  The renderer will handle the table, just provide the header info (Event Name, Date, Venue, Organizer) as JSON.`,
};

export async function generateDocument(event: EventDetails, type: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your AI Studio Secrets.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const basePrompt = PROMPTS[type] || "Generate a professional document for this event.";
  
  const prompt = `${basePrompt}
  
Event Details:
${JSON.stringify(event, null, 2)}

Tone: Professional and formal.`;

  const config: any = {};
  if (SCHEMAS[type]) {
    config.responseMimeType = "application/json";
    config.responseSchema = SCHEMAS[type];
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config,
    });

    return response.text || "";
  } catch (error: any) {
    console.error(`Gemini Generation Error (${type}):`, error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key. Please check your AI Studio Secrets.");
    }
    throw new Error(error.message || `Failed to generate ${type}`);
  }
}
