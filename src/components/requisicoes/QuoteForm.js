import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { TextField, Box, Button, Grid, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { isNumeric } from "../../utils";
import { useQuoteFieldOptions } from "../../hooks/requisicoes/QuoteFieldOptionsHook";
import { setAccesType, setQuote, } from "../../redux/slices/requisicoes/quoteSlice";
import { useQuoteFields } from "../../hooks/requisicoes/QuoteFieldsHook";
import { useQuoteFieldPermissions } from "../../hooks/requisicoes/QuoteFiledPermissionsHook";
import { setFeedback } from "../../redux/slices/feedBackSlice";
const QuoteForm = ({ onSubmit }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const { quote, accessType } = useSelector((state) => state.quote);
    const [isSupplierRoute, setIsSupplierRoute] = React.useState(accessType === "supplier");
    const { taxClassificationOptions, paymentConditionOptions, shipmentTypeOptions, } = useQuoteFieldOptions();
    const { permissionToEditFields } = useQuoteFieldPermissions(user, isSupplierRoute);
    const { fields, disabledFields } = useQuoteFields(isSupplierRoute, taxClassificationOptions, paymentConditionOptions, shipmentTypeOptions);
    const handleChangeOptionField = (field, option) => {
        if (quote) {
            dispatch(setQuote({ ...quote, [field]: option.id }));
        }
    };
    //verifica a permissão para alterar
    const handleFocus = (e) => {
        if (!permissionToEditFields) {
            e.target.blur();
            dispatch(setFeedback({
                type: "error",
                message: " Vocé nao tem permissão para editar o campo.",
            }));
        }
    };
    const handleChangeTextField = (e, field) => {
        const { value } = e.target;
        if (quote) {
            const codeFields = ["cnpj_fornecedor", "cnpj_faturamento"];
            dispatch(setQuote({
                ...quote,
                [field]: isNumeric(value) && !codeFields.includes(field)
                    ? Number(value)
                    : value,
            }));
        }
    };
    useEffect(() => {
        if (user) {
            setIsSupplierRoute(false);
            return;
        }
        if (window.localStorage.getItem("token")) {
            setIsSupplierRoute(true);
            setAccesType("supplier");
        }
    }, []);
    return (_jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: (e) => onSubmit(e, quote), sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [_jsx(Grid, { container: true, spacing: 2, children: fields.map((field) => (_jsx(Grid, { item: true, xs: 6, children: field.autoComplete && field.options.length > 0 ? (_jsx(Autocomplete, { options: field.options, value: field.options.find((option) => option.id === quote?.[field.name]) || { id: "", name: "" }, disabled: field.disabled, getOptionLabel: (option) => option.name, getOptionKey: (option) => option.id, renderInput: (params) => (_jsx(TextField, { onFocus: handleFocus, ...params, label: field.label, InputLabelProps: {
                                shrink: true,
                            }, disabled: disabledFields[field.name] })), fullWidth: true, onChange: (_, option) => handleChangeOptionField(field.name, option) })) : (_jsx(TextField, { onFocus: handleFocus, label: field.label, name: field.name, type: field.type, value: quote?.[field.name] || "", fullWidth: true, InputLabelProps: {
                            shrink: true,
                        }, onChange: (e) => handleChangeTextField(e, field.name), disabled: field.disabled })) }, field.name))) }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, children: "Salvar" })] }));
};
export default QuoteForm;
