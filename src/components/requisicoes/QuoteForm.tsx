import React, { ChangeEvent, useEffect } from "react";
import { TextField, Box, Button, Grid, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isNumeric } from "../../utils";
import { useQuoteFieldOptions } from "../../hooks/requisicoes/QuoteFieldOptionsHook";
import {
  setAccesType,
  setQuote,
} from "../../redux/slices/requisicoes/quoteSlice";
import { Quote } from "../../models/requisicoes/Quote";
import { Option } from "../../types";
import { useQuoteFields } from "../../hooks/requisicoes/QuoteFieldsHook";
import { useQuoteFieldPermissions } from "../../hooks/requisicoes/QuoteFiledPermissionsHook";
import { setFeedback } from "../../redux/slices/feedBackSlice";
interface QuoteFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: any) => void;
}

const QuoteForm = ({ onSubmit }: QuoteFormProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { quote, accessType } = useSelector((state: RootState) => state.quote);
  const [isSupplierRoute, setIsSupplierRoute] = React.useState(
    accessType === "supplier"
  );

  const {
    taxClassificationOptions,
    paymentConditionOptions,
    shipmentTypeOptions,
  } = useQuoteFieldOptions();

  const { permissionToEditFields } = useQuoteFieldPermissions(
    user,
    isSupplierRoute
  );

  const { fields, disabledFields } = useQuoteFields(
    isSupplierRoute,
    taxClassificationOptions,
    paymentConditionOptions,
    shipmentTypeOptions
  );

  const handleChangeOptionField = (field: keyof Quote, option: Option) => {
    if (quote) {
      dispatch(setQuote({ ...quote, [field]: option.id }));
    }
  };

  //verifica a permissão para alterar
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!permissionToEditFields) {
      e.target.blur();
      dispatch(
        setFeedback({
          type: "error",
          message: " Vocé nao tem permissão para editar o campo.",
        })
      );
    }
  };

  const handleChangeTextField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Quote
  ) => {
    const { value } = e.target;

    if (quote) {
      const codeFields = ["cnpj_fornecedor", "cnpj_faturamento"];
      dispatch(
        setQuote({
          ...quote,
          [field]:
            isNumeric(value) && !codeFields.includes(field)
              ? Number(value)
              : value,
        })
      );
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

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => onSubmit(e, quote)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={6} key={field.name}>
            {field.autoComplete && field.options.length > 0 ? (
              <Autocomplete
                options={field.options}
                value={
                  field.options.find(
                    (option) => option.id === quote?.[field.name as keyof Quote]
                  ) || { id: "", name: "" }
                }
                disabled={field.disabled}
                getOptionLabel={(option) => option.name}
                getOptionKey={(option) => option.id}
                renderInput={(params) => (
                  <TextField
                    onFocus={handleFocus}
                    {...params}
                    label={field.label}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={
                      disabledFields[field.name as keyof typeof disabledFields]
                    }
                  />
                )}
                fullWidth
                onChange={(_, option) =>
                  handleChangeOptionField(
                    field.name as keyof Quote,
                    option as Option
                  )
                }
              />
            ) : (
              <TextField
                onFocus={handleFocus}
                label={field.label}
                name={field.name}
                type={field.type}
                value={quote?.[field.name as keyof Quote] || ""}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  handleChangeTextField(e, field.name as keyof Quote)
                }
                disabled={field.disabled}
              />
            )}
          </Grid>
        ))}
      </Grid>
      {/* <Grid item xs={6}>
        <TextField
          label="Observação"
          name="observacao"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          disabled={disabled.observacao}
        />
      </Grid> */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Salvar
      </Button>
    </Box>
  );
};

export default QuoteForm;
