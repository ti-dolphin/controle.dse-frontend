export const parseMonetaryInput = (value: unknown): number => {
  if (value === "" || value === null || value === undefined) return 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/\s+/g, "").replace(/[^\d.,-]/g, "");
  if (!cleaned) return 0;

  if (cleaned.includes(",")) {
    const parsed = Number(cleaned.replace(/\./g, "").replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (!cleaned.includes(".")) {
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const groups = cleaned.split(".").filter(Boolean);
  if (groups.length === 0) return 0;

  if (groups.length === 1) {
    const parsed = Number(groups[0]);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (groups.length === 2) {
    const [left, right] = groups;

    if (right.length === 3) {
      const parsed = Number(`${left}${right}`);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (right.length > 3) {
      const allDigits = `${left}${right}`;
      if (allDigits.length <= 2) {
        const parsed = Number(allDigits);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      const parsed = Number(`${allDigits.slice(0, -2)}.${allDigits.slice(-2)}`);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(`${left}.${right}`);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const lastGroup = groups[groups.length - 1];
  const allDigits = groups.join("");

  if (lastGroup.length === 2 && allDigits.length > 2) {
    const parsed = Number(`${allDigits.slice(0, -2)}.${allDigits.slice(-2)}`);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(allDigits);
  return Number.isFinite(parsed) ? parsed : 0;
};
