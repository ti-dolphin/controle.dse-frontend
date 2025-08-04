import { GridColDef } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { OpportunityStatus } from "../../models/oportunidades/OpportunityStatus";
import { Client } from "../../models/oportunidades/Client";
import { ProjectAdicional } from "../../models/oportunidades/ProjectAdicional";
import { Box, Typography } from "@mui/material";
import { getDateFromISOstring } from "../../utils";
import { last } from "lodash";




export const useOpportunityColumns = ( ) =>  {
  const columns: any[] = [
    {
      field: "CODOS",
      headerName: "Nº OS",
      flex: 0.8,
      depth: 0,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography fontSize="small" fontWeight="bold" color="primary.main">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "ID_PROJETO",
      headerName: "Projeto",
      flex: 0.6,
      depth: 0,
      renderCell: (params: any) => (
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
      depth: 1,
      lastChildKey: 'NUMERO',
      renderCell: (params: any) => (
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
      depth: 0,
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
      depth: 1,
      lastChildKey: 'NOMEFANTASIA',
      valueGetter: (client: Client) => client.NOMEFANTASIA || "", // ajusta de acordo com sua estrutura
      flex: 2,
    },
    {
      field: "projeto",
      headerName: "Projeto",
      depth: 1,
      lastChildKey: 'DESCRICAO',

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
      depth: 1,
      lastChildKey: 'NOME',
      flex: 0.75,
      valueGetter: (status: OpportunityStatus) => status.NOME || "", // ajusta de acordo com sua estrutura
    },
    {
      field: "DATASOLICITACAO",
      headerName: "Solicitação",
      type: "date",
      depth: 0,
      flex: 1,
      valueGetter: (value: any) => {
        return getDateFromISOstring(value);
      },
    },
    {
      field: "DATAENTREGA",
      headerName: "Fechamento",
      type: "date",
      flex: 1,
      valueGetter: (value: any) => {
        return getDateFromISOstring(value);
      },
    },
    {
      field: "DATAINICIO",
      headerName: "Início",
      type: "date",
      flex: 1,
      valueGetter: (value: any) => {
        return getDateFromISOstring(value);
      },
    },

    {
      field: "VALOR_TOTAL",
      headerName: "Valor Total",
      type: "number",
      flex: 1,
      depth: 0,
      align: "right",
      headerAlign: "right",

      valueGetter: (value: any) =>
        value
          ? `R$ ${Number(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`
          : "",
    },
  ];
    return {columns}
};
