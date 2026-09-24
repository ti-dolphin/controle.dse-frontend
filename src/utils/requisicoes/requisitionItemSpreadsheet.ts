import * as XLSX from "xlsx";

export function readRequisitionItemSpreadsheet(data: ArrayBuffer): unknown[][] {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("A tabela está vazia.");
  const parsed = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, range: 0, defval: "", blankrows: false });
  if (!parsed.length) throw new Error("A tabela está vazia.");
  return parsed.map((row, index) => {
    if ([0, 1, 2].some((column) => !String(row[column] ?? "").trim())) {
      throw new Error(`Linha ${index + 1}: observação (A), QTD (B) e unidade (C) são obrigatórias.`);
    }
    if (row.slice(3).some((value) => String(value ?? "").trim())) {
      throw new Error(`Linha ${index + 1}: a tabela deve conter somente as três colunas A, B e C.`);
    }
    return [String(row[0]).trim(), row[1], String(row[2]).trim()];
  });
}
