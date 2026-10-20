import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Checkbox, CircularProgress, Link, Tooltip, useTheme, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import BaseDataTable from "../../shared/BaseDataTable";
import { TextHeader } from "../../TextHeader";
import CandidateApplicationService, { CandidateRow } from "../../../services/CandidateApplicationService";
import CommentIcon from "@mui/icons-material/Comment";
import CandidatesCommentDialog from "../CandidatesCommentDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

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
const formatDateTime = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
};


const CandidatesTab = () => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const canSeeCandidateComments = Number(user?.PERM_COMENT_CANDIDATO) === 1
    || Number(user?.PERM_ADMINISTRADOR) === 1;
  const [rows, setRows] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  //comentários:
  const [openComentDialog, setOpenComentDialog] = useState(false)
  const [idCandidatoForComent, setIdCandidatoForComent] = useState(0)
  
  const openComentsDialog = (id_candidato) => {
    setIdCandidatoForComent(id_candidato)
    setOpenComentDialog(true)
  }
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
      field: 'triado',
      headerName: 'Triado',
      width: 90,
      renderCell: ({row}) => (
        <Checkbox
          checked={!!row.triado}
          size="small"
          onChange={(e, checked) => {
            CandidateApplicationService.updateRow(row.id_candidato, checked)
            setRows((current) => {
              return current.map((item) =>
                item.id_candidato === row.id_candidato
                  ? { ...item, triado: checked }
                  : item
              );
            })
          }}
          sx={{padding: 0}}
        />
      )
    },
    ...(canSeeCandidateComments ? [{
      field: 'comentarios',
      headerName: 'Comentários',
      width: 100,
      align:'center',
      headerAlign: 'center',
      renderCell: ({row}) => (
        <Tooltip title='Comentário'>
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              openComentsDialog(row.id_candidato)
              //função para meter o comentário
            }}
            sx={{ 
              color: row.comentado ? "primary.main" : "text.secondary"
            }}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    } as GridColDef] : []),
    {
      field: "atualizado_em",
      headerName: "Enviado em",
      minWidth: 160,
      flex: 1,
      renderCell: ({ row }) => formatDateTime(row.atualizado_em),
    },
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
  ], [filters, canSeeCandidateComments]);

  return (
    <>
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

    {canSeeCandidateComments && <CandidatesCommentDialog
      open={openComentDialog}
      onClose={() => setOpenComentDialog(false)}
      id_candidato={idCandidatoForComent}
      onCommentChange={(hasComments) => setRows((current) => current.map((row) =>
        row.id_candidato === idCandidatoForComent ? { ...row, comentado: hasComments } : row
      ))}
    />}
    </>

  );
};

export default CandidatesTab;
