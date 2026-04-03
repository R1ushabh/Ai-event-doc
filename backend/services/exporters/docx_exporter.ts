import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, AlignmentType } from 'docx';
import { parseStructuredData, cleanGeneratedText } from '../markdownParser.ts';

export async function exportToDocx(content: string, title: string, templateId?: string): Promise<Buffer> {
  const data = parseStructuredData(content);
  const children: any[] = [];

  // Template-based colors
  const colors: Record<string, string> = {
    vibrant_festival: 'f97316', // orange-500
    elegant_gala: 'd97706',    // amber-600
    tech_summit: '4f46e5',     // indigo-600
    custom: '4f46e5',          // indigo-600
  };
  const accentColor = colors[templateId || 'tech_summit'] || '4f46e5';

  // Title
  children.push(
    new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), color: accentColor, bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (data && typeof data === 'object') {
    // Handle Structured Proposal/Report/Marketing
    if (data.sections) {
      if (data.subtitle) {
        children.push(
          new Paragraph({
            text: data.subtitle,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }

      data.sections.forEach((section: any) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: section.heading, color: accentColor, bold: true, size: 28 })],
            spacing: { before: 400, after: 200 },
          })
        );
        children.push(
          new Paragraph({
            text: section.content,
            spacing: { after: 200 },
          })
        );
        if (section.bullets) {
          section.bullets.forEach((bullet: string) => {
            children.push(
              new Paragraph({
                text: bullet,
                bullet: { level: 0 },
                spacing: { after: 100 },
              })
            );
          });
        }
      });
    } 
    // Handle Budget
    else if (data.items) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Budget Breakdown", color: accentColor, bold: true, size: 28 })],
          spacing: { before: 400, after: 200 },
        })
      );
      const rows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Cost", bold: true })] })] }),
          ],
        }),
      ];

      data.items.forEach((item: any) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(item.category)] }),
              new TableCell({ children: [new Paragraph(item.item)] }),
              new TableCell({ children: [new Paragraph(`$${item.estimated_cost}`)] }),
            ],
          })
        );
      });

      children.push(new Table({ rows, width: { size: 100, type: "pct" } }));
      children.push(new Paragraph({ children: [new TextRun({ text: `Total Cost: $${data.total_cost}`, bold: true })], spacing: { before: 200 } }));
    }
    // Handle Timeline
    else if (data.schedule) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Event Schedule", color: accentColor, bold: true, size: 28 })],
          spacing: { before: 400, after: 200 },
        })
      );
      const rows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Time", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Activity", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Responsible", bold: true })] })] }),
          ],
        }),
      ];

      data.schedule.forEach((item: any) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(item.time)] }),
              new TableCell({ children: [new Paragraph(item.activity)] }),
              new TableCell({ children: [new Paragraph(item.responsible_person || "-")] }),
            ],
          })
        );
      });

      children.push(new Table({ rows, width: { size: 100, type: "pct" } }));
    }
    // Handle Flyer
    else if (data.tagline && data.cta_block) {
      // Header
      children.push(
        new Paragraph({
          children: [new TextRun({ text: (data.title || title).toUpperCase(), color: "FFFFFF", bold: true, size: 48 })],
          alignment: AlignmentType.CENTER,
          shading: { fill: accentColor, type: "solid", color: "auto" },
          spacing: { before: 400, after: 200 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: data.tagline, color: accentColor, italics: true, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      children.push(new Paragraph({ text: data.description, spacing: { after: 400 } }));

      if (data.details) {
        children.push(new Paragraph({ children: [new TextRun({ text: "EVENT LOGISTICS", color: accentColor, bold: true, size: 28 })], spacing: { after: 200 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: "DATE: ", bold: true }), new TextRun(data.details.date)] }));
        children.push(new Paragraph({ children: [new TextRun({ text: "TIME: ", bold: true }), new TextRun(data.details.time)] }));
        children.push(new Paragraph({ children: [new TextRun({ text: "VENUE: ", bold: true }), new TextRun(data.details.venue)], spacing: { after: 400 } }));
      }

      if (data.speaker_block) {
        children.push(new Paragraph({ children: [new TextRun({ text: "FEATURED SPEAKERS", color: accentColor, bold: true, size: 28 })], spacing: { after: 200 } }));
        children.push(new Paragraph({ text: data.speaker_block, spacing: { after: 400 } }));
      }

      if (data.organizer_block) {
        children.push(new Paragraph({ children: [new TextRun({ text: "ORGANIZERS", color: accentColor, bold: true, size: 28 })], spacing: { after: 200 } }));
        children.push(new Paragraph({ text: data.organizer_block, spacing: { after: 400 } }));
      }

      if (data.cta_block) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: data.cta_block, color: "FFFFFF", bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            shading: { fill: accentColor, type: "solid", color: "auto" },
            spacing: { before: 400, after: 400 },
          })
        );
      }
    }
    // Handle Summary
    else if (data.one_paragraph && data.newsletter) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "EXECUTIVE SUMMARY", color: accentColor, bold: true, size: 36 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `"${data.one_paragraph}"`, italics: true, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      const sections = [
        { title: "NEWSLETTER VERSION", content: data.newsletter },
        { title: "SOCIAL MEDIA POST", content: data.social_media },
        { title: "INTERNAL MEMO", content: data.memo }
      ];

      sections.forEach(section => {
        children.push(new Paragraph({ children: [new TextRun({ text: section.title, color: accentColor, bold: true, size: 24 })], spacing: { before: 300, after: 200 } }));
        children.push(new Paragraph({ text: section.content, spacing: { after: 200 } }));
      });
    }
    // Handle Checklist
    else if (data.stages) {
      data.stages.forEach((stage: any) => {
        children.push(new Paragraph({ children: [new TextRun({ text: stage.name.toUpperCase(), color: accentColor, bold: true, size: 28 })], spacing: { before: 300, after: 200 } }));
        stage.tasks.forEach((task: string) => {
          children.push(new Paragraph({ text: task, bullet: { level: 0 }, spacing: { after: 100 } }));
        });
      });
    }
    // Handle Analytics
    else if (data.stats) {
      children.push(new Paragraph({ children: [new TextRun({ text: "EVENT PERFORMANCE ANALYTICS", color: accentColor, bold: true, size: 28 })], spacing: { before: 300, after: 200 } }));
      
      children.push(new Paragraph({ children: [new TextRun({ text: "ESTIMATED REACH: ", bold: true }), new TextRun(String(data.stats.estimated_reach))] }));
      children.push(new Paragraph({ children: [new TextRun({ text: "ENGAGEMENT SCORE: ", bold: true }), new TextRun(`${data.stats.engagement_score}/100`)] }));
      children.push(new Paragraph({ children: [new TextRun({ text: "EXPECTED ATTENDANCE: ", bold: true }), new TextRun(`${data.stats.expected_attendance_rate}%`)] }));
      children.push(new Paragraph({ children: [new TextRun({ text: "IMPACT SCORE: ", bold: true }), new TextRun(`${data.stats.impact_score}/10`)] }));

      if (data.recommendations) {
        children.push(new Paragraph({ children: [new TextRun({ text: "STRATEGIC RECOMMENDATIONS", color: accentColor, bold: true, size: 24 })], spacing: { before: 300, after: 200 } }));
        data.recommendations.forEach((rec: string) => {
          children.push(new Paragraph({ text: rec, bullet: { level: 0 }, spacing: { after: 100 } }));
        });
      }
    }
    // Handle Attendance
    else if (data.event_name || data.organizer) {
      children.push(new Paragraph({ children: [new TextRun({ text: "OFFICIAL ATTENDANCE SHEET", color: accentColor, bold: true, size: 36 })], alignment: AlignmentType.CENTER, spacing: { before: 300, after: 300 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: "EVENT: ", bold: true }), new TextRun((data.event_name || title).toUpperCase())] }));
      children.push(new Paragraph({ children: [new TextRun({ text: "DATE: ", bold: true }), new TextRun(data.date || "-")] }));
      children.push(new Paragraph({ children: [new TextRun({ text: "VENUE: ", bold: true }), new TextRun(data.venue || "-")], spacing: { after: 400 } }));

      const rows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "NO.", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: accentColor } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PARTICIPANT NAME", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: accentColor } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DEPT / ORG", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: accentColor } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "SIGNATURE", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: accentColor } }),
          ],
        }),
      ];

      for (let i = 1; i <= 25; i++) {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: String(i), alignment: AlignmentType.CENTER })] }),
              new TableCell({ children: [new Paragraph("")] }),
              new TableCell({ children: [new Paragraph("")] }),
              new TableCell({ children: [new Paragraph("")] }),
            ],
          })
        );
      }

      children.push(new Table({ rows, width: { size: 100, type: "pct" } }));
    }
    // Fallback for other structured data
    else {
      children.push(new Paragraph({ text: cleanGeneratedText(content) }));
    }
  } else {
    // Fallback for raw text/markdown
    children.push(new Paragraph({ text: cleanGeneratedText(content) }));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return await Packer.toBuffer(doc);
}
