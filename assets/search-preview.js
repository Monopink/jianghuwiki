// Match the index's actual terms, including prefix and fuzzy expansions.
export function matchRanges(text, terms) {
  const words = [...new Set(terms.filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!words.length) return [];
  const pattern = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return [...text.matchAll(new RegExp(pattern, 'giu'))].map(match => ({
    start: match.index, end: match.index + match[0].length, term: match[0].toLowerCase()
  }));
}

export function preview(text, terms, limit = 150) {
  text = String(text || '').replace(/\s+/gu, ' ').trim();
  const ranges = matchRanges(text, terms);
  let best = 0, score = -1, right = 0;
  const counts = new Map();
  for (let left = 0; left < ranges.length; left++) {
    const start = Math.max(0, ranges[left].start - 35);
    const end = start + limit;
    while (right < ranges.length && ranges[right].start < end) {
      const term = ranges[right++].term;
      counts.set(term, (counts.get(term) || 0) + 1);
    }
    const next = counts.size * 100 + right - left;
    if (next > score) { score = next; best = start; }
    const term = ranges[left].term;
    counts.set(term, counts.get(term) - 1);
    if (!counts.get(term)) counts.delete(term);
  }
  // Keep the excerpt bounded even when the index returns a very long token.
  let end = Math.min(text.length, best + limit);
  if (best > 0 && /[\uDC00-\uDFFF]/u.test(text[best])) best--;
  if (end < text.length && /[\uDC00-\uDFFF]/u.test(text[end])) end--;
  return {
    text: text.slice(best, end), leading: best > 0, trailing: end < text.length,
    ranges: ranges.filter(range => range.end > best && range.start < end)
      .map(range => ({ start: Math.max(0, range.start - best), end: Math.min(end, range.end) - best }))
  };
}

export function appendHighlighted(element, text, terms, ranges = matchRanges(text, terms)) {
  let cursor = 0;
  for (const range of ranges) {
    element.append(document.createTextNode(text.slice(cursor, range.start)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(range.start, range.end);
    element.append(mark);
    cursor = range.end;
  }
  element.append(document.createTextNode(text.slice(cursor)));
}
