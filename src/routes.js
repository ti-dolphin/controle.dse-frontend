import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PatrimonyHomePage from "./pages/patrimonios/PatrimonyHomePage";
import RequisitionHomePage from "./pages/requisicoes/RequisitionHomePage";
import RequisitionDetailPage from "./pages/requisicoes/RequisitionDetailPage";
import QuoteDetailPage from "./pages/requisicoes/QuoteDetalPage";
import OpportunityHomePage from "./pages/oportunidades/OpportunityHomePage";
import OportunityDetailPage from "./pages/oportunidades/OpportunityDetailPage";
import PatrimonyDetailPage from "./pages/patrimonios/PatrimonyDetailPage";
import ChecklistListPage from "./pages/patrimonios/ChecklistListListPage";
import AdminPage from "./pages/AdminPage";
// Exemplo de páginas
const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/requisicoes", element: _jsx(RequisitionHomePage, {}) }), _jsx(Route, { path: "/requisicoes/:id_requisicao", element: _jsx(RequisitionDetailPage, {}) }), _jsx(Route, { path: "/requisicoes/:id/cotacao/:id_cotacao", element: _jsx(QuoteDetailPage, {}) }), _jsx(Route, { path: "/supplier/requisicoes/:id/cotacao/:id_cotacao", element: _jsx(QuoteDetailPage, {}) }), _jsx(Route, { path: "/patrimonios", element: _jsx(PatrimonyHomePage, {}) }), _jsx(Route, { path: "/patrimonios/:id_patrimonio", element: _jsx(PatrimonyDetailPage, {}) }), _jsx(Route, { path: "/patrimonios/checklists", element: _jsx(ChecklistListPage, {}) }), _jsx(Route, { path: "/oportunidades", element: _jsx(OpportunityHomePage, {}) }), _jsx(Route, { path: "/oportunidades/:CODOS", element: _jsx(OportunityDetailPage, {}) })] }));
};
export default AppRoutes;
