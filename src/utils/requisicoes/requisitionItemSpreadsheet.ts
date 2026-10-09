import * as XLSX from "xlsx";

export function readRequisitionItemSpreadsheet(data: ArrayBuffer): unknown[][] {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("A tabela está vazia.");
  const parsed = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, range: 0, defval: "", blankrows: false });
  if (!parsed.length) throw new Error("A tabela está vazia.");
  return parsed.map((row, index) => {
    if ([0, 1, 2].some((column) => !String(row[column] ?? "").trim())) {
      throw new Error(`Linha ${index + 1}: código do produto (A), observação (B) e QTD (C) são obrigatórios.`);
    }
    if (row.slice(5).some((value) => String(value ?? "").trim())) {
      throw new Error(`Linha ${index + 1}: a tabela deve conter somente as cinco colunas A, B, C, D e E.`);
    }
    return [String(row[0]).trim(), String(row[1]).trim(), row[2], String(row[3] ?? "").trim(), row[4]];
  });
}
