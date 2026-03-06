import { v1, v4, v7 } from 'uuid';

export type UUIDVersion = 'v1' | 'v4' | 'v7' | 'guid';

export function generateUUIDs(version: UUIDVersion, count: number): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    switch (version) {
      case 'v1':
        uuids.push(v1());
        break;
      case 'v7':
        uuids.push(v7());
        break;
      case 'guid':
      case 'v4':
      default:
        uuids.push(v4());
        break;
    }
  }
  return uuids;
}

export function exportToCSV(uuids: string[], filename: string = 'uuids.csv') {
  const content = 'id\n' + uuids.join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
