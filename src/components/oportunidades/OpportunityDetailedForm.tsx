
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  AutocompleteRenderInputParams,
  Autocomplete,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Opportunity } from "../../models/oportunidades/Opportunity";
import { FieldConfig, Option } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setOpportunity } from "../../redux/slices/oportunidades/opportunitySlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import OpportunityService from "../../services/oportunidades/OpportunityService";
import { debounce } from "lodash";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { RootState } from "../../redux/store";
import { useOppDetailedFields } from "../../hooks/oportunidades/useOppDetailedFields";
import {
  formatCurrency,
  formatDateStringtoISOstring,
  getDateStringFromISOstring,
} from "../../utils";
import { setDefaultEventParameters } from "firebase/analytics";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";

const OpportunityDetailedForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);
  const [opportunity, setOpportunity] = useState<Partial<Opportunity>>({});
  const [formData, setFormData] = useState<any>({});
  const [blockedFields, setBlockedFields] = useState<boolean>(false);
  const { fields, fieldsMap } = useOppDetailedFields(user, opportunity);
  const [loading, setLoading] = useState<boolean>(false); 
  const [deletingOpp, setDeletingOpp] = useState<Partial<Opportunity> | null>(null);

  const { CODOS } = useParams();

  const saveOpp = async () => {
    if (!CODOS) return;

    setBlockedFields(true);
    try {
      const opp = await OpportunityService.update(Number(CODOS), formData);
      setOpportunity(opp);
      setBlockedFields(false);
      dispatch(setFeedback({ message: "Oportunidade salva com sucesso", type: "success" }));
    } catch (error) {
      setFeedback({ message: "Erro ao salvar oportunidade", type: "error" });
    }
  };

  const handleTextFieldChange = (
    field: FieldConfig,
    value: any,
    fieldMapKey: string
  ) => {
    const updatedOpp = { ...opportunity, [field.field]: value };
    const fields = fieldsMap.get(fieldMapKey)?.map((f) => f.field);
    let payload = {...formData};
    if (fieldMapKey === "datas") {
      fields?.forEach((f) => {
        payload = {
          ...payload,
          [f]: formatDateStringtoISOstring(
            String(updatedOpp[f as keyof Opportunity])
          ),
        };
      });
      setFormData(payload);
      setOpportunity(updatedOpp);
      // debouncedSave(payload);
      return;
    }
    fields?.forEach((f) => {
      payload = { ...payload, [f]: updatedOpp[f as keyof Opportunity] };
    });
    
    setFormData(payload);
    setOpportunity(updatedOpp);
    // debouncedSave(payload);
  };

  const handleAutocompleteChange = (
    field: string,
    option: Option | null,
    fieldMapKey: string
  ) => {
    if (!option) return;
    const updatedOpp = { ...opportunity, [field]: option.id };
    const fields = fieldsMap.get(fieldMapKey)?.map((f) => f.field);
    let payload = {...formData};
    fields?.forEach((f) => {
      payload = { ...payload, [f]: updatedOpp[f as keyof Opportunity] };
    });
    setFormData(payload);
    setOpportunity(updatedOpp);
    // debouncedSave(payload);
  };

  const handleDelete = async  ( ) => { 
    if (!deletingOpp?.CODOS) return;
    try{  
       await OpportunityService.delete(deletingOpp.CODOS);
       navigate("/oportunidades");
    }catch(e){ 
      setDeletingOpp(null);
      dispatch(setFeedback({ 
        message: 'Erro ao deletar oportunidade',
        type: 'error'
      }));
    }
   
  };


  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!CODOS) return;
      try {
        setLoading(true);
        const opportunity = await OpportunityService.getById(Number(CODOS));
        setOpportunity(opportunity);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        dispatch(
          setFeedback({
            message: "Erro ao buscar oportunidade",
            type: "error",
          })
        );
      }
    };
    fetchOpportunity();
  }, [CODOS, dispatch]);

  return (
    <Grid container spacing={1}>
      
      <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 1, borderRadius: 1, height: "100%" }}>
            <Typography
              variant="subtitle1"
              color="primary.main"
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Cadastro
            </Typography>
            <Grid container gap={2}>
              {fieldsMap?.get("cadastro")?.map((field) => {
                if (field.type === "autocomplete" && field.options) {
                  return (
                    <Grid item xs={12} key={field.field}>
                      <Autocomplete
                        options={field.options}
                        getOptionLabel={(option) => option?.name || ""}
                        getOptionKey={(option) => option?.id || ""}
                        aria-required={field.required}
                        slotProps={{
                          popper: { sx: { fontSize: 13 } },
                          paper: { sx: { fontSize: 13 } },
                        }}
                        fullWidth
                        key={field.field}
                        aria-label={field.label}
                        value={field.options.find(
                          (option) =>
                            option.id ===
                            opportunity[field.field as keyof Opportunity]
                        )}
                        onChange={(e, value) =>
                          handleAutocompleteChange(
                            field.field,
                            value,
                            "cadastro"
                          )
                        }
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextField
                            {...params}
                            InputLabelProps={{
                              shrink: true,
                              sx: {
                                fontSize: 14,
                                color: "text.secondary",
                                fontWeight: "bold",
                              },
                            }}
                            label={field.label}
                            variant="outlined"
                            fullWidth
                            required={field.required}
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  );
                }
                return (
                  <Grid item xs={12} key={field.field}>
                    <TextField
                      required={field.required}
                      fullWidth
                      onChange={(e) =>
                        handleTextFieldChange(field, e.target.value, "cadastro")
                      }
                      name={field.field}
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontSize: 14,
                          color: "text.secondary",
                          fontWeight: "bold",
                        },
                      }}
                      key={field.field}
                      label={field.label}
                      variant="outlined"
                      type={field.type}
                      disabled={field.disabled}
                      value={opportunity[field.field as keyof Opportunity]}
                      size="small"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 1, borderRadius: 1, height: "100%" }}>
          <Typography
            variant="subtitle1"
            color="primary.main"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Datas
          </Typography>
          <Grid container gap={2}>
            {fieldsMap?.get("datas")?.map((field) => {
              const value = getDateStringFromISOstring(
                String(opportunity[field.field as keyof Opportunity])
              );
              if (
                field.field === "DATAINTERACAO" &&
                opportunity.status?.ACAO === 1
              )
                return null;
              return (
                <Grid item xs={12} key={field.field}>
                  {field.field === "DATAINTERACAO" &&
                    opportunity.status?.ACAO !== 1 && (
                      <Typography
                        color="text.secondary"
                        fontWeight="bold"
                        fontSize={13}
                        sx={{ mb: 2 }}
                      >
                        Próxima data de interação com o cliente
                      </Typography>
                    )}
                  <TextField
                    required={field.required}
                    fullWidth
                    onChange={(e) =>
                      handleTextFieldChange(field, e.target.value, "datas")
                    }
                    name={field.field}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: 14,
                        color: "text.secondary",
                        fontWeight: "bold",
                      },
                    }}
                    key={field.field}
                    label={field.label}
                    variant="outlined"
                    type={field.type}
                    disabled={field.disabled}
                    value={value}
                    size="small"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 1, borderRadius: 1, height: "100%" }}>
          <Typography
            variant="subtitle1"
            color="primary.main"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Venda
          </Typography>
          <Grid container gap={2} sx={{ mt: 1 }}>
            {fieldsMap?.get("venda")?.map((field) => {
              if (field.type === "autocomplete" && field.options) {
                return (
                  <Grid item xs={12} key={field.field}>
                    <Autocomplete
                      options={field.options}
                      getOptionLabel={(option) => option?.name || ""}
                      getOptionKey={(option) => option?.id || ""}
                      aria-required={field.required}
                      slotProps={{
                        popper: { sx: { fontSize: 13 } },
                        paper: { sx: { fontSize: 13 } },
                      }}
                      fullWidth
                      key={field.field}
                      aria-label={field.label}
                      value={field.options.find(
                        (option) =>
                          option.id ===
                          opportunity[field.field as keyof Opportunity]
                      )}
                      onChange={(e, value) =>
                        handleAutocompleteChange(field.field, value, "venda")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              fontSize: 14,
                              color: "text.secondary",
                              fontWeight: "bold",
                            },
                          }}
                          label={field.label}
                          variant="outlined"
                          required={field.required}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} key={field.field}>
                  <TextField
                    required={field.required}
                    fullWidth
                    onChange={(e) =>
                      handleTextFieldChange(field, e.target.value, "venda")
                    }
                    name={field.field}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: 14,
                        color: "text.secondary",
                        fontWeight: "bold",
                      },
                    }}
                    key={field.field}
                    label={field.label}
                    variant="outlined"
                    type={field.type}
                    disabled={field.disabled}
                    value={opportunity[field.field as keyof Opportunity]}
                    size="small"
                  />
                </Grid>
              );
            })}
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography color="text.primary" fontWeight="bold" fontSize={16}>
                Valor Total:
              </Typography>
              <Typography color="green" fontWeight="bold" fontSize={16}>
                {formatCurrency(Number(opportunity.VALOR_TOTAL) || 0)}
              </Typography>
            </Stack>
          </Grid>
        </Paper>
      </Grid>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mt: 1,
          borderRadius: 1,
          px: 2,
          gap: 2,
        }}
      >
        <Button onClick={() => saveOpp()} variant="contained">
          Salvar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setDeletingOpp(opportunity)}
        >
          Excluir Proposta
        </Button>
      </Box>

      <BaseDeleteDialog
        open={Boolean(deletingOpp)}
        onConfirm={handleDelete}
        onCancel={() => setDeletingOpp(null)}
      ></BaseDeleteDialog>
    </Grid>
  );
};

export default OpportunityDetailedForm;