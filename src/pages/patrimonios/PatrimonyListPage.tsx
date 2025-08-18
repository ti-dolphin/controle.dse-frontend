import React, {  useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  buildPatrimonyPrismaFilters,
  cleanFilters,
  deleteSingleRow,
  setFilters,
  setIsLoading,
  setPatrimonyBeingDeleted,
  setRows,
  setSearch,
} from "../../redux/slices/patrimonios/PatrimonyTableSlice";
import MovementationService from "../../services/patrimonios/MovementationService";
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { usePatMovementationColumns } from "../../hooks/patrimonios/usePatMovementationColumns";
import { useTheme } from "@mui/material/styles";
import BaseTableToolBar from "../../components/shared/BaseTableToolBar";
import BaseTableColumnFilters from "../../components/shared/BaseTableColumnFilters";
import BaseDataTable from "../../components/shared/BaseDataTable";
import { debounce, filter } from "lodash";
import { useGridApiRef } from "@mui/x-data-grid";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../components/shared/UpperNavigation";
import PatrimonyForm from "../../components/patrimonios/PatrimonyForm";
import { BaseAddButton } from "../../components/shared/BaseAddButton";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BaseDeleteDialog from "../../components/shared/BaseDeleteDialog";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
import { useChecklistNotifications } from "../../hooks/patrimonios/useChecklistNotifications";
import { useIsMobile } from "../../hooks/useIsMobile";
import { FixedSizeGrid } from "react-window";
import PatrimonyCard from "../../components/patrimonios/PatrimonyCard";


const PatrimonyListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const { rows, isLoading, filters, search, patrimonyBeingDeleted } = useSelector((state: RootState) => state.patrionyTable);
  const [creating, setCreating] = React.useState(false);
  const { isMobile } = useIsMobile();
  const {notifications} = useChecklistNotifications(); 
  const { columns } = usePatMovementationColumns();
  const gridRef = useGridApiRef();

  const handleBack = () => {
    navigate("/");
  };

  const navigateToPatrimonyDetail = (params: any) => {
    if (params.field === "actions") return;
    navigate(`/patrimonios/${params.row.id_patrimonio}`);
  };

  const handleChangeSearchTerm = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      dispatch(setSearch(value.toLowerCase()));
    },
    [dispatch, filter]
  );

  const handleChangeFilters = React.useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: string
    ) => {
      let value: any = e.target.value;
      if (value && !isNaN(Number(value)) && value.trim() !== "") {
        value = Number(value);
      }

      dispatch(setFilters({ ...filters, [field]: value }));
    },
    [dispatch, filters]
  );

  const deletePatrimony = async () => {
    if (!patrimonyBeingDeleted) return;
    try {
      const deleted = await PatrimonyService.delete(
        patrimonyBeingDeleted.id_patrimonio || 0
      );
      if (deleted) {
        dispatch(setPatrimonyBeingDeleted(null));
        dispatch(deleteSingleRow(patrimonyBeingDeleted.id_patrimonio));
        dispatch(
          setFeedback({
            message: "Patrimônio deletado com sucesso",
            type: "success",
          })
        );
      }
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: "Houve um erro ao deletar o patrimônio",
          type: "error",
        })
      );
    }
  };

  const debouncedHandleChangeSearchTerm = useMemo(() => {
    return debounce(handleChangeSearchTerm, 500);
  }, [handleChangeSearchTerm, filters]);

  const handleCleanFilter = () => {
    // Implement filter cleaning logic here
    dispatch(cleanFilters());
  };

  const fetchData = React.useCallback(async () => {
    dispatch(setIsLoading(true));
    try {
      const prismaFilters = buildPatrimonyPrismaFilters(filters);

      const data = await MovementationService.getMany({
        from: "patrimonios",
        search,
        prismaFilters,
      });

      dispatch(setRows(data));
      dispatch(setIsLoading(false));
    } catch (e: any) {
      dispatch(setIsLoading(false));
      dispatch(
        setFeedback({
          message: "Houve um erro ao buscar requisições",
          type: "error",
        })
      );
    }
  }, [dispatch, user, search, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function debouncedSetTriggerFetch(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box
        sx={{
          height: "94%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BaseTableToolBar
          handleChangeSearchTerm={debouncedHandleChangeSearchTerm}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            {!isMobile && (
              <Button variant="contained" onClick={handleCleanFilter}>
                Limpar filtros
              </Button>
            )}
            <BaseAddButton handleOpen={() => setCreating(true)} />
            <IconButton
              onClick={() => navigate("/patrimonios/checklists")}
              sx={{
                color: "primary.main",
                width: 32,
                height: 34,
              }}
            >
              <Badge badgeContent={notifications} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Stack>
        </BaseTableToolBar>

        {isMobile && (
          <FixedSizeGrid
            columnCount={1}
            columnWidth={280}
            rowCount={rows.length}
            rowHeight={310}
            height={600}
            width={300}
          >
            {({ columnIndex, rowIndex, style }) => {
              const row = rows[rowIndex];
              return (
                <PatrimonyCard
                  styles={style}
                  key={row.id_movimentacao}
                  patrimonyMov={row}
                />
              );
            }}
          </FixedSizeGrid>
        )}

        {!isMobile && (
          <BaseTableColumnFilters
            columns={columns}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
            debouncedSetTriggerFetch={debouncedSetTriggerFetch}
          />
        )}
        {!isMobile && (
          <BaseDataTable
            apiRef={gridRef}
            onCellClick={navigateToPatrimonyDetail}
            rows={rows}
            disableColumnMenu
            disableColumnFilter
            rowHeight={40}
            columns={columns}
            loading={isLoading}
            getRowId={(row: any) => row.id_movimentacao}
            theme={theme}
          />
        )}
      </Box>

      <Dialog open={creating}>
        <DialogTitle>
          <Typography variant="h6" color="primary">
            Criar patrimonônio
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: {
              xs: "100%",
              sm: "500px",
              md: "400px",
            },
          }}
        >
          <IconButton
            onClick={() => setCreating(false)}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon color="error" />
          </IconButton>
          <PatrimonyForm />
        </DialogContent>
      </Dialog>

      <BaseDeleteDialog
        open={patrimonyBeingDeleted !== null}
        onCancel={() => {
          dispatch(setPatrimonyBeingDeleted(null));
        }}
        onConfirm={() => deletePatrimony()}
      />
    </Box>
  );
};

export default PatrimonyListPage;
