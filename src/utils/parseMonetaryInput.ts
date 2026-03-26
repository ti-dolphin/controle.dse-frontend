export const parseMonetaryInput = (value: unknown): number => {
  if (value === "" || value === null || value === undefined) return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value).trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/\s+/g, "").replace(/[^\d.,-]/g, "");
  if (!cleaned) return 0;

  const isNegative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/-/g, "");

  // Padrão BR: ponto para milhar e vírgula para decimal.
  if (unsigned.includes(",")) {
    const lastCommaIndex = unsigned.lastIndexOf(",");
    const integerPartRaw = unsigned.slice(0, lastCommaIndex);
    const decimalPartRaw = unsigned.slice(lastCommaIndex + 1);

    const integerDigits = integerPartRaw.replace(/\./g, "").replace(/\D/g, "") || "0";
    const decimalDigits = decimalPartRaw.replace(/\D/g, "").slice(0, 3);

    const normalized = decimalDigits
      ? `${isNegative ? "-" : ""}${integerDigits}.${decimalDigits}`
      : `${isNegative ? "-" : ""}${integerDigits}`;

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (!unsigned.includes(".")) {
    const parsed = Number(`${isNegative ? "-" : ""}${unsigned}`);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const integerDigits = unsigned.replace(/\./g, "").replace(/\D/g, "");
  const parsed = Number(`${isNegative ? "-" : ""}${integerDigits}`);
  return Number.isFinite(parsed) ? parsed : 0;
};
