import { GridColDef } from "@mui/x-data-grid";
import { Project } from "../../models/Project";
import { ReducedUser } from "../../models/User";
import { OpportunityStatus } from "../../models/oportunidades/OpportunityStatus";
import { Client } from "../../models/oportunidades/Client";




export const useOpportunityColumns = ( ) =>  {
   const columns : GridColDef[]  = [
     {
    field: 'NOME',
    headerName: 'Oportunidade',
    flex: 2,
    minWidth: 170,
  }, 
  {
    field: 'cliente',
    headerName: 'Cliente',
    valueGetter: (client : Client) => client.NOMEFANTASIA|| '', // ajusta de acordo com sua estrutura
    flex: 2,
    minWidth: 170,
  },
  {
    field: 'projeto',
    headerName: 'Projeto',
    valueGetter: (projeto : Project) => projeto?.DESCRICAO || '',
    flex: 2,
    minWidth: 170,
  },
  {
    field: 'gerente',
    headerName: 'Responsável',
    valueGetter: (gerente : ReducedUser) => gerente?.NOME || '',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'DATASOLICITACAO',
    headerName: 'Data Solicitação',
    type: 'date',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'DATAPREVENTREGA',
    headerName: 'Previsão Entrega',
    type: 'date',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'number',
    flex: 1,
    minWidth: 90,
    valueGetter: (status : OpportunityStatus) => status.NOME || '', // ajusta de acordo com sua estrutura
  },
  {
    field: 'VALORTOTAL',
    headerName: 'Valor Total',
    type: 'number',
    flex: 1,
    minWidth: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (params : any) =>
      params.value ? `R$ ${Number(params.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
  }
]
     
    return {columns}
};