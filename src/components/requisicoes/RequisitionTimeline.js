import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RequisitionStatusService from "../../services/requisicoes/RequisitionStatusService";
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider, } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { getDateStringFromISOstring } from "../../utils";
const RequisitionTimeline = () => {
    const dispatch = useDispatch();
    const requisition = useSelector((state) => state.requisition.requisition);
    const [alterations, setAlterations] = useState([]);
    const fetchData = async () => {
        try {
            const data = await RequisitionStatusService.getStatusAlterationsByRequisitionId(requisition.ID_REQUISICAO);
            setAlterations(data);
        }
        catch (error) {
            dispatch(setFeedback({
                type: 'error',
                message: 'Erro ao buscar histórico de status'
            }));
        }
    };
    useEffect(() => {
        if (requisition?.ID_REQUISICAO) {
            fetchData();
        }
    }, [requisition]);
    // Função para formatar a data
    return (_jsx(Box, { sx: { maxWidth: 600, maxHeight: 120, overflow: 'auto', mx: "auto", my: 2 }, children: _jsx(List, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: alterations.length > 0 ? (alterations.map((alteration, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { sx: {
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            pl: 6,
                            height: 30,
                        }, children: [_jsx(ListItemIcon, { sx: {
                                    position: "absolute",
                                    left: 8,
                                    top: 8,
                                }, children: _jsx(CircleIcon, { sx: {
                                        fontSize: 12,
                                        color: index === 0 ? "primary.main" : "grey.500",
                                    } }) }), index < alterations.length - 1 && (_jsx(Box, { sx: {
                                    position: "absolute",
                                    left: 11,
                                    top: 20,
                                    bottom: -20,
                                    width: 2,
                                    bgcolor: "grey.300",
                                } })), _jsx(ListItemText, { primary: _jsx(Typography, { fontSize: "small", children: `${alteration.pessoa_alterado_por?.NOME} ${alteration.transicao?.nome_transicao}` }), secondary: _jsxs(Box, { children: [_jsx(Typography, { fontSize: "small", children: getDateStringFromISOstring(alteration.data_alteracao) }), alteration.justificativa && (_jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 0.5 }, children: ["Justificativa: ", alteration.justificativa] }))] }) })] }), index < alterations.length - 1 && _jsx(Divider, {})] }, alteration.id_alteracao)))) : (_jsx(ListItem, { children: _jsx(ListItemText, { primary: _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { textAlign: "center" }, children: "Nenhuma altera\u00E7\u00E3o de status encontrada." }) }) })) }) }));
};
export default RequisitionTimeline;
