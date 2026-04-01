# EventForge AI

An AI-Based Event Document Generator.

## Architecture Adaptation

The requested architecture was Next.js 14 and Python FastAPI. However, the AI Studio runtime environment requires a Node.js-based module system (TypeScript, Vite, Express) running on a single port (3000). 

To ensure the application runs perfectly in this environment while maintaining the exact requested functionality, the architecture has been adapted to:
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, TypeScript, Google GenAI SDK

The folder structure and component hierarchy have been preserved as closely as possible to the original request:
- `src/components/` contains all the requested UI components (Sidebar, Topbar, EventInputCard, etc.)
- `backend/` contains all the requested backend services (gemini_client, event_extractor, generators, exporters)
- `server.ts` acts as the main entry point (replacing `main.py`)

## Features
- **Quick Paste & Structured Form**: Input event details easily.
- **AI Document Generation**: Instantly generate 8 professional documents (Proposal, Flyer, Attendance, Budget, Timeline, Report, Summary, Analytics).
- **Export**: Download documents as DOCX, PDF, or CSV.

## Tech Stack
- React + Vite
- Express.js
- Tailwind CSS
- Framer Motion
- Google Generative AI SDK (Gemini 2.0 Flash)
- docx, pdfkit, csv-writer
