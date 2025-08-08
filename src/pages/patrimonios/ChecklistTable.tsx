import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { Movimentation } from "../../models/patrimonios/Movementation";
import { Checklist } from "../../models/patrimonios/Checklist";
import { CheckListService } from "../../services/patrimonios/ChecklistService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { GridColDef } from "@mui/x-data-grid";
import BaseDataTable from "../../components/shared/BaseDataTable";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
  formatDateToISOstring,
  getDateFromDateString,
  getDateFromISOstring,
} from "../../utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BaseTableColumnFilters from "../../components/shared/BaseTableColumnFilters";
import BaseTableToolBar from "../../components/shared/BaseTableToolBar";
import { debounce } from "lodash";
import CloseIcon from "@mui/icons-material/Close";
import ChecklistView from "./ChecklistView";
import { ChecklistFilters, cleanFilters, setFilters, setRefresh, setRows, setSearchTerm } from "../../redux/slices/patrimonios/ChecklistTableSlice";



const situations = [
  { value: "pendente", label: "Pendente" },
  { value: "cobrar", label: "Cobrar" },
  { value: "aprovar", label: "Aprovar" },
]

const ChecklistTable = () => {
  const theme = useTheme();
  const { id_patrimonio } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const {rows, filters, searchTerm, refresh} = useSelector((state: RootState) => state.checklistTable);
  const [from, setFrom] = useState<"patrimonio" | "checklists">("patrimonio");
  const [situation, setSituation] = React.useState<string | "cobrar" | "aprovar" | 'pendente'>("pendente");
  const [loading, setLoading] = React.useState(false);
  const  [checklistSelected, setChecklistSelected] = React.useState<Partial<Checklist> | null>(null);

  const columns: GridColDef[] = [
    {
      field: "id_checklist_movimentacao",
      headerName: "ID",
      type: "number",
      flex: 0.2,
    },
    {
      field: "patrimonio_nome",
      headerName: "Patrimônio",
      type: "string",
      flex: 1,
    },
    {
      field: "responsavel_nome",
      headerName: "Responsável",
      type: "string",
      flex: 1,
    },
    {
      field: "realizado",
      headerName: "Realizado",
      flex: 0.3,
      type: "boolean",

      renderCell: (params) => (
        <Box sx={{ color: params.value ? "green" : "red" }}>
          {params.value ? <CheckCircleIcon /> : <CancelIcon />}
        </Box>
      ),
    },
    {
      field: "aprovado",
      headerName: "Aprovado",
      flex: 0.3,
      type: "boolean",
      renderCell: (params) => (
        <Box sx={{ color: params.value ? "green" : "red" }}>
          {params.value ? <CheckCircleIcon /> : <CancelIcon />}
        </Box>
      ),
    },
    {
      field: "data_realizado",
      headerName: "Data da realização",
      flex: 0.4,
      type: "date",
      valueGetter: (date: string) => (date ? getDateFromISOstring(date) : ""),
    },
    {
      field: "data_aprovado",
      headerName: "Data da aprovação",
      flex: 0.4,
      type: "date",
      valueGetter: (date: string) => (date ? getDateFromISOstring(date) : ""),
    },
  ];

  const handleCleanFilters = () =>  {
    dispatch(cleanFilters());
  }

  const handleChangeFilters = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    dispatch(setFilters({ ...filters, [field]: value }));
  };

  const handleRowClick = (checklist : Partial<Checklist> ) =>  {
    setChecklistSelected(checklist);
  } 

  const formatFilters = (filters: ChecklistFilters) => {
    const dateFilters = ["data_realizado", "data_aprovado"];
    let formattedFilters: any = { ...filters };
    dateFilters.forEach((field: string) => {
      const dateValue = getDateFromDateString(
        String(filters[field as keyof ChecklistFilters])
      );
      formattedFilters[field as keyof ChecklistFilters] = dateValue
        ? formatDateToISOstring(dateValue)
        : null;
    });

    const numericFields = ["id_checklist_movimentacao"];
    numericFields.forEach((field: string) => {
      formattedFilters[field as keyof ChecklistFilters] = filters[
        field as keyof ChecklistFilters
      ]
        ? Number(filters[field as keyof ChecklistFilters])
        : null;
    });

    return formattedFilters;
  };

  const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchTerm(value))
  };

  const debouncedHanleChangeSearchTerm = debounce(handleChangeSearchTerm, 500);

  const fetchChecklistsByPatrimony = React.useCallback(async () => {
    try {
      if (!id_patrimonio) return;
      setLoading(true);
      const params = {
        filters: formatFilters(filters),
        searchTerm,
        id_patrimonio: Number(id_patrimonio),
      };
      const data = await CheckListService.getMany(params);

      dispatch(setRows(data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Houve um erro ao buscar os dados",
          type: "error",
        })
      );
    }
  }, [filters, searchTerm, id_patrimonio, dispatch, refresh]);

  const fetchChecklistsByUser = React.useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);
      const params = {
        situacao: situation,
        filters: formatFilters(filters),
        searchTerm,
      };
      const data = await CheckListService.getManyByUser(user.CODPESSOA, params);
      dispatch(setRows(data));
      setLoading(false);
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Houve um erro ao buscar os dados",
          type: "error",
        })
      );
    }
  }, [filters, searchTerm, dispatch, situation, refresh]);

  const renderSituation = (checklist : Partial<Checklist> | null) => { 
    if(!checklist) return "";
    const pendente = !(checklist.aprovado || checklist.realizado);
    const aprovado = checklist.realizado && checklist.aprovado;
    const waitingAproval = checklist.realizado && !checklist.aprovado;
    if(pendente) return "Pendente";
    if(aprovado) return "Aprovado";
    if(waitingAproval) return "Aprovação pendente";
  }

  //useEffect
  React.useEffect(() => {
    if (id_patrimonio) {
      setFrom("patrimonio");
      fetchChecklistsByPatrimony();
      return;
    }
    setFrom('checklists')
    fetchChecklistsByUser();
  }, [fetchChecklistsByPatrimony, fetchChecklistsByUser]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BaseTableToolBar handleChangeSearchTerm={debouncedHanleChangeSearchTerm}>
        {from === "checklists" && (
          <Stack direction={"row"} spacing={2}>
            {situations.map((st) => (
              <Button
                key={st.value}
                variant="contained"
                onClick={() => setSituation(st.value)}
                sx={{
                  backgroundColor:
                    st.value === situation ? "secondary.main" : "primary.main",
                  color: "white",
                  textTransform: "capitalize",
                  borderRadius: 0,
                }}
              >
                {st.label}
              </Button>
            ))}
          </Stack>
        )}
      </BaseTableToolBar>
      <BaseTableColumnFilters
        columns={columns}
        filters={filters}
        handleChangeFilters={handleChangeFilters}
        debouncedSetTriggerFetch={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <BaseDataTable
        rows={rows}
        columns={columns}
        loading={loading}
        disableColumnMenu
        getRowId={(row: Partial<Checklist>) =>
          row.id_checklist_movimentacao || Math.random()
        }
        onRowClick={(params) => handleRowClick(params.row)}
        hideFooter={from === "patrimonio"}
        rowHeight={36}
        theme={theme}
      />

      <Dialog
        fullScreen
        open={Boolean(checklistSelected)}
        onClose={() => {
          setChecklistSelected(null);
          
          dispatch(setRefresh(!refresh));
        }}
      >
        <DialogTitle>
          <Typography variant="h6" color="primary.main">
            {checklistSelected?.id_checklist_movimentacao} -{" "}
            {checklistSelected?.patrimonio_nome}
          </Typography>
          <Typography>
            Situação: {renderSituation(checklistSelected)}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            color="error"
            onClick={() => {
              setChecklistSelected(null);
              
              dispatch(setRefresh(!refresh));
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {checklistSelected && (
            <ChecklistView
              id_checklist={checklistSelected?.id_checklist_movimentacao || 0}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChecklistTable;
