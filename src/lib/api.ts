import { EventDetails, GenerationResponse, DocumentOutput } from './types';
import { extractEventDetails, generateDocument } from './gemini';

const TITLES: Record<string, string> = {
  proposal: 'Event Proposal',
  flyer: 'Event Flyer',
  checklist: 'Planning Checklist',
  budget: 'Budget Breakdown',
  timeline: 'Event Schedule',
  marketing: 'Marketing Plan',
  report: 'Post-Event Report',
  analytics: 'Event Analytics',
  summary: 'Event Summary',
  attendance: 'Attendance Sheet',
};

export const api = {
  async extractEvent(rawDescription: string): Promise<EventDetails> {
    return extractEventDetails(rawDescription);
  },

  async generateAll(event: EventDetails, documentTypes: string[]): Promise<GenerationResponse> {
    const start = Date.now();
    const promises = documentTypes.map(async (type) => {
      const content = await generateDocument(event, type);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title: TITLES[type] || type, content }),
      });
      if (!res.ok) throw new Error(`Failed to store ${type}`);
      return res.json();
    });

    const documents = await Promise.all(promises);
    
    return {
      success: true,
      event_summary: event,
      documents,
      generation_time: (Date.now() - start) / 1000,
    };
  },

  async generateSingle(event: EventDetails, type: string): Promise<DocumentOutput> {
    const content = await generateDocument(event, type);
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title: TITLES[type] || type, content }),
    });
    if (!res.ok) throw new Error(`Failed to store ${type}`);
    return res.json();
  },

  getExportUrl(type: 'docx' | 'pdf' | 'csv', id: string): string {
    return `/api/export/${type}/${id}`;
  }
};
