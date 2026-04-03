export type DocType = 'proposal' | 'flyer' | 'budget' | 'timeline' | 'attendance' | 'summary';

export interface EventInput {
  prompt: string;
  theme: string;
  requestedDocs: DocType[];
}

export interface EventPlan {
  eventName: string;
  eventType: string;
  objectives: string[];
  targetAudience: string;
  date: string;
  time: string;
  venue: string;
  expectedParticipants: number;
  theme: string;
  keyActivities: string[];
  budgetEstimate: number;
  inferredContext: {
    tone: string;
    requirements: string[];
    riskFactors: string[];
  };
}

export interface ProposalDocument {
  title: string;
  executiveSummary: string;
  objectives: string[];
  targetAudience: string;
  programHighlights: string[];
  budgetOverview: string;
  sponsorshipValue: string;
  callToAction: string;
  contactInfo: string;
}

export interface FlyerDocument {
  headline: string;
  tagline: string;
  eventDetails: { date: string; time: string; venue: string; address: string };
  highlights: string[];
  registrationInfo: string;
  socialHandles?: string[];
  designNotes: string;
}

export interface BudgetDocument {
  totalEstimate: number;
  currency: string;
  contingencyPercent: number;
  categories: Array<{
    name: string;
    items: Array<{ description: string; quantity: number; unitCost: number; total: number }>;
    subtotal: number;
  }>;
  notes: string;
}

export interface TimelineDocument {
  eventDate: string;
  sessions: Array<{
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    owner: string;
    location?: string;
    type: 'setup' | 'session' | 'break' | 'networking' | 'ceremony' | 'closeout';
  }>;
}

export interface AttendanceDocument {
  title: string;
  eventDetails: string;
  columns: string[];
  rowCount: number;
  headerNote: string;
}

export type DocumentContent = 
  | { type: 'proposal'; data: ProposalDocument }
  | { type: 'flyer'; data: FlyerDocument }
  | { type: 'budget'; data: BudgetDocument }
  | { type: 'timeline'; data: TimelineDocument }
  | { type: 'attendance'; data: AttendanceDocument };

export interface ConsistencyReport {
  isConsistent: boolean;
  mismatches: Array<{
    field: string;
    issue: string;
    recommendation: string;
    autoFixed: boolean;
  }>;
  summary: string;
}

export interface DocumentOutput {
  id: string;
  type: DocType;
  content: string; // Markdown content
  status: 'draft' | 'final';
  version: number;
}
