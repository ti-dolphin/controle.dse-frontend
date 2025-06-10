import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

// Exemplo de páginas

const AppRoutes = () => (
  <Routes>
     <Route path="/auth" element={<AuthPage />} />








     
    {/* <Route path="/requisicoes" element={<RequisicoesHome />} /> */}
    {/* <Route path="/requisicoes/lista" element={<RequisitionListPage />} /> */}
    {/* <Route path="/requisicoes/:id" element={<RequisitionDetailPage />} /> */}
    {/* <Route path="/requisicoes/:id/quote" element={<QuoteDetailPage />} /> */}

    {/* Patrimônios */}
    {/* <Route path="/patrimonios" element={<PatrimoniosHome />} /> */}
    {/* <Route path="/patrimonios/lista" element={<PatrimonyListPage />} /> */}
    {/* <Route path="/patrimonios/:id" element={<PatrimonyDetailPage />} /> */}
    {/* <Route path="/patrimonios/:id/checklists" element={<ChecklistListPage />} /> */}

    {/* Oportunidades */}
    {/* <Route path="/oportunidades" element={<OportunityListPage />} /> */}
    {/* <Route path="/oportunidades/:id" element={<OportunityDetailPage />} /> */}
    {/* <Route path="/oportunidades/novo" element={<OpportunityCreationModal />} /> */}
    {/* <Route path="/oportunidades/form" element={<OpportunityForm />} /> */}
  </Routes>
);

export default AppRoutes;
