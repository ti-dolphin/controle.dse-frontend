import { format, parseISO } from "date-fns";

export function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export const parseISODate = (isoDate: string | undefined | null): string => {
    if(!isoDate) return '';

  try {
    return format(parseISO(isoDate), "yyyy-MM-dd");
  } catch (error) {
    console.error("Invalid date:", isoDate);
    return "";
  }
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export const formatToISOstring = (date: Date): string => {
  return date.toISOString();
};
