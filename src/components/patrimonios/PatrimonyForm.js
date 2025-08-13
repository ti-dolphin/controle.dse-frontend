import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React from "react";
import { useUserOptions } from "../../hooks/useUserOptions";
import { useProjectOptions } from "../../hooks/projectOptionsHook";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
import MovementationService from "../../services/patrimonios/MovementationService";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { usePatrimonyTypeOptions } from "../../hooks/patrimonios/usePatrimonyTypeOptions";
import { usePatrimonyFormPermissions } from "../../hooks/patrimonios/usePatrimonyFormPermissions";
const PatrimonyForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_patrimonio } = useParams();
    const [patrimony, setPatrimony] = React.useState();
    const [formData, setFormData] = React.useState({
        nome: "",
        descricao: "",
        nserie: "",
        tipo: 0,
        valor_compra: 0,
    });
    //mode
    const [mode, setMode] = React.useState("create");
    const { userOptions } = useUserOptions();
    const { projectOptions } = useProjectOptions();
    const { patirmonyTypeOptions } = usePatrimonyTypeOptions();
    const { permissionToEdit } = usePatrimonyFormPermissions(mode, patrimony);
    const fetchData = async () => {
        try {
            if (!id_patrimonio) {
                setMode("create");
                return;
            }
            setMode("edit");
            const data = await PatrimonyService.getById(Number(id_patrimonio));
            setPatrimony(data);
            setFormData({
                nome: data.nome,
                descricao: data.descricao,
                nserie: data.nserie,
                tipo: data.tipo,
                valor_compra: data.valor_compra,
            });
        }
        catch (e) {
            dispatch(setFeedback({
                message: "Houve um erro ao buscar os dados",
                type: "error",
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //criar novo patrimônio
            if (!id_patrimonio) {
                if (!formData.nome ||
                    !formData.descricao ||
                    !formData.tipo ||
                    !formData.responsavel ||
                    !formData.projeto) {
                    return;
                }
                const newPatrymony = await PatrimonyService.create({
                    nome: formData.nome,
                    descricao: formData.descricao,
                    nserie: formData.nserie,
                    valor_compra: formData.valor_compra,
                    tipo: formData.tipo,
                });
                if (newPatrymony) {
                    const firstMovementation = await MovementationService.create({
                        id_patrimonio: newPatrymony.id_patrimonio,
                        id_responsavel: formData.responsavel,
                        id_projeto: formData.projeto,
                    });
                    if (firstMovementation) {
                        dispatch(setFeedback({
                            message: "Patrimônio criado com sucesso",
                            type: "success",
                        }));
                    }
                    navigate(`/patrimonios/${newPatrymony.id_patrimonio}`);
                    return;
                }
            }
            //atualizar patrimônio
            const updatedPatrimony = await PatrimonyService.update(Number(id_patrimonio), formData);
            if (updatedPatrimony) {
                setPatrimony(updatedPatrimony);
                dispatch(setFeedback({
                    message: "Patrimônio atualizado com sucesso",
                    type: "success",
                }));
            }
        }
        catch (error) {
            dispatch(setFeedback({
                message: "Erro ao criar patrimônio",
                type: "error",
            }));
        }
    };
    const handleFocus = (e) => {
        if (!permissionToEdit) {
            e.target.blur();
            dispatch(setFeedback({ type: "error", message: "Você nao tem permissão para editar o campo." }));
        }
    };
    React.useEffect(() => {
        fetchData();
    }, [dispatch, id_patrimonio]);
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 2,
            alignItems: "center",
        }, children: [_jsx(TextField, { label: "Nome", variant: "outlined", fullWidth: true, required: true, value: formData.nome, onChange: (e) => setFormData({ ...formData, nome: e.target.value }), onFocus: handleFocus, disabled: !permissionToEdit }), _jsx(TextField, { label: "Descri\u00E7\u00E3o", variant: "outlined", multiline: true, fullWidth: true, required: true, value: formData.descricao, onChange: (e) => setFormData({ ...formData, descricao: e.target.value }), onFocus: handleFocus, disabled: !permissionToEdit }), _jsx(TextField, { label: "N\u00BA de s\u00E9rie", variant: "outlined", fullWidth: true, value: formData.nserie, onChange: (e) => setFormData({ ...formData, nserie: e.target.value }), onFocus: handleFocus, disabled: !permissionToEdit }), _jsx(TextField, { label: "Valor de compra", variant: "outlined", type: "number", fullWidth: true, value: formData.valor_compra, onChange: (e) => setFormData({ ...formData, valor_compra: Number(e.target.value) }), onFocus: handleFocus, disabled: !permissionToEdit }), _jsx(Autocomplete, { id: "tipo", fullWidth: true, options: patirmonyTypeOptions, getOptionKey: (option) => option.id, getOptionLabel: (option) => option.name, "aria-required": true, renderInput: (params) => (_jsx(TextField, { ...params, fullWidth: true, label: "Tipo", onFocus: handleFocus, disabled: !permissionToEdit })), slotProps: {
                    paper: {
                        style: {
                            width: 250,
                            fontSize: 12,
                        },
                    },
                }, value: patirmonyTypeOptions.find((option) => option.id === formData.tipo) || { id: 0, name: "" }, onChange: (_e, newValue) => setFormData({ ...formData, tipo: Number(newValue?.id) }), disabled: !permissionToEdit }), mode === "create" && (_jsxs(_Fragment, { children: [_jsx(Autocomplete, { id: "responsavel", "aria-required": true, options: userOptions, getOptionKey: (option) => option.id, getOptionLabel: (option) => option.name, fullWidth: true, slotProps: {
                            paper: {
                                style: {
                                    fontSize: 12,
                                },
                            },
                        }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Respons\u00E1vel", onFocus: handleFocus, disabled: !permissionToEdit })), value: userOptions.find((option) => option.id === formData.responsavel), onChange: (_e, newValue) => setFormData({ ...formData, responsavel: Number(newValue?.id) }), disabled: !permissionToEdit }), _jsx(Autocomplete, { id: "projeto", fullWidth: true, "aria-required": true, getOptionKey: (option) => option.id, getOptionLabel: (option) => option.name, options: projectOptions, slotProps: {
                            paper: {
                                style: {
                                    fontSize: 12,
                                },
                            },
                        }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Projeto", onFocus: handleFocus, disabled: !permissionToEdit })), value: projectOptions.find((option) => option.id === formData.projeto), onChange: (_e, newValue) => setFormData({ ...formData, projeto: Number(newValue?.id) }), disabled: !permissionToEdit })] })), _jsx(Button, { type: "submit", variant: "contained", children: mode === "create" ? "Criar" : "Salvar" })] }));
};
export default PatrimonyForm;
