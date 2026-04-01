export interface EventDetails {
  event_name: string;
  event_type: string;
  date?: string;
  time?: string;
  venue?: string;
  organizer?: string;
  department?: string;
  speaker?: string;
  theme?: string;
  target_audience?: string;
  expected_participants?: number;
  activities?: string;
  budget_preference?: string;
  event_mode?: string;
  raw_description?: string;
}

export interface DocumentOutput {
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface GenerationResponse {
  success: boolean;
  event_summary: Record<string, any>;
  documents: DocumentOutput[];
  generation_time: number;
}
