import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import UpperNavigation from "../../components/shared/UpperNavigation";
import { useNavigate } from "react-router-dom";
import OpportunityTableComponent from "../../components/oportunidades/OpportunityTableComponent";
import OpportunityKanbanComponent from "../../components/oportunidades/OpportunityKanbanComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const OpportunityListPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const canViewOrcamento =
    Number(user?.PERM_CRM) === 1 || Number(user?.PERM_ADMINISTRADOR) === 1;

  const [activeTab, setActiveTab] = useState(0);
  const visibleTab = activeTab === 2 && !canViewOrcamento ? 0 : activeTab;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <UpperNavigation handleBack={() => navigate("/")}/>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >

        <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}>
          <Tabs
            value={visibleTab}
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
            <Tab label="Tabela" />
            <Tab label="Comercial" />
            {canViewOrcamento && <Tab label="Orçamento" />}
          </Tabs>
        </Box>

        {visibleTab === 0 && <OpportunityTableComponent />}
        {visibleTab === 1 && <OpportunityKanbanComponent board="Comercial" />}
        {visibleTab === 2 && canViewOrcamento && <OpportunityKanbanComponent board="Orçamento" />}
      </Box>
    </Box>

  );
};

export default OpportunityListPage;
