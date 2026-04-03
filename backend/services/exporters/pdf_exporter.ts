import PDFDocument from 'pdfkit/js/pdfkit.js';
import { parseStructuredData, cleanGeneratedText } from '../markdownParser.ts';

console.log("[PDF Exporter] Module loaded. PDFDocument type:", typeof PDFDocument, "Keys:", Object.keys(PDFDocument || {}), "Is function:", typeof PDFDocument === 'function', "Default type:", typeof (PDFDocument as any).default, "Proto:", Object.getPrototypeOf(PDFDocument));

export async function exportToPdf(content: string, title: string, templateId?: string): Promise<Buffer> {
  console.log(`[PDF Exporter] Starting generation for: ${title}`);
  return new Promise((resolve, reject) => {
    try {
      console.log("[PDF Exporter] Instantiating PDFDocument...");
      const doc = new (PDFDocument as any)({ margin: 50 });
      console.log("[PDF Exporter] PDFDocument instantiated successfully");
      const buffers: Buffer[] = [];
      const data = parseStructuredData(content);

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        console.log(`[PDF Exporter] Finished generation for: ${title}`);
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', (err) => {
        console.error(`[PDF Exporter] Error during generation for ${title}:`, err);
        reject(err);
      });

    // Template-based colors
    const colors: Record<string, string> = {
      vibrant_festival: '#f97316', // orange-500
      elegant_gala: '#d97706',    // amber-600
      tech_summit: '#4f46e5',     // indigo-600
      custom: '#4f46e5',          // indigo-600
    };
    const accentColor = colors[templateId || 'tech_summit'] || '#4f46e5';

    // Title
    doc.fillColor(accentColor).fontSize(24).font('Helvetica-Bold').text(title.toUpperCase(), { align: 'center' });
    doc.moveDown(2);
    doc.fillColor('#000000'); // Reset to black

    if (data && typeof data === 'object') {
      // Handle Structured Proposal/Report/Marketing
      if (data.sections) {
        if (data.subtitle) {
          doc.fontSize(16).font('Helvetica-Bold').text(data.subtitle, { align: 'center' });
          doc.moveDown(1.5);
        }

        data.sections.forEach((section: any) => {
          doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text(section.heading);
          doc.fillColor('#000000');
          doc.moveDown(0.5);
          doc.fontSize(11).font('Helvetica').text(section.content);
          doc.moveDown(0.5);
          if (section.bullets) {
            section.bullets.forEach((bullet: string) => {
              doc.text(`• ${bullet}`, { indent: 20 });
            });
            doc.moveDown(1);
          } else {
            doc.moveDown(1);
          }
        });
      }
      // Handle Budget
      else if (data.items) {
        doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text("Budget Breakdown");
        doc.fillColor('#000000');
        doc.moveDown();
        
        data.items.forEach((item: any) => {
          doc.fontSize(10).font('Helvetica-Bold').text(`${item.category}: `, { continued: true })
             .font('Helvetica').text(`${item.item} - $${item.estimated_cost}`);
          if (item.notes) doc.fontSize(9).font('Helvetica-Oblique').text(`Note: ${item.notes}`, { indent: 20 });
          doc.moveDown(0.5);
        });

        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text(`Total Cost: $${data.total_cost}`);
      }
      // Handle Timeline
      else if (data.schedule) {
        doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text("Event Schedule");
        doc.fillColor('#000000');
        doc.moveDown();

        data.schedule.forEach((item: any) => {
          doc.fontSize(10).font('Helvetica-Bold').text(`${item.time}: `, { continued: true })
             .font('Helvetica').text(`${item.activity} (${item.duration})`);
          doc.fontSize(9).text(`Responsible: ${item.responsible_person || "-"} | Location: ${item.location || "-"}`, { indent: 20 });
          doc.moveDown(0.5);
        });
      }
      // Handle Flyer
      else if (data.tagline && data.cta_block) {
        // Header Block
        doc.rect(0, 0, 612, 150).fill(accentColor);
        doc.fillColor('#FFFFFF').fontSize(32).font('Helvetica-Bold').text(data.title || title.toUpperCase(), 50, 50, { align: 'center', width: 512 });
        doc.fontSize(14).font('Helvetica-Oblique').text(data.tagline, 50, 100, { align: 'center', width: 512 });
        
        doc.fillColor('#000000').y = 180;
        doc.x = 50;

        doc.fontSize(12).font('Helvetica').text(data.description, { lineGap: 5 });
        doc.moveDown(2);

        if (data.details) {
          doc.fillColor(accentColor).fontSize(16).font('Helvetica-Bold').text("EVENT LOGISTICS");
          doc.moveTo(50, doc.y).lineTo(200, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          
          doc.fontSize(11).font('Helvetica-Bold').text(`DATE: `, { continued: true }).font('Helvetica').text(data.details.date);
          doc.fontSize(11).font('Helvetica-Bold').text(`TIME: `, { continued: true }).font('Helvetica').text(data.details.time);
          doc.fontSize(11).font('Helvetica-Bold').text(`VENUE: `, { continued: true }).font('Helvetica').text(data.details.venue);
          doc.moveDown(1.5);
        }

        if (data.speaker_block) {
          doc.fillColor(accentColor).fontSize(16).font('Helvetica-Bold').text("FEATURED SPEAKERS");
          doc.moveTo(50, doc.y).lineTo(200, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          doc.fontSize(11).font('Helvetica').text(data.speaker_block, { lineGap: 3 });
          doc.moveDown(1.5);
        }

        if (data.organizer_block) {
          doc.fillColor(accentColor).fontSize(16).font('Helvetica-Bold').text("ORGANIZERS");
          doc.moveTo(50, doc.y).lineTo(200, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          doc.fontSize(11).font('Helvetica').text(data.organizer_block, { lineGap: 3 });
          doc.moveDown(1.5);
        }

        if (data.cta_block) {
          const ctaY = Math.max(doc.y, 650);
          doc.rect(50, ctaY, 512, 60).fill(accentColor);
          doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text(data.cta_block, 60, ctaY + 20, { width: 492, align: 'center' });
        }
      }
      // Handle Summary
      else if (data.one_paragraph && data.newsletter) {
        doc.fillColor(accentColor).fontSize(18).font('Helvetica-Bold').text("Executive Summary", { align: 'center' });
        doc.moveDown();
        doc.fillColor('#000000').fontSize(14).font('Helvetica-Oblique').text(`"${data.one_paragraph}"`, { align: 'center', lineGap: 5 });
        doc.moveDown(2);

        const sections = [
          { title: "NEWSLETTER VERSION", content: data.newsletter },
          { title: "SOCIAL MEDIA POST", content: data.social_media },
          { title: "INTERNAL MEMO", content: data.memo }
        ];

        sections.forEach(section => {
          doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text(section.title);
          doc.moveTo(50, doc.y).lineTo(150, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          doc.fontSize(10).font('Helvetica').text(section.content, { lineGap: 3 });
          doc.moveDown(1.5);
        });
      }
      // Handle Checklist
      else if (data.stages) {
        data.stages.forEach((stage: any) => {
          doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text(stage.name.toUpperCase());
          doc.moveTo(50, doc.y).lineTo(150, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          stage.tasks.forEach((task: string) => {
            doc.fontSize(11).font('Helvetica').text(`[ ] ${task}`, { indent: 20, lineGap: 4 });
          });
          doc.moveDown(1);
        });
      }
      // Handle Analytics
      else if (data.stats) {
        doc.fillColor(accentColor).fontSize(18).font('Helvetica-Bold').text("EVENT PERFORMANCE ANALYTICS", { align: 'center' });
        doc.moveDown(2);

        const stats = [
          { label: "ESTIMATED REACH", value: data.stats.estimated_reach },
          { label: "ENGAGEMENT SCORE", value: `${data.stats.engagement_score}%` },
          { label: "EXPECTED ATTENDANCE", value: `${data.stats.expected_attendance_rate}%` },
          { label: "IMPACT SCORE", value: `${data.stats.impact_score}/10` }
        ];

        stats.forEach(stat => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${stat.label}: `, { continued: true }).font('Helvetica').text(String(stat.value));
          doc.moveDown(0.5);
        });

        if (data.recommendations) {
          doc.moveDown();
          doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text("STRATEGIC RECOMMENDATIONS");
          doc.moveTo(50, doc.y).lineTo(250, doc.y).strokeColor(accentColor).stroke();
          doc.fillColor('#000000').moveDown(0.5);
          data.recommendations.forEach((rec: string) => {
            doc.fontSize(11).font('Helvetica').text(`• ${rec}`, { indent: 20, lineGap: 4 });
          });
        }
      }
      // Handle Attendance
      else if (data.event_name || data.organizer) {
        doc.fillColor(accentColor).fontSize(18).font('Helvetica-Bold').text("OFFICIAL ATTENDANCE SHEET", { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(11).font('Helvetica-Bold').text(`EVENT: `, { continued: true }).font('Helvetica').text((data.event_name || title).toUpperCase());
        doc.fontSize(11).font('Helvetica-Bold').text(`DATE: `, { continued: true }).font('Helvetica').text(data.date || "-");
        doc.fontSize(11).font('Helvetica-Bold').text(`VENUE: `, { continued: true }).font('Helvetica').text(data.venue || "-");
        doc.moveDown(2);

        // Draw a simple table header
        const startY = doc.y;
        doc.rect(50, startY, 512, 20).fill(accentColor);
        doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold');
        doc.text("NO.", 60, startY + 5);
        doc.text("PARTICIPANT NAME", 100, startY + 5);
        doc.text("DEPARTMENT / ORGANIZATION", 280, startY + 5);
        doc.text("SIGNATURE", 480, startY + 5);
        
        doc.fillColor('#000000');

        // Draw 25 empty rows
        for (let i = 1; i <= 25; i++) {
          const rowY = startY + 20 + ((i-1) * 22);
          if (rowY > 720) break; 
          doc.fontSize(9).font('Helvetica').text(`${i}.`, 60, rowY + 7);
          doc.moveTo(50, rowY + 22).lineTo(562, rowY + 22).strokeColor('#CCCCCC').stroke();
          // Vertical lines
          doc.moveTo(90, rowY).lineTo(90, rowY + 22).stroke();
          doc.moveTo(270, rowY).lineTo(270, rowY + 22).stroke();
          doc.moveTo(470, rowY).lineTo(470, rowY + 22).stroke();
        }
        // Outer border
        doc.rect(50, startY, 512, 20 + (Math.min(25, Math.floor((720 - startY - 20) / 22)) * 22)).strokeColor('#000000').stroke();
      }
      else {
        doc.fontSize(11).font('Helvetica').text(cleanGeneratedText(content));
      }
    } else {
      doc.fontSize(11).font('Helvetica').text(cleanGeneratedText(content));
    }

    doc.end();
    } catch (err) {
      console.error(`[PDF Exporter] Synchronous error during generation for ${title}:`, err);
      reject(err);
    }
  });
}
