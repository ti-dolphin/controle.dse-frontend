import { format, parseISO } from "date-fns";

export function parseDate(dateString: string | null): Date | null {
  // Valida tipo e formato
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return null;
  }

  try {
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return null;
    }
    // Opcional: validação de ano
    if (date.getFullYear() <= 2000) {
      console.error("Year must be greater than 2000:", dateString);
      return null;
    }

    const brazilGMTDate = new Date(date.getTime() + 3 * 3600000); // Ajusta para GMT-0
    return brazilGMTDate;
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
}

export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
