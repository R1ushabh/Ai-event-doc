import express, { Request, Response } from 'express';
import { exportToDocx } from './backend/services/exporters/docx_exporter.ts';
import { exportToPdf } from './backend/services/exporters/pdf_exporter.ts';
import { exportToCsv } from './backend/services/exporters/csv_exporter.ts';
import { DocumentOutput } from './backend/models/schemas.ts';
import path from 'path';

const app = express();
app.use(express.json());

// In-memory store for generated documents to support export endpoints
const documentStore = new Map<string, DocumentOutput>();

app.post('/api/store', async (req: Request, res: Response) => {
  try {
    const { type, title, content, template_id } = req.body as { type: string; title: string; content: string; template_id?: string };
    console.log(`[API Store] Storing document: ${title} (${type})`);
    const docId = Math.random().toString(36).substring(7);
    const doc: DocumentOutput = { type, title, content, metadata: { id: docId, template_id } };
    documentStore.set(docId, doc);
    console.log(`[API Store] Document stored with ID: ${docId}`);
    res.json(doc);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/export/docx/:id', async (req: Request, res: Response) => {
  try {
    const doc = documentStore.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const buffer = await exportToDocx(doc.content, doc.title, doc.metadata?.template_id);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.title}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/export/pdf/:id', async (req: Request, res: Response) => {
  try {
    const doc = documentStore.get(req.params.id);
    if (!doc) {
      console.error(`PDF Export: Document ${req.params.id} not found`);
      return res.status(404).json({ error: 'Document not found' });
    }
    
    console.log(`Generating PDF for document: ${doc.title} (${req.params.id})`);
    const buffer = await exportToPdf(doc.content, doc.title, doc.metadata?.template_id);
    
    const safeTitle = encodeURIComponent(doc.title.replace(/[/\\?%*:|"<>]/g, '-'));
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
    console.log(`PDF Export successful: ${doc.title}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`PDF Export failed for ${req.params.id}:`, message);
    res.status(500).json({ error: message });
  }
});

app.get('/api/export/csv/:id', async (req: Request, res: Response) => {
  try {
    const doc = documentStore.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const csv = await exportToCsv(doc.content);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.title}.csv"`);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/env', (req, res) => res.json({ key: process.env.GEMINI_API_KEY, nextKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY }));

app.get('/api/test-pdf', async (req, res) => {
  try {
    const doc = new (await import('pdfkit')).default();
    const chunks: any[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(result);
    });
    doc.text('Hello World');
    doc.end();
  } catch (err) {
    res.status(500).send(err instanceof Error ? err.message : String(err));
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
