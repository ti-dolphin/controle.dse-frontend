import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { getDateFromISOstring } from '../../utils'
import DeleteIcon from '@mui/icons-material/Delete';
import { Project } from '../../models/Project';
import { ReducedUser } from '../../models/User';


const useMovementationColumns = (deletingMov : number | null, setDeletingMov : React.Dispatch<React.SetStateAction<number | null>>, permissionToDelete : boolean) => {
  console.log("deletingMov", deletingMov);
  const columns: GridColDef[] = [
    {
      field: "id_movimentacao",
      headerName: "ID",
      minWidth: 100,
      flex: 0.4,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Typography fontSize="small" fontWeight="bold" color="black">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      minWidth: 200,
      flex: 0.6,
      valueGetter: (responsavel: ReducedUser) =>
        responsavel ? responsavel.NOME : "",
    },
    {
      field: "projeto",
      headerName: "Projeto",
      minWidth: 300,
      flex: 1.5,
      valueGetter: (projeto: Project) => (projeto ? projeto.DESCRICAO : ""),
    },
    {
      field: "data",
      headerName: "Data",
      flex: 0.6,
      type: "date",
      minWidth: 100,
      valueGetter: (date: string) => (date ? getDateFromISOstring(date) : ""),
      // valueFormatter: (value: any) =>
      //   value ? getDateStringFromISOstring(value) : "",
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.2,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <IconButton
            disabled={!permissionToDelete}
            onClick={() => {
              setDeletingMov(Number(params.row.id_movimentacao));
            }}
          >
            <DeleteIcon color={permissionToDelete ? "error" : "disabled"} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return { columns };
};

export default useMovementationColumns