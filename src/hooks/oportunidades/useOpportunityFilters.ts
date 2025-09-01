import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { clearfilters, setFilters } from "../../redux/slices/oportunidades/opportunityTableSlice";
import { GridColDef } from "@mui/x-data-grid";
import { useOpportunityColumns } from "./useOpportunityColumns";

// Interface para os filtros de oportunidade
export interface OpportunityFilters {
  CODOS: number | null;
  ID_PROJETO: number | null;
  NOME: string;
  cliente: string;
  projeto: string;
  status: string;
  responsavel: string;
  DATASOLICITACAO_FROM: string | null;
  DATASOLICITACAO_TO: string | null;
  DATAINICIO_FROM: string | null;
  DATAINICIO_TO: string | null;
  DATAINTERACAO_FROM: string | null;
  DATAINTERACAO_TO: string | null;
  DATAENTREGA_FROM: string | null;
  DATAENTREGA_TO: string | null;
  VALOR_TOTAL: number | null;
  adicional: number | null;
}


// Hook para gerenciar filtros de oportunidades
export const useOpportunityFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state : RootState) => state.opportunityTable.filters);
  const [activeFilters, setActiveFilters] = useState<GridColDef[]>([]);
  const handleChangeFilters = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      field: string,
    ) => {
      const value = e.target.value;

      dispatch(setFilters({ ...filters, [field]: value }));
    },
    [filters, dispatch]
  );
  const columns: GridColDef[] = [
    { field: "CODOS", headerName: "C ODO", width: 100 },
    { field: "ID_PROJETO", headerName: "Projeto", width: 150 },
    { field: "NOME", headerName: "Nome", width: 200 },
    { field: "cliente", headerName: "Cliente", width: 150 },
    { field: "projeto", headerName: "Projeto", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "responsavel", headerName: "Respons vel", width: 150 },
    {
      field: "DATASOLICITACAO_FROM",
      headerName: "Data de Solicita o (de)",
      width: 150,
    },
    {
      field: "DATASOLICITACAO_TO",
      headerName: "Data de Solicita o (at )",
      width: 150,
    },
    {
      field: "DATAINICIO_FROM",
      headerName: "Data de In cio (de)",
      width: 150,
    },
    {
      field: "DATAINICIO_TO",
      headerName: "Data de In cio (at )",
      width: 150,
    },
    {
      field: "DATAINTERACAO_FROM",
      headerName: "Data de Interacao (de)",
      width: 150,
    },
    {
      field: "DATAINTERACAO_TO",
      headerName: "Data de Interacao (at )",
      width: 150,
    },
    {
      field: "DATAENTREGA_FROM",
      headerName: "Data de Entrega (de)",
      width: 150,
    },
    {
      field: "DATAENTREGA_TO",
      headerName: "Data de Entrega (at )",
      width: 150,
    },
    { field: "VALOR_TOTAL", headerName: "Valor Total", width: 150 },
    { field: "adicional", headerName: "Adicional", width: 150 },
  ];
  const clearFilters = useCallback(() => {
      dispatch(clearfilters());
  }, [filters]);

    useEffect(() => {
      const newActiveFilters = columns.filter(
        (c) =>
          filters[c.field as keyof OpportunityFilters] !== "" &&
          filters[c.field as keyof OpportunityFilters] !== null
      );
      setActiveFilters(newActiveFilters);
    }, [ filters]);

  return { filters, handleChangeFilters, clearFilters, activeFilters };
};
