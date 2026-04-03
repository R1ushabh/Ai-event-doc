export function cleanGeneratedText(text: string): string {
  if (!text) return "";
  
  // Remove JSON artifacts if any
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'string') return cleanMarkdown(parsed);
    return text; // It's structured data, handle elsewhere
  } catch (e) {
    return cleanMarkdown(text);
  }
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/[#*`~]/g, "") // Remove common markdown symbols
    .replace(/\[ \]/g, "☐ ") // Replace empty checkboxes
    .replace(/\[x\]/g, "☑ ") // Replace checked checkboxes
    .replace(/&nbsp;/g, " ")
    .replace(/[ØÝÞßÜÍÛ“]/g, "") // Remove weird hallucinated characters reported by user
    .trim();
}

export function parseStructuredData(content: string): any {
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}
