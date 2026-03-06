/**
 * Utility to convert between CSV and JSON strings.
 */

export function csvToJson(csv: string, delimiter: string = ','): string {
  try {
    if (!csv.trim()) return '';
    
    const lines = csv.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 1) return '[]';

    // Regex to split by delimiter while ignoring delimiters inside quotes
    const splitRegex = new RegExp(`${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`);
    
    const headers = lines[0].split(splitRegex).map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(splitRegex);

      for (let j = 0; j < headers.length; j++) {
        let value = currentLine[j]?.trim() || '';
        // Remove surrounding quotes
        value = value.replace(/^"|"$/g, '');
        
        // Basic type detection
        if (value.toLowerCase() === 'true') {
          obj[headers[j]] = true;
        } else if (value.toLowerCase() === 'false') {
          obj[headers[j]] = false;
        } else if (value !== '' && !isNaN(Number(value))) {
          obj[headers[j]] = Number(value);
        } else {
          obj[headers[j]] = value;
        }
      }
      result.push(obj);
    }
    
    return JSON.stringify(result, null, 2);
  } catch (e: any) {
    throw new Error('CSV Parsing Error: ' + e.message);
  }
}

export function jsonToCsv(jsonStr: string, delimiter: string = ','): string {
  try {
    if (!jsonStr.trim()) return '';
    
    const parsed = JSON.parse(jsonStr);
    const data = Array.isArray(parsed) ? parsed : [parsed];
    
    if (data.length === 0) return '';

    // Collect all unique keys from all objects to form headers
    const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    
    const csvRows = [];
    
    // Header Row
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(delimiter));

    // Data Rows
    for (const item of data) {
      const row = headers.map(header => {
        const val = item[header];
        if (val === null || val === undefined) return '""';
        
        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        // Escape quotes by doubling them
        return `"${stringVal.replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(delimiter));
    }

    return csvRows.join('\n');
  } catch (e: any) {
    throw new Error('JSON to CSV Error: ' + e.message);
  }
}
