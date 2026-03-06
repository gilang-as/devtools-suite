/**
 * Utility for DateTime operations including Unix, Cron, and TimeZones.
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Unix Timestamp Logic
 */
export function unixToDate(timestamp: number, isMs: boolean = false): Date {
  return new Date(isMs ? timestamp : timestamp * 1000);
}

export function dateToUnix(date: Date, toMs: boolean = false): number {
  const ms = date.getTime();
  return toMs ? ms : Math.floor(ms / 1000);
}

/**
 * Cron Logic (Basic Parser)
 */
export function parseCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return 'Invalid Cron Expression';

  const [min, hour, dom, month, dow] = parts;

  const describe = (val: string, unit: string, all: string) => {
    if (val === '*') return all;
    if (val.includes('/')) {
      const [start, step] = val.split('/');
      return `Every ${step} ${unit}${start === '*' ? '' : ` starting from ${start}`}`;
    }
    if (val.includes(',')) return `At ${unit}s ${val}`;
    if (val.includes('-')) return `Between ${unit}s ${val.replace('-', ' and ')}`;
    return `At ${unit} ${val}`;
  };

  return `${describe(min, 'minute', 'Every minute')}, ${describe(hour, 'hour', 'every hour')}, ${describe(dom, 'day of month', 'every day of month')}, ${describe(month, 'month', 'every month')}, and ${describe(dow, 'day of week', 'every day of week')}.`;
}

/**
 * Timezone Logic
 */
export function getAllTimezones(): string[] {
  // Use Intl to get all supported timezones if available, or a fallback list
  try {
    return (Intl as any).supportedValuesOf('timeZone');
  } catch (e) {
    return ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Jakarta'];
  }
}

export function convertTimezone(date: Date, toTz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
}

/**
 * ISO8601 Logic
 */
export function formatISO(date: Date, type: 'basic' | 'extended' | 'utc' = 'extended'): string {
  if (type === 'utc') return date.toISOString();
  const base = date.toISOString().split('.')[0] + 'Z';
  return type === 'basic' ? base.replace(/[:-]/g, '') : base;
}
