import styled from "@emotion/styled";
import { DataGrid } from "@mui/x-data-grid";
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: "none",
    background: "#fff",
    borderRadius: 0,
    boxShadow: "0 4px 24px 0 rgba(34, 40, 49, 0.08)",
    fontFamily: "Roboto, Arial, sans-serif",
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#e7eaf6",
        "& .MuiDataGrid-columnHeader": {
            backgroundColor: 'white',
        },
        color: theme.palette.primary.main,
        fontSize: "0.9rem",
        fontWeight: "bold",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    "& .MuiDataGrid-row": {
        background: "#fff",
        transition: "background 0.2s",
        cursor: "pointer",
        "&:hover": {
            background: "#F7F8FC",
        },
    },
    "& .MuiDataGrid-cell": {
        fontSize: "12px",
        fontWeight: "500",
        color: theme.palette.text.primary,
        borderBottom: "1px solid #F0F0F0",
    },
    "& .MuiDataGrid-footerContainer": {
        background: "#F5F6FA",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    "& .MuiDataGrid-selectedRowCount": {
        visibility: "hidden",
    },
    "& .MuiDataGrid-virtualScroller": {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
}));
export default StyledDataGrid;
