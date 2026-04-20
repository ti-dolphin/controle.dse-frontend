import * as XLSX from 'xlsx';
import { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

/**
 * Exporta dados para arquivo Excel (.xlsx)
 * @param data Array de objetos com os dados
 * @param fileName Nome do arquivo (sem extensão)
 * @param sheetName Nome da planilha
 */
export const exportToExcel = (
  data: any[],
  fileName: string = 'export',
  sheetName: string = 'Dados'
): void => {
  if (!data || data.length === 0) {
    console.warn('Nenhum dado para exportar');
    return;
  }

  // Criar workbook
  const workbook = XLSX.utils.book_new();

  // Converter dados para worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Gerar arquivo e fazer download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Formata dados de apontamentos para exportação Excel
 * @param notes Array de apontamentos
 */
export const formatNotesForExcel = (
  notes: any[],
  columns: GridColDef[],
  columnVisibilityModel: GridColumnVisibilityModel = {}
): any[] => {
  const exportableColumns = columns.filter((column) => {
    if (column.field === 'actions') return false;
    if (columnVisibilityModel[column.field] === false) return false;
    return Boolean(column.headerName);
  });

  return notes.map((note) => {
    const row: Record<string, any> = {};

    exportableColumns.forEach((column) => {
      const header = column.headerName as string;
      const rawValue = note[column.field];
      const valueGetter = column.valueGetter as
        | ((value: any, row: any, colDef: GridColDef, apiRef: any) => any)
        | undefined;
      const valueFormatter = column.valueFormatter as
        | ((value: any, row: any, colDef: GridColDef, apiRef: any) => any)
        | undefined;

      const valueFromGetter = valueGetter
        ? valueGetter(rawValue, note, column, null)
        : rawValue;
      const value = valueFormatter
        ? valueFormatter(valueFromGetter, note, column, null)
        : valueFromGetter;

      row[header] = normalizeExcelValue(column.field, value);
    });

    return row;
  });
};

export const formatTomadoresForExcel = (tomadores: any[]): any[] => {
  return tomadores.map((tomador) => ({
    Chapa: tomador.CHAPA ?? '',
    Funcionário: tomador.NOME_FUNCIONARIO ?? '',
    'Centro de Custo': tomador.NOME_CENTRO_CUSTO ?? '',
    'Código Reduzido': tomador.CODREDUZIDO ?? '',
    'Quantidade de Dias': Number(tomador.QUANTIDADE_DIAS ?? 0),
    'Percentual de Dias (%)': Number(tomador.PERCENTUAL_DIAS ?? 0),
  }));
};

/**
 * Normaliza valores exportados para um formato legível em Excel
 */
const normalizeExcelValue = (field: string, value: any): string | number => {
  if (field === 'CODSITUACAO') {
    return getSituacaoLabel(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

/**
 * Retorna label legível da situação
 */
const getSituacaoLabel = (situacao: string): string => {
  switch (situacao) {
    case 'A':
      return 'Ativo';
    case 'I':
      return 'Inativo';
    case 'P':
      return 'Pendente';
    case 'Z':
      return 'Zerado';
    default:
      return situacao || '-';
  }
};
