import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { OpportunityStatus } from "../../models/oportunidades/OpportunityStatus";
import { ProjectAdicional } from "../../models/oportunidades/ProjectAdicional";
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { formatDateStringtoISOstring, getDateFromISOstring } from "../../utils";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GridColDef } from "@mui/x-data-grid";
import { Client } from "../../models/oportunidades/Client";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  OpportunityFilters,
  useOpportunityFilters,
} from "./useOpportunityFilters";
import { DateHeader } from "../../components/DateHeader";
import { TextHeader } from "../../components/TextHeader";

export const useOpportunityColumns = () => {
  const dispatch = useDispatch();
  const { handleChangeFilters, filters, activeFilters } = useOpportunityFilters();
  const [openModal, setOpenModal] = useState<{ field: string; open: boolean }>({
    field: "",
    open: false,
  });

  // Memoized columns array to prevent unnecessary recreation
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "situacao",
        headerName: "Situação",
        flex: 0.6,
        sortable: true,
        valueParser: (value: any) => {
          const valueOrderMap: any = {
            expirada: 1,
            expirando: 2,
            ativa: 3,
          };
          return valueOrderMap[value];
        },
        renderCell: (params: any) => {
          const iconMap: any = {
            expirada: <ErrorIcon color="error" />,
            expirando: <InfoIcon color="warning" />,
            ativa: <CheckCircleIcon color="success" />,
          };

          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              {iconMap[params.value]}
            </Box>
          );
        },
      },
      {
        field: "ID_PROJETO",
        headerName: "Projeto",
        flex: 1,
        renderHeader: () => (
          <TextHeader
            label="Projeto"
            field="ID_PROJETO"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "adicional",
        headerName: "Adicional",
        flex: 1,
        valueGetter: (adicional: ProjectAdicional) => adicional.NUMERO,
        renderHeader: () => (
          <TextHeader
            label="Adicional"
            field="adicional"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        valueGetter: (status: OpportunityStatus) => status.NOME || "",
        renderHeader: () => (
          <TextHeader
            label="Status"
            field="status"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "NOME",
        headerName: "Descrição",
        flex: 2,
        renderHeader: () => (
          <TextHeader
            label="Descrição"
            field="NOME"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      // {
      //   field: "projeto",
      //   headerName: "Projeto",
      //   flex: 2,
      //   valueGetter: (projeto: Project) => projeto?.DESCRICAO || "",
      //   renderHeader: () => (
      //     <TextHeader
      //       label="Projeto"
      //       field="projeto"
      //       filters={filters}
      //       handleChangeFilters={handleChangeFilters}
      //     />
      //   ),
      // },
      {
        field: "cliente",
        headerName: "Cliente",
        flex: 2,
        valueGetter: (client: Client) => client.NOMEFANTASIA || "",
        renderHeader: () => (
          <TextHeader
            label="Cliente"
            field="cliente"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },
      {
        field: "responsavel",
        headerName: "Responsável",
        flex: 1,
        valueGetter: (responsable: ReducedUser) => responsable?.NOME || "",
        renderHeader: () => (
          <TextHeader
            label="Responsável"
            field="responsavel"
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        ),
      },

      {
        field: "DATASOLICITACAO",
        headerName: "Solicitação",
        type: "date",
        flex: 1,
        renderHeader: () => (
          <DateHeader
            label="Solicitação"
            field="DATASOLICITACAO"
            filters={filters}
            activeFilters={activeFilters}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        ),
        valueGetter: (value: any) => getDateFromISOstring(value),
      },
      {
        field: "DATAENTREGA",
        headerName: "Fechamento",
        type: "date",
        flex: 1,
        renderHeader: () => (
          <DateHeader
            label="Fechamento"
            field="DATAENTREGA"
            filters={filters}
            activeFilters={activeFilters}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        ),
        valueGetter: (value: any) => getDateFromISOstring(value),
      },
      {
        field: "DATAINICIO",
        headerName: "Início",
        type: "date",
        flex: 1,
        renderHeader: () => (
          <DateHeader
            label="Início"
            field="DATAINICIO"
            filters={filters}
            activeFilters={activeFilters}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        ),
        valueGetter: (value: any) => getDateFromISOstring(value),
      },
      {
        field: "DATAINTERACAO",
        headerName: "Interação",
        type: "date",
        flex: 1,
        renderHeader: () => (
          <DateHeader
            label="Interação"
            field="DATAINTERACAO"
            filters={filters}
            activeFilters={activeFilters}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        ),
        valueGetter: (value: any) => getDateFromISOstring(value),
      },
      {
        field: "VALORFATDOLPHIN",
        headerName: "Fat. Dolphin",
        type: "number",
        valueGetter: (value: any) =>
          value
            ? `R$ ${Number(value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`
            : "",
      },
      {
        field: "VALORFATDIRETO",
        headerName: "Fat. Direto",
        type: "number",
        valueGetter: (value: any) =>
          value
            ? `R$ ${Number(value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`
            : "",
      },
      {
        field: "VALOR_TOTAL",
        headerName: "Valor Total",
        type: "number",
        flex: 1,
        align: "right",
        headerAlign: "right",
        valueGetter: (value: any) =>
          value
            ? `R$ ${Number(value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`
            : "",
      },
    ],
    [filters, activeFilters, openModal, handleChangeFilters]
  );

  return { columns };
};
