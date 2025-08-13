import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  updateRequisitionField,
  setMode,
  setRequisition,
  clearRequisition,
  setLoading,
  setError,
} from "../../redux/slices/requisicoes/requisitionSlice";
import { Box, Button, TextField, CircularProgress, Autocomplete, AutocompleteRenderInputParams, Typography } from "@mui/material";
import { Requisition } from "../../models/requisicoes/Requisition";
import { useProjectOptions } from "../../hooks/projectOptionsHook";
import { FieldConfig, Option } from "../../types";
import { useRequisitionTypeOptions } from "../../hooks/requisicoes/RequisitionTypeOptionsHook";
import { useNavigate } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { setRows } from "../../redux/slices/requisicoes/requisitionTableSlice";
import { setAddingProducts } from "../../redux/slices/requisicoes/requisitionItemSlice";



const RequisitionForm: React.FC = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.requisitionTable.rows);
  const { projectOptions } = useProjectOptions();
  const { reqTypeOptions } = useRequisitionTypeOptions();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const userOption = { id: user?.CODPESSOA || 0, name: user?.NOME || ''};
  const { requisition, mode, loading, error } = useSelector(
    (state: RootState) => state.requisition
  );

const fields: FieldConfig[] = [
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
    value:
      projectOptions.find((opt) => opt.id === requisition.ID_PROJETO) || null,
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

  
  const handleChange = (field: keyof Requisition) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateRequisitionField({ field, value: e.target.value }));
  };

  const handleChangeOptionField = (field : keyof Requisition, option :  Option) => { 
    dispatch(updateRequisitionField({ field, value: option.id }));
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
        if (mode === "create") {
            const newRequisition = await RequisitionService.create({
              //fields
              DESCRIPTION : requisition.DESCRIPTION,
              ID_PROJETO : requisition.ID_PROJETO,
              //tipo default
              TIPO : 10,
              ID_RESPONSAVEL : requisition.ID_RESPONSAVEL,
              id_status_requisicao: 1,
              OBSERVACAO : requisition.OBSERVACAO,
            });
            dispatch(setRows([...rows, newRequisition]));
            dispatch(clearRequisition());
            dispatch(setLoading(false));
            dispatch(
                setFeedback({
                    message: "Requisição criada com sucesso!",
                    type: "success",
                })
            );
            handleClose();
            dispatch(setAddingProducts(true))
            navigate(`/requisicoes/${newRequisition.ID_REQUISICAO}`);
            return;
        }
    } catch (err: any) {
        dispatch(setLoading(false));
        dispatch(setError(err?.message || "Erro ao criar requisição."));
        dispatch(
            setFeedback({
                message: err?.message || "Erro ao criar requisição.",
                type: "error",
            })
        );
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
        ID_RESPONSAVEL : user?.CODPESSOA || 0,
        criado_por: {NOME: user?.NOME || '', CODPESSOA: user?.CODPESSOA || 0},
        alterado_por: {NOME: user?.NOME || '', CODPESSOA: user?.CODPESSOA || 0}
    }))
  }, [dispatch])

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        textTransform="uppercase"
        fontWeight="600"
      >
        Nova requisição
      </Typography>
      {fields.map((config) => {
        if (config.type === "autocomplete") {
          return (
            <Autocomplete
              key={config.field}
              options={config.options || []}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              value={config.value}
              aria-required
              defaultValue={config.defaultValue}
              slotProps={{
                popper: {
                  sx: { fontSize: 14 },
                },
                paper: {
                  sx: { fontSize: 14 },
                },
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, option) =>
                handleChangeOptionField(
                  config.field as keyof Requisition,
                  option as Option
                )
              }
              disabled={isReadOnly || config.disabled}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  label={config.label}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          );
        }
        return (
          <TextField
            key={config.field}
            label={config.label}
            required={config.required}
            value={requisition[config.field as keyof Requisition] ?? ""}
            onChange={handleChange(config.field as keyof Requisition)}
            variant="outlined"
            fullWidth
            disabled={isReadOnly || config.disabled}
          />
        );
      })}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          {isReadOnly ? (
            <Button variant="contained" onClick={handleEdit}>
              Editar
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: 2,
                  textTransform: "capitalize",
                }}
                type="submit"
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "error.main",
                  borderRadius: 2,
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "error.dark",
                  },
                }}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </>
          )}
        </Box>
      )}
      {error && (
        <Box color="error.main" mt={1}>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default RequisitionForm;
