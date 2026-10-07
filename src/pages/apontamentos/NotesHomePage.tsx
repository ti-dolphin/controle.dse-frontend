import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setRefreshNotes } from "../../redux/slices/apontamentos/notesTableSlice";
import { Box, Tabs, Tab } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import UpperNavigation from "../../components/shared/UpperNavigation";
import BaseToolBar from "../../components/shared/BaseToolBar";
import ApontarDialog from "../../components/apontamentos/ApontarDialog";
import ApontamentosTab from "../../components/apontamentos/tabs/ApontamentosTab";
import PontoTab from "../../components/apontamentos/tabs/PontoTab";
import ProblemasTab from "../../components/apontamentos/tabs/ProblemasTab";
import CandidatesTab from "../../components/apontamentos/tabs/CandidatesTab";

const NotesHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedApontamentos, setSelectedApontamentos] = useState<GridRowSelectionModel>([]);
  const [apontarDialogOpen, setApontarDialogOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const { refreshNotes, rows } = useSelector((state: RootState) => state.notesTable);
  const canManageCandidates = Number(user?.PERM_ADMINISTRADOR) === 1;

  // Buscar dados do apontamento selecionado se houver apenas 1
  const selectedNote = useMemo(() => {
    if (selectedApontamentos.length === 1) {
      return rows.find((row) => row.CODAPONT === Number(selectedApontamentos[0]));
    }
    return undefined;
  }, [selectedApontamentos, rows]);

  // Dados (CODAPONT, DATA, CHAPA) de todos os apontamentos selecionados, para o back verificar apontamentos de hoje
  const selectedNotes = useMemo(() => {
    const selectedIds = selectedApontamentos.map((id) => Number(id));
    return rows.filter((row) => selectedIds.includes(row.CODAPONT));
  }, [selectedApontamentos, rows]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleApontarDialogClose = () => {
    setSelectedApontamentos([]);
    setApontarDialogOpen(false);
  };

  const handleApontarDialogSuccess = () => {
    handleApontarDialogClose();
    setActiveTab(0);
    dispatch(setRefreshNotes(!refreshNotes));
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box
        sx={{
          height: "calc(100% - 40px)",
          display: "flex",
          flexDirection: "column",
        }}
      >

        <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                fontSize: 12,
                textTransform: "none",
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Apontamento" />
            <Tab label="Ponto" />
            <Tab label="Problemas" />
            {canManageCandidates && <Tab label="Candidatos" />}
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <ApontamentosTab
            selectedApontamentos={selectedApontamentos}
            onSelectionChange={setSelectedApontamentos}
            onApontarClick={() => setApontarDialogOpen(true)}
          />
        )}

        {activeTab === 1 && <PontoTab />}

        {activeTab === 2 && <ProblemasTab />}

        {canManageCandidates && activeTab === 3 && <CandidatesTab />}
      </Box>

      <ApontarDialog
        open={apontarDialogOpen}
        onClose={handleApontarDialogClose}
        selectedCodaponts={selectedApontamentos.map((id) => Number(id))}
        userName={user?.LOGIN || "SISTEMA"}
        onSuccess={handleApontarDialogSuccess}
        selectedNote={selectedNote}
        selectedNotes={selectedNotes}
      />
    </Box>
  );
};

export default NotesHomePage;
