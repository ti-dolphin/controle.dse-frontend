import styled from "@emotion/styled";
import { DataGrid } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)<{ theme: Theme }>(({ theme }) => ({
  border: "none",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px 0 rgba(34, 40, 49, 0.08)",
  fontFamily: "Roboto, Arial, sans-serif",
  "& .MuiDataGrid-columnHeaders": {
    background: "#F5F6FA",
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: "0.9rem",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  "& .MuiDataGrid-row": {
    background: "#fff",
    transition: "background 0.2s",
    cursor: 'pointer',
    "&:hover": {
      background: "#F7F8FC",
    },
  },
  "& .MuiDataGrid-cell": {
    fontSize: "0.8rem",
    fontWeight: 'light',
    color: theme.palette.text.secondary,
    borderBottom: "1px solid #F0F0F0",
  },
  "& .MuiDataGrid-footerContainer": {
    background: "#F5F6FA",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  "& .MuiDataGrid-selectedRowCount": {
    visibility: "hidden",
  },
  "& .MuiDataGrid-virtualScroller": {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
}));
export default StyledDataGrid;