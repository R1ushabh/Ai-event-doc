import express, { Request, Response } from 'express';
import { exportToDocx } from './backend/services/exporters/docx_exporter';
import { exportToPdf } from './backend/services/exporters/pdf_exporter';
import { exportToCsv } from './backend/services/exporters/csv_exporter';
import { EventDetails, GenerationRequest, DocumentOutput } from './backend/models/schemas';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json());

// In-memory store for generated documents to support export endpoints
const documentStore = new Map<string, DocumentOutput>();

app.post('/api/store', async (req: Request, res: Response) => {
  try {
    const { type, title, content } = req.body as { type: string; title: string; content: string };
    const docId = Math.random().toString(36).substring(7);
    const doc: DocumentOutput = { type, title, content, metadata: { id: docId } };
    documentStore.set(docId, doc);
    res.json(doc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/docx/:id', async (req: Request, res: Response) => {
  try {
    const doc = documentStore.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const buffer = await exportToDocx(doc.content, doc.title);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.title}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/pdf/:id', async (req: Request, res: Response) => {
  try {
    const doc = documentStore.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const buffer = await exportToPdf(doc.content, doc.title);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.title}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/env', (req, res) => res.json({ key: process.env.GEMINI_API_KEY, nextKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY }));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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
