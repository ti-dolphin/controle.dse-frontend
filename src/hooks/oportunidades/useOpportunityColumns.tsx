import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { OpportunityStatus } from "../../models/oportunidades/OpportunityStatus";
import { Client } from "../../models/oportunidades/Client";
import { ProjectAdicional } from "../../models/oportunidades/ProjectAdicional";
import { Box, Typography } from "@mui/material";
import { getDateFromISOstring } from "../../utils";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";



export const useOpportunityColumns = ( ) =>  {
  const columns:any = [
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
      flex: 1.5,
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
      field: 'DATAINTERACAO',
      headerName: 'Interação',
      flex: 1,
      sortable: true,
      type: "date",
      valueGetter: (value: any) => {
        return getDateFromISOstring(value);
      }
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
    { 
      field: 'situacao',
      headerName: 'Situação',
      flex: 0.5,
      sortable: true,
      valueParser: (value: any) => { 
        const valueOrderMap : any = { 
          expirada : 1,
          expirando: 2,
          ativa: 3,
        }
        return valueOrderMap[value];
      },
      renderCell: (params: any) =>  { 
        const iconMap : any = { 
          expirada : <ErrorIcon color="error"/>,
          expirando: <InfoIcon color="warning"/>,
          ativa: <CheckCircleIcon color="success"/>,
        }

        return <Box sx={{display: "flex", alignItems: "center", height: "100%"}}>{iconMap[params.value]}</Box>;
      },
    }
  ];
    return {columns}
};
