import { GridColDef } from "@mui/x-data-grid";
import { parseDate } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { cloneDeep } from "lodash";

export const useRequisitionItemColumns = () => {
  const {updatingRecentProductsQuantity} = useSelector((state: RootState) => state.requisitionItem)
  const columns: GridColDef[] = [
    {
      field: "id_item_requisicao",
      headerName: "ID",
      type: "number",
      flex: 0.2,
    },
    {
      field: "produto_codigo",
      headerName: "Código Produto",
      type: "string",
      flex: 0.5,
    },
    {
      field: "produto_descricao",
      headerName: "Descrição",
      type: "string",
      flex: 1,
    },
    {
      field: "quantidade",
      headerName: "Quantidade",
      type: "number",
      editable: true,
      flex: 0.5,
    },
    {
      field: "data_entrega",
      headerName: "Data de entrega",
      width: 150,
      type: "date",
      editable: true,
      flex: 0.5,
      valueGetter: (data_entrega: string) =>
        data_entrega ? parseDate(data_entrega) : null,
    },
    {
      field: "produto_unidade",
      headerName: "Unidade",
      flex: 0.4,
      type: "string",
    },
    {
      field: "produto_quantidade_estoque",
      headerName: "Quantidade em estoque",
      width: 150,
      type: "number",
      flex: 0.4,
    },
    {
      field: "oc",
      headerName: "OC",
      editable: true,
      type: "string",
      valueGetter: (oc: string) => oc || "",
      flex: 0.4,
    },
    {
      field: "observacao",
      headerName: "Observação",
      type: "string",
      editable: true,
      valueGetter: (observacao: string) => observacao || "N/A",
      flex: 1.5,
    },
  ];

  if(updatingRecentProductsQuantity){ 
    const selectedColumns = ['produto_descricao', 'quantidade'];
    return {
      columns: columns.filter((col) => selectedColumns.includes(col.field)),
    };
  }
  return { columns };
};
