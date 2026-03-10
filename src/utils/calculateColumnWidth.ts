import { textMeasurer } from "./textMeansurer";

export const calculateColumnWidth = (
  rows: any[],
  field: string,
  headerName: string,
  valueGetter?: (value: any) => any,
  font?: string,
  minWidth: number = 60,
  maxWidth: number = 500
) => {
  const fontToUse = font || '12px Roboto';
  const measure = textMeasurer(fontToUse);

  const headerWidth = measure(headerName);
  minWidth = Math.max(minWidth, headerWidth + 40);

  if (!rows || rows.length === 0) {
    return Math.min(minWidth, maxWidth);
  }

  const sampleSize = Math.min(50, rows.length)

  const sampledRows = rows.slice(0, sampleSize);

  const contentWidth = Math.max(
    ...sampledRows.map((row) => {
      let value = row[field];
      
      if (valueGetter && typeof valueGetter === 'function') {
        value = valueGetter(value);
      }
      
      const stringValue = value !== null && value !== undefined ? String(value) : '';
      return measure(stringValue);
    }),
    0
  );

  const finalWidth = Math.max(headerWidth, contentWidth) + 40;

  return Math.max(minWidth, Math.min(maxWidth, finalWidth));
}