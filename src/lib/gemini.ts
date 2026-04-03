import { GoogleGenAI } from "@google/genai";
import { EventDetails, DocType } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const masterPlannerAgent = async (input: string): Promise<EventDetails> => {
  const model = "gemini-2.5-flash";
  const prompt = `Extract all event details from this description and return ONLY a JSON object with fields: event_name, event_type, date, time, venue, organizer, department, speaker, theme, target_audience, expected_participants (number), activities, event_mode. Use null for missing fields. Description: ${input}`;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      systemInstruction: "Extract event details. Return ONLY valid JSON, no markdown, no explanation."
    }
  });

  try {
    const cleanContent = (result.text || "{}").replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanContent) as EventDetails;
  } catch (error) {
    console.error("Failed to parse Master Planner output:", error);
    throw new Error("Invalid response from Master Planner Agent");
  }
};

export const subAgentCall = async (
  type: DocType,
  details: EventDetails
): Promise<string> => {
  const model = "gemini-2.5-flash";
  let prompt = "";

  const context = `Context: Event Name: ${details.event_name}, Type: ${details.event_type}, Date: ${details.date}, Time: ${details.time}, Venue: ${details.venue}, Organizer: ${details.organizer}, Department: ${details.department}, Speaker: ${details.speaker}, Theme: ${details.theme}, Target Audience: ${details.target_audience}, Expected Participants: ${details.expected_participants}, Activities: ${details.activities}, Mode: ${details.event_mode}, Budget Preference: ${details.budget_preference || 'medium'}.`;

  switch (type) {
    case 'proposal':
      prompt = `${context}\nGenerate an Event Proposal (600-800 words, formal). Sections: Title Info, Background, Objectives (5 points), Target Audience, Event Details, Program Highlights, Requirements, Expected Outcomes, Conclusion. Tone: formal, for head of department submission. Return as Markdown.`;
      break;
    case 'flyer':
      prompt = `${context}\nGenerate Flyer Content. Include: Event Title (under 8 words), Tagline (under 12 words), Description (2-3 sentences), Key Details block, Speakers, Who Should Attend, Call To Action, Organized By. Return as Markdown.`;
      break;
    case 'budget':
      prompt = `${context}\nGenerate a Budget (return ONLY JSON). Format: { "total": number, "per_participant": number, "categories": [{"name": string, "amount": number, "items": string}] }. Categories: Venue & Logistics, Printing & Publicity, Refreshments, Technical Setup, Hospitality, Stationery, Photography, Contingency (10%). Use realistic Indian institutional costs scaled to participant count and budget preference.`;
      break;
    case 'timeline':
      prompt = `${context}\nGenerate an Activity Timeline. Table format: Time | Activity | Duration | Responsible | Notes. Include: Registration, Inaugural, Main Sessions, Breaks, Closing, Certificates, Vote of Thanks. Return as Markdown.`;
      break;
    case 'report':
      prompt = `${context}\nGenerate an Event Report (800-1000 words, third-person formal). Sections: Header, Executive Summary, Objectives, Proceedings (session-by-session), Speakers, Participation, Highlights, Outcomes, Feedback, Challenges, Photo placeholder, Conclusion, Acknowledgements. Return as Markdown.`;
      break;
    case 'attendance':
      prompt = `${context}\nGenerate an Attendance Sheet. 30-row table. Header: Event Name, Date, Venue, Organizer. Columns: S.No | Name | Roll No/ID | Department/Year | Contact | Email | Signature. Footer: Total Present, Coordinator Signature. Return as Markdown.`;
      break;
    case 'summary':
      prompt = `${context}\nGenerate a Summary with 4 versions: 1. One-para (100 words), 2. Social media post (80 words + hashtags), 3. Newsletter entry (150 words formal), 4. Internal memo (1 sentence). Return as Markdown.`;
      break;
    case 'analytics':
      prompt = `${context}\nGenerate Analytics. Include: 1. Engagement Analysis (predicted attendance rate, engagement level + reasoning), 2. Impact Assessment (educational value, skill outcomes, networking value), 3. Effectiveness Scores — 5 dimensions rated 1-10 with explanation: Audience Relevance, Content Quality, Logistical Readiness, Speaker Caliber, Outcome Clarity, 4. Recommendations: 3 improvements, 2 risks, follow-up actions. Return as Markdown.`;
      break;
  }

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: type === 'budget' ? "application/json" : "text/plain"
    }
  });

  return result.text || "";
};
