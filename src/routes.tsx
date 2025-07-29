import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import HomePage from "./pages/HomePage";
import PatrimonyHomePage from "./pages/patrimonios/PatrimonyHomePage";
import RequisitionHomePage from "./pages/requisicoes/RequisitionHomePage";
import RequisitionDetailPage from "./pages/requisicoes/RequisitionDetailPage";
import QuoteDetailPage from "./pages/requisicoes/QuoteDetalPage";
import OpportunityHomePage from "./pages/oportunidades/OpportunityHomePage";
import OportunityDetailPage from "./pages/oportunidades/OpportunityDetailPage";
// Exemplo de páginas
const AppRoutes = () => { 
  return (
    <Routes>
      <Route path={ "/auth"} element={<AuthPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/requisicoes" element={<RequisitionHomePage />} />
      {/* <Route path="/requisicoes/lista" element={<RequisitionListPage />} /> */}
      <Route path="/requisicoes/:id_requisicao" element={<RequisitionDetailPage />} />
      <Route path="/requisicoes/:id/cotacao/:id_cotacao" element={<QuoteDetailPage />} />
      <Route path="/supplier/requisicoes/:id/cotacao/:id_cotacao" element={<QuoteDetailPage />} />
      {/* Patrimônios */}
      <Route path="/patrimonios" element={<PatrimonyHomePage />} />
      {/* <Route path="/patrimonios/lista" element={<PatrimonyListPage />} /> */}
      {/* <Route path="/patrimonios/:id" element={<PatrimonyDetailPage />} /> */}
      {/* <Route path="/patrimonios/:id/checklists" element={<ChecklistListPage />} /> */}

      {/* Oportunidades */}
      <Route path="/oportunidades" element={<OpportunityHomePage />} />
      <Route path="/oportunidades/:CODOS" element={<OportunityDetailPage />} />
      {/* <Route path="/oportunidades/novo" element={<OpportunityCreationModal />} /> */}
      {/* <Route path="/oportunidades/form" element={<OpportunityForm />} /> */}
    </Routes>
  );
};

export default AppRoutes;
