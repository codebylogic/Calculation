// Markdown Score Tracking and Exporter

export const DEFAULT_MARKDOWN_HEADER = `# Calculation Scores History\n\n| Date & Time | Total Questions | Score | Accuracy | Breakdown |\n|---|---|---|---|---|\n`;
export const defaultMarkdown = DEFAULT_MARKDOWN_HEADER;
export const appendScoreToMarkdown = appendScoreRecordToMarkdown;

export function parseMarkdownTable(md) {
  if (!md) return [];
  const records = [];
  const lines = md.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && !trimmed.includes('Date & Time') && !trimmed.includes('---')) {
      const parts = trimmed.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        records.push({
          dateTime: parts[1],
          total: parts[2],
          score: parts[3],
          accuracy: parts[4],
          breakdown: parts[5]
        });
      }
    }
  }
  return records;
}

export function appendScoreRecordToMarkdown(existingMd, { total, correct, percentage, scoresBreakdown }) {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

  const breakdowns = [];
  Object.keys(scoresBreakdown || {}).forEach(cat => {
    const metric = scoresBreakdown[cat];
    const catPct = metric.total > 0 ? Math.round((metric.correct / metric.total) * 100) : 0;
    breakdowns.push(`${cat}: ${catPct}%`);
  });
  const breakdownStr = breakdowns.length > 0 ? breakdowns.join(", ") : "General: 100%";

  const newRow = `| ${formattedDate} | ${total} | ${correct}/${total} | ${percentage}% | ${breakdownStr} |\n`;
  const base = existingMd || DEFAULT_MARKDOWN_HEADER;
  return base.endsWith('\n') ? `${base}${newRow}` : `${base}\n${newRow}`;
}

export function downloadMarkdownFile(content, filename = "calculation_score.md") {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
