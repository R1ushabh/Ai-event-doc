export interface EventDetails {
  event_name: string;
  event_type: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  organizer: string | null;
  department: string | null;
  speaker: string | null;
  theme: string | null;
  target_audience: string | null;
  expected_participants: number | null;
  activities: string | null;
  event_mode: string;
  budget_preference?: 'low' | 'medium' | 'high';
}

export type DocType = 'proposal' | 'flyer' | 'budget' | 'timeline' | 'report' | 'attendance' | 'summary' | 'analytics';

export type AgentStatus = 'idle' | 'processing' | 'done' | 'error';

export interface BudgetCategory {
  name: string;
  amount: number;
  items: string;
}

export interface BudgetJSON {
  total: number;
  per_participant: number;
  categories: BudgetCategory[];
}

export interface DocumentOutput {
  type: DocType;
  title: string;
  content: string;
  budgetData?: BudgetJSON;
}

export interface AgentState {
  name: string;
  docs: DocType[];
  status: AgentStatus;
}

export interface AppState {
  eventDetails: EventDetails | null;
  selectedDocs: DocType[];
  isExtracting: boolean;
  isGenerating: boolean;
  outputs: Partial<Record<DocType, DocumentOutput>>;
  agents: AgentState[];
}
