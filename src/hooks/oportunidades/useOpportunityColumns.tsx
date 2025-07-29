import { GridColDef } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { OpportunityStatus } from "../../models/oportunidades/OpportunityStatus";
import { Client } from "../../models/oportunidades/Client";
import { ProjectAdicional } from "../../models/oportunidades/ProjectAdicional";
import { Box, Typography } from "@mui/material";
import { getDateFromISOstring } from "../../utils";




export const useOpportunityColumns = ( ) =>  {
  const columns: GridColDef[] = [
    {
      field: "ID_PROJETO",
      headerName: "Projeto",
      flex: 0.6,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "adicional",
      headerName: "Adicional",
      flex: 0.7,
      valueGetter: (adicional: ProjectAdicional) => adicional.NUMERO,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "NOME",
      headerName: "Descrição",
      flex: 2,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "cliente",
      headerName: "Cliente",
      valueGetter: (client: Client) => client.NOMEFANTASIA || "", // ajusta de acordo com sua estrutura
      flex: 2,
    },
    {
      field: "projeto",
      headerName: "Projeto",
      valueGetter: (projeto: Project) => projeto?.DESCRICAO || "",
      flex: 1,
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      valueGetter: (responsable: ReducedUser) => responsable?.NOME || "",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      flex: 0.75,
      valueGetter: (status: OpportunityStatus) => status.NOME || "", // ajusta de acordo com sua estrutura
    },
    {
      field: "DATASOLICITACAO",
      headerName: "Solicitação",
      type: "date",
      flex: 1,
      valueGetter: (value) => {
        return getDateFromISOstring(value);
      },
    },
    {
      field: "DATAENTREGA",
      headerName: "Fechamento",
      type: "date",
      flex: 1,
      valueGetter: (value) => {
        return getDateFromISOstring(value);
      },
    },
    {
      field: "DATAINICIO",
      headerName: "Início",
      type: "date",
      flex: 1,
      valueGetter: (value) => {
        return getDateFromISOstring(value);
      },
    },

    {
      field: "VALORTOTAL",
      headerName: "Valor Total",
      type: "number",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (value) =>
        value
          ? `R$ ${Number(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`
          : "",
    },
  ];
    return {columns}
};
