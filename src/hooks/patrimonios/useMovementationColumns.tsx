import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useMemo } from 'react'
import { getDateFromISOstring } from '../../utils'
import DeleteIcon from '@mui/icons-material/Delete';
import { Project } from '../../models/Project';
import { ReducedUser } from '../../models/User';
import { calculateColumnWidth } from '../../utils/calculateColumnWidth';


const useMovementationColumns = (
  deletingMov : number | null,
  setDeletingMov : React.Dispatch<React.SetStateAction<number | null>>,
  permissionToDelete : boolean,
  rows: any[] = []
) => {
  // Calcula os widths uma única vez e memoriza
  const columnWidths = useMemo(() => {
    return {
      id_movimentacao: calculateColumnWidth(rows, "id_movimentacao", "ID", undefined, undefined, 80, 150),
      responsavel: calculateColumnWidth(rows, "responsavel", "Responsável", (user: ReducedUser) => user?.NOME || ''),
      projeto: calculateColumnWidth(rows, "projeto", "Projeto", (proj: Project) => proj?.DESCRICAO || ''),
      data: calculateColumnWidth(rows, "data", "Data", (date: string) => getDateFromISOstring(date || '')),
    };
  }, [rows]);
  const columns: GridColDef[] = useMemo(() => [
    {
      field: "id_movimentacao",
      headerName: "ID",
      width: columnWidths.id_movimentacao,
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
      width: columnWidths.responsavel,
      valueGetter: (responsavel: ReducedUser) =>
        responsavel ? responsavel.NOME : "",
    },
    {
      field: "projeto",
      headerName: "Projeto",
      width: columnWidths.projeto,
      valueGetter: (projeto: Project) => (projeto ? projeto.DESCRICAO : ""),
    },
    {
      field: "data",
      headerName: "Data",
      type: "date",
      width: columnWidths.data,
      valueGetter: (date: string) => (date ? getDateFromISOstring(date) : ""),
      // valueFormatter: (value: any) =>
      //   value ? getDateStringFromISOstring(value) : "",
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
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
  ], [columnWidths, deletingMov, setDeletingMov, permissionToDelete]);

  return { columns };
};

export default useMovementationColumns