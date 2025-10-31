import { DateTime } from "luxon";

//retorna uma data a partir de uma string no formato yyyy-MM-dd
export function getDateFromDateString(dateString: string | null): Date | null {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const dt = DateTime.utc(year, month, day, 3, 0);

  if (!dt.isValid || dt.year <= 2000) return null;

  return dt.toUTC().toJSDate(); // always UTC midnight: 2024-08-27T00:00:00.000Z
}
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

//retorna uma string no formato yyyy-MM-dd a partir de uma string no formato iso
export const getDateStringFromISOstring = (isoDate: string | undefined | null): string => {
  if (!isoDate) return "";
  const dt = DateTime.fromISO(isoDate, { zone: "utc" });
  // 2025-09-22T14:36:31.000Z
  return String(dt).replace(/[TZ]/g, " ").trim().slice(0, 16);

  // return dt.isValid ? dt.toFormat("dd/MM/yyyy", { 
  //   locale: "pt-BR"
  // }) : "";
};

export function getDateStringFromDateObject(date: Date): string {
  const dt = DateTime.fromJSDate(date, { zone: "utc" });
  return dt.toFormat("dd/MM/yyyy"); // ou .toLocaleString(DateTime.DATE_SHORT) para pt-BR
}

export const formatDateToISOstring = (date: Date): string | null => {
  return DateTime.fromJSDate(date, { zone: "utc" }).toISO();
};

export const formatDateStringtoISOstring = (dateString: string): string => {
  const dt = DateTime.fromISO(dateString, { zone: "utc" });

  return dt.isValid ? dt.toISO() : "";
};

export const getDateFromISOstring = (ISOstring: string) => {
  try {
    const dt = DateTime.fromISO(ISOstring, { zone: "utc" });
    return dt.isValid ? dt.toJSDate() : null;
  } catch (error) {
    return null;
  }
};

/**
 * Extrai a parte "YYYY-MM-DD" de uma string de data (ex: "2024-06-10 15:00:00" -> "2024-06-10").
 * Retorna string vazia se valor inválido.
 */
export function getDateInputValue(dateStr?: string | null): string {
  if (!dateStr) return "";
  // Aceita formatos "YYYY-MM-DD" ou "YYYY-MM-DD HH:mm:ss"
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}