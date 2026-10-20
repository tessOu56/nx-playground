/** Minimal RFC 4180 CSV parser. Does not execute formulas. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows = splitCsvRows(text);
  if (rows.length < 2) return [];
  const header = rows[0].map(value => value.trim());
  const records: Record<string, string>[] = [];
  for (const row of rows.slice(1)) {
    if (row.every(cell => cell.trim() === '')) continue;
    const record: Record<string, string> = {};
    for (let i = 0; i < header.length; i += 1) {
      if (!header[i]) continue;
      record[header[i]] = row[i] ?? '';
    }
    records.push(record);
  }
  return records;
}

function splitCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (ch === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += ch;
  }
  if (quoted) return [];
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export function decodeMaybeShiftJis(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return new TextDecoder('utf-8').decode(bytes);
  }
  try {
    return new TextDecoder('shift_jis').decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}
