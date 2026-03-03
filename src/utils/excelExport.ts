import * as XLSX from 'xlsx';

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
export const formatNotesForExcel = (notes: any[]): any[] => {
  return notes.map((note) => ({
    'Assiduidade': note.ASSIDUIDADE ? 'Sim' : 'Não',
    'Comentado': note.COMENTADO ? 'Sim' : 'Não',
    'Chapa': note.CHAPA || '',
    'Funcionário': note.NOME_FUNCIONARIO || '',
    'Função': note.NOME_FUNCAO || '',
    'Data': note.DATA ? formatDateForExcel(note.DATA) : '',
    'Gerente': note.NOME_GERENTE || '',
    'Centro de Custo': note.NOME_CENTRO_CUSTO || '',
    'Status': note.DESCRICAO_STATUS || '',
    'Líder': note.NOME_LIDER || '',
    'Atividade': note.ATIVIDADE || '',
    'Situação': getSituacaoLabel(note.CODSITUACAO),
  }));
};

/**
 * Retorna o dia da semana a partir de uma data ISO
 */
const getWeekDay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = String(dateString).split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[date.getDay()];
};

/**
 * Formata data ISO para formato brasileiro
 */
const formatDateForExcel = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = String(dateString).split('T')[0].split('-');
  return `${day}/${month}/${year}`;
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
