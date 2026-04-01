import { z } from 'zod';

export const EventDetailsSchema = z.object({
  event_name: z.string(),
  event_type: z.string(),
  date: z.string().optional(),
  time: z.string().optional(),
  venue: z.string().optional(),
  organizer: z.string().optional(),
  department: z.string().optional(),
  speaker: z.string().optional(),
  theme: z.string().optional(),
  target_audience: z.string().optional(),
  expected_participants: z.number().optional(),
  activities: z.string().optional(),
  budget_preference: z.string().optional(),
  event_mode: z.string().default('offline'),
  raw_description: z.string().optional(),
});

export type EventDetails = z.infer<typeof EventDetailsSchema>;

export const GenerationRequestSchema = z.object({
  event: EventDetailsSchema,
  document_types: z.array(z.string()),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

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
