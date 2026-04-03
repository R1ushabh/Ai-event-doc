import { DocType } from "./types";

export interface EventTemplate {
  type: string;
  defaultStructure: string[];
  timelineStyle: string;
  budgetHints: string[];
  flyerTone: string;
  proposalTone: string;
  recommendedDocuments: DocType[];
}

export const EVENT_TEMPLATES: Record<string, EventTemplate> = {
  Workshop: {
    type: "Workshop",
    defaultStructure: ["Introduction", "Hands-on Session", "Q&A", "Networking"],
    timelineStyle: "Intensive, skill-focused",
    budgetHints: ["Equipment rental", "Materials", "Refreshments"],
    flyerTone: "Educational, practical",
    proposalTone: "Value-driven, skill-oriented",
    recommendedDocuments: ["proposal", "flyer", "timeline", "attendance"]
  },
  Seminar: {
    type: "Seminar",
    defaultStructure: ["Keynote", "Panel Discussion", "Q&A"],
    timelineStyle: "Structured, academic",
    budgetHints: ["Speaker fees", "Venue booking", "AV equipment"],
    flyerTone: "Professional, informative",
    proposalTone: "Formal, authoritative",
    recommendedDocuments: ["proposal", "flyer", "timeline", "attendance"]
  },
  Hackathon: {
    type: "Hackathon",
    defaultStructure: ["Check-in", "Opening", "Hacking", "Mentoring", "Demo", "Judging", "Awards"],
    timelineStyle: "Fast-paced, 24-48 hours",
    budgetHints: ["Prizes", "Food", "Swag", "Infra", "Cloud credits"],
    flyerTone: "Energetic, innovative",
    proposalTone: "Innovation-focused, talent-driven",
    recommendedDocuments: ["proposal", "flyer", "budget", "timeline", "attendance"]
  },
  Webinar: {
    type: "Webinar",
    defaultStructure: ["Introduction", "Presentation", "Live Demo", "Q&A"],
    timelineStyle: "Short, 60-90 minutes",
    budgetHints: ["Platform subscription", "Marketing", "Speaker honorarium"],
    flyerTone: "Digital-first, accessible",
    proposalTone: "Concise, reach-oriented",
    recommendedDocuments: ["proposal", "flyer", "timeline"]
  },
  "Cultural Event": {
    type: "Cultural Event",
    defaultStructure: ["Inauguration", "Performances", "Dinner", "Closing"],
    timelineStyle: "Celebratory, fluid",
    budgetHints: ["Decorations", "Catering", "Artist fees", "Sound system"],
    flyerTone: "Vibrant, artistic",
    proposalTone: "Community-focused, celebratory",
    recommendedDocuments: ["proposal", "flyer", "budget", "timeline", "attendance"]
  },
  Conference: {
    type: "Conference",
    defaultStructure: ["Registration", "Keynote", "Track Sessions", "Lunch", "Networking Dinner"],
    timelineStyle: "Multi-day, multi-track",
    budgetHints: ["Venue", "Catering", "Speaker travel", "Marketing", "Sponsorship"],
    flyerTone: "Grand, networking-focused",
    proposalTone: "Strategic, comprehensive",
    recommendedDocuments: ["proposal", "flyer", "budget", "timeline", "attendance"]
  }
};
