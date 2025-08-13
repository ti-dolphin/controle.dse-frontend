import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Grid, Paper, Typography, Box, TextField, Autocomplete, Stack, Button, } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import OpportunityService from "../../services/oportunidades/OpportunityService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useOppDetailedFields } from "../../hooks/oportunidades/useOppDetailedFields";
import { formatCurrency, formatDateStringtoISOstring, getDateStringFromISOstring, } from "../../utils";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
const OpportunityDetailedForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [opportunity, setOpportunity] = useState({});
    const [formData, setFormData] = useState({});
    const { fieldsMap } = useOppDetailedFields(user, opportunity);
    const [deletingOpp, setDeletingOpp] = useState(null);
    const { CODOS } = useParams();
    const saveOpp = async () => {
        if (!CODOS)
            return;
        try {
            const opp = await OpportunityService.update(Number(CODOS), formData);
            setOpportunity(opp);
            dispatch(setFeedback({ message: "Oportunidade salva com sucesso", type: "success" }));
        }
        catch (error) {
            setFeedback({ message: "Erro ao salvar oportunidade", type: "error" });
        }
    };
    const handleTextFieldChange = (field, value, fieldMapKey) => {
        const updatedOpp = { ...opportunity, [field.field]: value };
        const fields = fieldsMap.get(fieldMapKey)?.map((f) => f.field);
        let payload = { ...formData };
        if (fieldMapKey === "datas") {
            fields?.forEach((f) => {
                payload = {
                    ...payload,
                    [f]: formatDateStringtoISOstring(String(updatedOpp[f])),
                };
            });
            setFormData(payload);
            setOpportunity(updatedOpp);
            // debouncedSave(payload);
            return;
        }
        fields?.forEach((f) => {
            payload = { ...payload, [f]: updatedOpp[f] };
        });
        setFormData(payload);
        setOpportunity(updatedOpp);
        // debouncedSave(payload);
    };
    const handleAutocompleteChange = (field, option, fieldMapKey) => {
        if (!option)
            return;
        const updatedOpp = { ...opportunity, [field]: option.id };
        const fields = fieldsMap.get(fieldMapKey)?.map((f) => f.field);
        let payload = { ...formData };
        fields?.forEach((f) => {
            payload = { ...payload, [f]: updatedOpp[f] };
        });
        setFormData(payload);
        setOpportunity(updatedOpp);
        // debouncedSave(payload);
    };
    const handleDelete = async () => {
        if (!deletingOpp?.CODOS)
            return;
        try {
            await OpportunityService.delete(deletingOpp.CODOS);
            navigate("/oportunidades");
        }
        catch (e) {
            setDeletingOpp(null);
            dispatch(setFeedback({
                message: 'Erro ao deletar oportunidade',
                type: 'error'
            }));
        }
    };
    useEffect(() => {
        const fetchOpportunity = async () => {
            if (!CODOS)
                return;
            try {
                const opportunity = await OpportunityService.getById(Number(CODOS));
                setOpportunity(opportunity);
            }
            catch (e) {
                dispatch(setFeedback({
                    message: "Erro ao buscar oportunidade",
                    type: "error",
                }));
            }
        };
        fetchOpportunity();
    }, [CODOS, dispatch]);
    return (_jsxs(Grid, { container: true, spacing: 1, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 1, borderRadius: 1, height: "100%" }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: "bold", sx: { mb: 1 }, children: "Cadastro" }), _jsx(Grid, { container: true, gap: 2, children: fieldsMap?.get("cadastro")?.map((field) => {
                                if (field.type === "autocomplete" && field.options) {
                                    return (_jsx(Grid, { item: true, xs: 12, children: _jsx(Autocomplete, { options: field.options, getOptionLabel: (option) => option?.name || "", getOptionKey: (option) => option?.id || "", "aria-required": field.required, slotProps: {
                                                popper: { sx: { fontSize: 13 } },
                                                paper: { sx: { fontSize: 13 } },
                                            }, fullWidth: true, "aria-label": field.label, value: field.options.find((option) => option.id ===
                                                opportunity[field.field]), onChange: (_e, value) => handleAutocompleteChange(field.field, value, "cadastro"), renderInput: (params) => (_jsx(TextField, { ...params, InputLabelProps: {
                                                    shrink: true,
                                                    sx: {
                                                        fontSize: 14,
                                                        color: "text.secondary",
                                                        fontWeight: "bold",
                                                    },
                                                }, label: field.label, variant: "outlined", fullWidth: true, required: field.required, size: "small" })) }, field.field) }, field.field));
                                }
                                return (_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { required: field.required, fullWidth: true, onChange: (e) => handleTextFieldChange(field, e.target.value, "cadastro"), name: field.field, InputLabelProps: {
                                            shrink: true,
                                            sx: {
                                                fontSize: 14,
                                                color: "text.secondary",
                                                fontWeight: "bold",
                                            },
                                        }, label: field.label, variant: "outlined", type: field.type, disabled: field.disabled, value: opportunity[field.field], size: "small" }, field.field) }, field.field));
                            }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 1, borderRadius: 1, height: "100%" }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: "bold", sx: { mb: 1 }, children: "Datas" }), _jsx(Grid, { container: true, gap: 2, children: fieldsMap?.get("datas")?.map((field) => {
                                const value = getDateStringFromISOstring(String(opportunity[field.field]));
                                if (field.field === "DATAINTERACAO" &&
                                    opportunity.status?.ACAO === 1)
                                    return null;
                                return (_jsxs(Grid, { item: true, xs: 12, children: [field.field === "DATAINTERACAO" &&
                                            opportunity.status?.ACAO !== 1 && (_jsx(Typography, { color: "text.secondary", fontWeight: "bold", fontSize: 13, sx: { mb: 2 }, children: "Pr\u00F3xima data de intera\u00E7\u00E3o com o cliente" })), _jsx(TextField, { required: field.required, fullWidth: true, onChange: (e) => handleTextFieldChange(field, e.target.value, "datas"), name: field.field, InputLabelProps: {
                                                shrink: true,
                                                sx: {
                                                    fontSize: 14,
                                                    color: "text.secondary",
                                                    fontWeight: "bold",
                                                },
                                            }, label: field.label, variant: "outlined", type: field.type, disabled: field.disabled, value: value, size: "small" }, field.field)] }, field.field));
                            }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 1, borderRadius: 1, height: "100%" }, children: [_jsx(Typography, { variant: "subtitle1", color: "primary.main", fontWeight: "bold", sx: { mb: 1 }, children: "Venda" }), _jsxs(Grid, { container: true, gap: 2, sx: { mt: 1 }, children: [fieldsMap?.get("venda")?.map((field) => {
                                    if (field.type === "autocomplete" && field.options) {
                                        return (_jsx(Grid, { item: true, xs: 12, children: _jsx(Autocomplete, { options: field.options, getOptionLabel: (option) => option?.name || "", getOptionKey: (option) => option?.id || "", "aria-required": field.required, slotProps: {
                                                    popper: { sx: { fontSize: 13 } },
                                                    paper: { sx: { fontSize: 13 } },
                                                }, fullWidth: true, "aria-label": field.label, value: field.options.find((option) => option.id ===
                                                    opportunity[field.field]), onChange: (_e, value) => handleAutocompleteChange(field.field, value, "venda"), renderInput: (params) => (_jsx(TextField, { ...params, InputLabelProps: {
                                                        shrink: true,
                                                        sx: {
                                                            fontSize: 14,
                                                            color: "text.secondary",
                                                            fontWeight: "bold",
                                                        },
                                                    }, label: field.label, variant: "outlined", required: field.required, size: "small" })) }, field.field) }, field.field));
                                    }
                                    return (_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { required: field.required, fullWidth: true, onChange: (e) => handleTextFieldChange(field, e.target.value, "venda"), name: field.field, InputLabelProps: {
                                                shrink: true,
                                                sx: {
                                                    fontSize: 14,
                                                    color: "text.secondary",
                                                    fontWeight: "bold",
                                                },
                                            }, label: field.label, variant: "outlined", type: field.type, disabled: field.disabled, value: opportunity[field.field], size: "small" }, field.field) }, field.field));
                                }), _jsxs(Stack, { direction: "row", alignItems: "center", gap: 2, children: [_jsx(Typography, { color: "text.primary", fontWeight: "bold", fontSize: 16, children: "Valor Total:" }), _jsx(Typography, { color: "green", fontWeight: "bold", fontSize: 16, children: formatCurrency(Number(opportunity.VALOR_TOTAL) || 0) })] })] })] }) }), _jsxs(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mt: 1,
                    borderRadius: 1,
                    px: 2,
                    gap: 2,
                }, children: [_jsx(Button, { onClick: () => saveOpp(), variant: "contained", children: "Salvar" }), _jsx(Button, { variant: "contained", color: "error", onClick: () => setDeletingOpp(opportunity), children: "Excluir Proposta" })] }), _jsx(BaseDeleteDialog, { open: Boolean(deletingOpp), onConfirm: handleDelete, onCancel: () => setDeletingOpp(null) })] }));
};
export default OpportunityDetailedForm;
