import { masterPlannerAgent, subAgentCall } from "./gemini";
import { EventDetails, DocType, DocumentOutput, BudgetJSON } from "./types";

export const extractEventDetails = async (input: string): Promise<EventDetails> => {
  return await masterPlannerAgent(input);
};

export const generateDocument = async (
  type: DocType,
  details: EventDetails
): Promise<DocumentOutput> => {
  const content = await subAgentCall(type, details);
  
  const output: DocumentOutput = {
    type,
    title: getDocTitle(type),
    content,
  };

  if (type === 'budget') {
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      output.budgetData = JSON.parse(cleanContent) as BudgetJSON;
    } catch (e) {
      console.error("Failed to parse budget JSON:", e);
    }
  }

  return output;
};

const getDocTitle = (type: DocType): string => {
  switch (type) {
    case 'proposal': return "Event Proposal";
    case 'flyer': return "Flyer Content";
    case 'budget': return "Budget Estimate";
    case 'timeline': return "Activity Timeline";
    case 'report': return "Event Report";
    case 'attendance': return "Attendance Sheet";
    case 'summary': return "Quick Summary";
    case 'analytics': return "Analytics";
    default: return "Document";
  }
};
