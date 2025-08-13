import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRequisitionField, setMode, setRequisition, clearRequisition, setLoading, setError, } from "../../redux/slices/requisicoes/requisitionSlice";
import { Box, Button, TextField, CircularProgress, Autocomplete, Typography } from "@mui/material";
import { useProjectOptions } from "../../hooks/projectOptionsHook";
import { useRequisitionTypeOptions } from "../../hooks/requisicoes/RequisitionTypeOptionsHook";
import { useNavigate } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { setRows } from "../../redux/slices/requisicoes/requisitionTableSlice";
import { setAddingProducts } from "../../redux/slices/requisicoes/requisitionItemSlice";
const RequisitionForm = () => {
    const dispatch = useDispatch();
    const rows = useSelector((state) => state.requisitionTable.rows);
    const { projectOptions } = useProjectOptions();
    const { reqTypeOptions } = useRequisitionTypeOptions();
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const userOption = { id: user?.CODPESSOA || 0, name: user?.NOME || '' };
    const { requisition, mode, loading, error } = useSelector((state) => state.requisition);
    const fields = [
        {
            label: "Descrição",
            field: "DESCRIPTION",
            type: "text",
            disabled: false,
            required: true,
            defaultValue: "",
            value: requisition.DESCRIPTION ?? "",
        },
        {
            label: "Observação",
            field: "OBSERVACAO",
            type: "text",
            disabled: false,
            required: false,
            defaultValue: "",
            value: requisition.OBSERVACAO ?? "",
        },
        {
            label: "Projeto",
            field: "ID_PROJETO",
            type: "autocomplete",
            disabled: false,
            defaultValue: "",
            options: projectOptions,
            value: projectOptions.find((opt) => opt.id === requisition.ID_PROJETO) || null,
        },
        {
            label: "Tipo",
            field: "TIPO",
            type: "autocomplete",
            disabled: true,
            defaultValue: "",
            options: reqTypeOptions,
            value: reqTypeOptions.find((opt) => opt.id === requisition.TIPO) || null,
        },
        {
            label: "Responsável",
            field: "ID_RESPONSAVEL",
            type: "autocomplete",
            disabled: true,
            defaultValue: user?.NOME || "",
            options: [userOption],
            value: userOption,
        },
    ];
    //setando usuário como responsável default
    const handleChange = (field) => (e) => {
        dispatch(updateRequisitionField({ field, value: e.target.value }));
    };
    const handleChangeOptionField = (field, option) => {
        dispatch(updateRequisitionField({ field, value: option.id }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            if (mode === "create") {
                const newRequisition = await RequisitionService.create({
                    //fields
                    DESCRIPTION: requisition.DESCRIPTION,
                    ID_PROJETO: requisition.ID_PROJETO,
                    //tipo default
                    TIPO: 10,
                    ID_RESPONSAVEL: requisition.ID_RESPONSAVEL,
                    id_status_requisicao: 1,
                    OBSERVACAO: requisition.OBSERVACAO,
                });
                dispatch(setRows([...rows, newRequisition]));
                dispatch(clearRequisition());
                dispatch(setLoading(false));
                dispatch(setFeedback({
                    message: "Requisição criada com sucesso!",
                    type: "success",
                }));
                handleClose();
                dispatch(setAddingProducts(true));
                navigate(`/requisicoes/${newRequisition.ID_REQUISICAO}`);
                return;
            }
        }
        catch (err) {
            dispatch(setLoading(false));
            dispatch(setError(err?.message || "Erro ao criar requisição."));
            dispatch(setFeedback({
                message: err?.message || "Erro ao criar requisição.",
                type: "error",
            }));
        }
    };
    const handleEdit = () => {
        dispatch(setMode("edit"));
    };
    const handleClose = () => {
        dispatch(clearRequisition());
        dispatch(setMode("view"));
        dispatch(setLoading(false));
    };
    const isReadOnly = mode === "view";
    useEffect(() => {
        //setando user como responsável
        dispatch(setRequisition({
            ...requisition,
            ID_RESPONSAVEL: user?.CODPESSOA || 0,
            criado_por: { NOME: user?.NOME || '', CODPESSOA: user?.CODPESSOA || 0 },
            alterado_por: { NOME: user?.NOME || '', CODPESSOA: user?.CODPESSOA || 0 }
        }));
    }, [dispatch]);
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }, children: [_jsx(Typography, { variant: "h6", color: "text.secondary", textAlign: "center", textTransform: "uppercase", fontWeight: "600", children: "Nova requisi\u00E7\u00E3o" }), fields.map((config) => {
                if (config.type === "autocomplete") {
                    return (_jsx(Autocomplete, { options: config.options || [], getOptionLabel: (option) => option.name, getOptionKey: (option) => option.id, value: config.value, "aria-required": true, defaultValue: config.defaultValue, slotProps: {
                            popper: {
                                sx: { fontSize: 14 },
                            },
                            paper: {
                                sx: { fontSize: 14 },
                            },
                        }, isOptionEqualToValue: (option, value) => option.id === value.id, onChange: (_, option) => handleChangeOptionField(config.field, option), disabled: isReadOnly || config.disabled, renderInput: (params) => (_jsx(TextField, { ...params, label: config.label, variant: "outlined", fullWidth: true, required: true })) }, config.field));
                }
                return (_jsx(TextField, { label: config.label, required: config.required, value: requisition[config.field] ?? "", onChange: handleChange(config.field), variant: "outlined", fullWidth: true, disabled: isReadOnly || config.disabled }, config.field));
            }), loading ? (_jsx(CircularProgress, {})) : (_jsx(Box, { sx: { display: "flex", gap: 2 }, children: isReadOnly ? (_jsx(Button, { variant: "contained", onClick: handleEdit, children: "Editar" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", sx: {
                                backgroundColor: "primary.main",
                                borderRadius: 2,
                                textTransform: "capitalize",
                            }, type: "submit", children: "Salvar" }), _jsx(Button, { variant: "contained", sx: {
                                backgroundColor: "error.main",
                                borderRadius: 2,
                                textTransform: "capitalize",
                                "&:hover": {
                                    backgroundColor: "error.dark",
                                },
                            }, onClick: handleClose, children: "Cancelar" })] })) })), error && (_jsx(Box, { color: "error.main", mt: 1, children: error }))] }));
};
export default RequisitionForm;
