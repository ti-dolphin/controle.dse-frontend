import { GridColDef } from "@mui/x-data-grid";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export const useProductColumns = ( ) => { 
    const replacingItemProduct = useSelector((state: RootState) => state.requisitionItem.replacingItemProduct);
    const columns: GridColDef[] = [
      {
        field: "ID",
        headerName: "ID",
        type: "number",
        flex: 0.2,
        editable: false,
      },
      {
        field: "codigo",
        headerName: "Código Produto",
        type: "string",
        flex: 0.5,
        editable: false,
        valueGetter: (value) => value || "",
      },
      {
        field: "descricao",
        headerName: "Descrição",
        type: "string",
        flex: 1,
        editable: true,
        valueGetter: (value) => value || "",
      },
      {
        field: "unidade",
        headerName: "Unidade",
        type: "string",
        flex: 0.4,
        editable: true,
        valueGetter: (value) => value || "",
      },
      {
        field: "quantidade_estoque",
        headerName: "Quantidade em Estoque",
        type: "number",
        flex: 0.4,
        editable: true,
        valueGetter: (value) => value || 0,
      },
    ];
    return { columns };
}