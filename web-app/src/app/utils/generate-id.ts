const counts: { [key: string]: number } = {};

export function generateId(prefix: string): string {
  if (!counts[prefix]) {
    counts[prefix] = 0;
  }
  counts[prefix]++;
  return `${prefix}-${counts[prefix]}`;
}
