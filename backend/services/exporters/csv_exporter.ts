import { createObjectCsvStringifier } from 'csv-writer';

export async function exportToCsv(content: string): Promise<string> {
  // This is a simplified CSV exporter that just splits lines and commas.
  // In a real app, you'd parse the markdown table properly.
  const lines = content.split('\\n').filter(line => line.includes('|'));
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
