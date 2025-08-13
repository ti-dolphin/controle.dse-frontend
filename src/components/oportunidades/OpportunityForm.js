import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Autocomplete, Box, Button, Checkbox, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useProjectOptions } from '../../hooks/projectOptionsHook';
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from 'react-redux';
import useOppStatusOptions from '../../hooks/oportunidades/useOppStatusOptions';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { useNavigate } from 'react-router-dom';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { setOpportunity } from '../../redux/slices/oportunidades/opportunitySlice';
import { useClientOptions } from '../../hooks/oportunidades/useClientOptions';
import { useComercialResponsableOptions } from '../../hooks/oportunidades/useComercialResponsableOptions';
import { useOpportunityMandatoryFields } from '../../hooks/oportunidades/useOpportunityMandatoryFields';
import { formatDateStringtoISOstring } from '../../utils';
const OpportunityForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const opportunity = useSelector((state) => state.opportunity.opportunity);
    const [isAdicional, setIsAdicional] = useState(false);
    const { projectOptions } = useProjectOptions();
    const { oppStatusOptions } = useOppStatusOptions();
    const { clientOptions } = useClientOptions();
    const { comercialResponsableOptions } = useComercialResponsableOptions();
    const { fields } = useOpportunityMandatoryFields(projectOptions, oppStatusOptions, clientOptions, comercialResponsableOptions);
    const handleChangeTextField = (e) => {
        const { name, value } = e.target;
        dispatch(setOpportunity({ ...opportunity, [name]: value }));
    };
    const handleChangeAutocomplete = (name, option) => {
        dispatch(setOpportunity({ ...opportunity, [name]: option.id }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            NOME: opportunity?.NOME,
            ID_PROJETO: isAdicional ? opportunity?.ID_PROJETO : null,
            CODSTATUS: opportunity?.CODSTATUS,
            DATASOLICITACAO: opportunity?.DATASOLICITACAO
                ? formatDateStringtoISOstring(opportunity.DATASOLICITACAO)
                : null,
            DATAENTREGA: opportunity?.DATAENTREGA
                ? formatDateStringtoISOstring(opportunity.DATAENTREGA)
                : null,
            DATAINICIO: opportunity?.DATAINICIO
                ? formatDateStringtoISOstring(opportunity.DATAINICIO)
                : null,
            FK_CODCLIENTE: opportunity?.FK_CODCLIENTE,
            RESPONSAVEL: opportunity?.RESPONSAVEL,
        };
        try {
            const createOpp = await OpportunityService.create(payload, {
                isAdicional
            });
            navigate(`/oportunidades/${createOpp.CODOS}`);
        }
        catch (error) {
            dispatch(setFeedback({ message: 'Erro ao criar oportunidade', type: 'error' }));
            console.error(error);
        }
    };
    return (_jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 2 }, component: "form", onSubmit: handleSubmit, children: [_jsxs(Stack, { direction: "row", alignItems: "center", children: [_jsx(Checkbox, { onChange: (e) => setIsAdicional(e.target.checked), icon: _jsx(RadioButtonUncheckedIcon, {}), checkedIcon: _jsx(CheckCircleIcon, {}) }), _jsx(Typography, { fontSize: "small", fontWeight: "bold", color: "text.secondary", children: "Adicional" })] }), projectOptions.length > 0 && oppStatusOptions.length > 0 && (_jsx(Grid, { container: true, sx: {
                    gap: 2,
                    maxHeight: 300,
                    dislplay: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap'
                }, children: fields.map((field, index) => {
                    if (field.type === "autocomplete") {
                        if (!field.options)
                            return null;
                        if (field.field === "ID_PROJETO" && !isAdicional)
                            return null;
                        return (_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(Autocomplete, { options: field.options, getOptionLabel: (option) => option?.name || "", getOptionKey: (option) => option.id, "aria-required": field.required, slotProps: {
                                    popper: { sx: { fontSize: 12 } },
                                    paper: { sx: { fontSize: 12 } },
                                }, fullWidth: true, "aria-label": field.label, value: field.value, onChange: (_e, value) => handleChangeAutocomplete(field.field, value), renderInput: (params) => (_jsx(TextField, { ...params, label: field.label, variant: "outlined", fullWidth: true, required: field.required })) }, field.field) }, index));
                    }
                    return (_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { required: field.required, fullWidth: true, name: field.field, InputLabelProps: { shrink: true }, label: field.label, variant: "outlined", type: field.type, onChange: handleChangeTextField, disabled: field.disabled, value: field.value }, field.field) }, index));
                }) })), _jsx(Button, { variant: "contained", type: "submit", children: "Salvar" })] }));
};
export default OpportunityForm;
