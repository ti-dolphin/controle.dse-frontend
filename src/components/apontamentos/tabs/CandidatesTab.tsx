import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Link, useTheme } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import BaseDataTable from "../../shared/BaseDataTable";
import { TextHeader } from "../../TextHeader";
import CandidateApplicationService, { CandidateRow } from "../../../services/CandidateApplicationService";

const FILTER_FIELDS = ["nome_completo", "telefone", "cpf", "cidade", "estado", "funcoes"];
const FILTER_LABELS: Record<string, string> = {
  nome_completo: "Nome",
  telefone: "Telefone",
  cpf: "CPF",
  cidade: "Cidade",
  estado: "Estado",
  funcoes: "Função",
};

const normalize = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

const CandidatesTab = () => {
  const theme = useTheme();
  const [rows, setRows] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    CandidateApplicationService.getCandidates()
      .then(setRows)
      .catch((requestError: any) => setError(requestError?.response?.data?.error || "Não foi possível carregar os candidatos."))
      .finally(() => setLoading(false));
  }, []);

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFilters((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleApplyFilter = (field: string, value: string) => {
    setAppliedFilters((current) => ({ ...current, [field]: value.trim() }));
  };

  const filteredRows = useMemo(() => rows.filter((row) => FILTER_FIELDS.every((field) => {
    const query = normalize(appliedFilters[field]);
    return !query || normalize(row[field as keyof CandidateRow]).includes(query);
  })), [rows, appliedFilters]);

  const columns: GridColDef[] = useMemo(() => [
    ...FILTER_FIELDS.map((field) => ({
      field,
      headerName: FILTER_LABELS[field],
      minWidth: field === "nome_completo" || field === "funcoes" ? 220 : 130,
      flex: field === "nome_completo" || field === "funcoes" ? 1.5 : 1,
      renderHeader: () => (
        <TextHeader
          label={FILTER_LABELS[field]}
          field={field}
          filters={filters as any}
          handleChangeFilters={handleChangeFilter}
          onEnter={handleApplyFilter}
        />
      ),
    })),
    {
      field: "curriculo",
      headerName: "Currículo",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => row.curriculo
        ? <Link href={row.curriculo} target="_blank" rel="noreferrer">{row.nome_arquivo || "Abrir currículo"}</Link>
        : "-",
    },
  ], [filters]);

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", p: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      {loading && rows.length === 0 ? (
        <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
      ) : (
        <BaseDataTable
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => (row as CandidateRow).id_candidato}
          loading={loading}
          disableColumnMenu
          disableColumnFilter
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
          theme={theme}
          sx={{ flex: 1, minHeight: 0 }}
        />
      )}
    </Box>
  );
};

export default CandidatesTab;
