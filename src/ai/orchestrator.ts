import { EventUnderstandingAgent } from "./agents/EventUnderstandingAgent";
import { TemplatePlannerAgent } from "./agents/TemplatePlannerAgent";
import { ContentGenerationAgent } from "./agents/ContentGenerationAgent";
import { LogisticsPlanningAgent } from "./agents/LogisticsPlanningAgent";
import { ReviewConsistencyAgent } from "./agents/ReviewConsistencyAgent";
import { EventInput, DocType, DocumentOutput, ConsistencyReport } from "./types";

export type OrchestratorEvent = 
  | { type: 'agent_start', agent: string }
  | { type: 'agent_done', agent: string, result: unknown }
  | { type: 'document_done', docType: DocType, content: unknown }
  | { type: 'consistency_report', report: ConsistencyReport }
  | { type: 'generation_complete', summary: { docCount: number, duration: number } };

export class Orchestrator {
  private onEvent: (event: OrchestratorEvent) => void;

  constructor(onEvent: (event: OrchestratorEvent) => void) {
    this.onEvent = onEvent;
  }

  async run(input: EventInput): Promise<{ docs: DocumentOutput[], report: ConsistencyReport }> {
    const startTime = Date.now();
    
    // 1 & 2. Event Understanding Agent (Parse & Extract)
    this.onEvent({ type: 'agent_start', agent: 'Event Understanding' });
    const understandingAgent = new EventUnderstandingAgent();
    const eventPlan = await understandingAgent.run(input);
    this.onEvent({ type: 'agent_done', agent: 'Event Understanding', result: eventPlan });

    // 3 & 4. Template Planner Agent (Classify & Recommend)
    this.onEvent({ type: 'agent_start', agent: 'Template Planner' });
    const plannerAgent = new TemplatePlannerAgent();
    const { plan: enrichedPlan, template } = await plannerAgent.run(eventPlan);
    this.onEvent({ type: 'agent_done', agent: 'Template Planner', result: { enrichedPlan, template } });

    // 5. Generate Selected Documents
    const contentAgent = new ContentGenerationAgent();
    const logisticsAgent = new LogisticsPlanningAgent();
    
    const docTypes: DocType[] = input.requestedDocs && input.requestedDocs.length > 0 
      ? input.requestedDocs 
      : ['proposal', 'flyer', 'budget', 'timeline'];
    
    const docResults = await Promise.allSettled(
      docTypes.map(async (type) => {
        this.onEvent({ type: 'agent_start', agent: `Generating ${type}` });
        let content;
        if (['proposal', 'flyer', 'summary'].includes(type)) {
          content = await contentAgent.generate(type, enrichedPlan, template);
        } else {
          content = await logisticsAgent.generate(type, enrichedPlan, template);
        }
        this.onEvent({ type: 'document_done', docType: type, content });
        return { type, content };
      })
    );

    const successfulDocs = docResults
      .filter((res): res is PromiseFulfilledResult<{type: DocType, content: string}> => res.status === 'fulfilled')
      .map(res => res.value);

    // 6. Review Consistency
    this.onEvent({ type: 'agent_start', agent: 'Review & Consistency' });
    let finalDocs = successfulDocs;
    let report: ConsistencyReport = { isConsistent: true, mismatches: [], summary: "Consistency check skipped or failed." };
    
    try {
      const reviewAgent = new ReviewConsistencyAgent();
      const reviewResult = await reviewAgent.run(enrichedPlan, successfulDocs);
      finalDocs = reviewResult.docs;
      report = reviewResult.report;
    } catch (error) {
      console.error("ReviewConsistencyAgent failed:", error);
    }
    
    this.onEvent({ type: 'consistency_report', report });
    this.onEvent({ type: 'agent_done', agent: 'Review & Consistency', result: report });

    const duration = Date.now() - startTime;
    this.onEvent({ type: 'generation_complete', summary: { docCount: finalDocs.length, duration } });

    // 7. Return Structured Outputs
    const structuredDocs = finalDocs.map((doc, index) => ({
      id: `doc_${Date.now()}_${index}`,
      type: doc.type as DocType,
      content: doc.content,
      status: 'draft' as const,
      version: 1
    }));

    return { docs: structuredDocs, report };
  }

  static async test() {
    const orchestrator = new Orchestrator((event) => {
      console.log(`[EVENT] ${event.type}:`, JSON.stringify(event, null, 2));
    });

    const testInput: EventInput = {
      prompt: `
        Event type: Tech Meetup
        Participants: 200
        Budget: ₹50,000
        Venue: College Seminar Hall
        Mode: Offline
      `,
      theme: 'Tech and Innovation',
      requestedDocs: ['proposal', 'flyer']
    };

    console.log("Starting Phase 1 Test...");
    const result = await orchestrator.run(testInput);
    console.log("Phase 1 Test Complete!");
    console.log("Generated Documents:", result.docs.length);
    console.log("Consistency Report:", JSON.stringify(result.report, null, 2));
  }
}
