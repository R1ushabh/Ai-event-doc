import { createObjectCsvStringifier } from 'csv-writer';
import { parseStructuredData } from '../markdownParser.ts';

export async function exportToCsv(content: string): Promise<string> {
  const data = parseStructuredData(content);

  if (data && typeof data === 'object') {
    // Handle Budget
    if (data.items) {
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'category', title: 'Category' },
          { id: 'item', title: 'Item' },
          { id: 'estimated_cost', title: 'Estimated Cost' },
          { id: 'notes', title: 'Notes' },
        ],
      });
      return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data.items);
    }
    // Handle Timeline
    else if (data.schedule) {
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'time', title: 'Time' },
          { id: 'activity', title: 'Activity' },
          { id: 'duration', title: 'Duration' },
          { id: 'responsible_person', title: 'Responsible' },
          { id: 'location', title: 'Location' },
        ],
      });
      return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data.schedule);
    }
  }

  // Fallback for markdown tables
  const lines = content.split('\n').filter(line => line.includes('|'));
  if (lines.length < 2) return content;

  const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
  const csvStringifier = createObjectCsvStringifier({
    header: headers.map(h => ({ id: h, title: h })),
  });

  const records = lines.slice(2).map(line => {
    const values = line.split('|').map(v => v.trim()).filter(v => v);
    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      record[h] = values[i] || '';
    });
    return record;
  });

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
}
