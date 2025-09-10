import { Autocomplete, AutocompleteRenderInputParams, Box, Button, Checkbox, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useProjectOptions } from '../../hooks/projectOptionsHook';
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useOppStatusOptions from '../../hooks/oportunidades/useOppStatusOptions';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../../models/oportunidades/Opportunity';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { setCreating, setOpportunity } from '../../redux/slices/oportunidades/opportunitySlice';
import { useClientOptions } from '../../hooks/oportunidades/useClientOptions';
import { useComercialResponsableOptions } from '../../hooks/oportunidades/useComercialResponsableOptions';
import { useOpportunityMandatoryFields } from '../../hooks/oportunidades/useOpportunityMandatoryFields';
import { formatDateStringtoISOstring } from '../../utils';
import OptionsField from '../shared/ui/OptionsField';
import ElegantInput from '../shared/ui/Input';


const OpportunityForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const opportunity = useSelector((state: RootState) => state.opportunity.opportunity);
  
    const [isAdicional, setIsAdicional] = useState(false);
    const { projectOptions } = useProjectOptions();
    const {oppStatusOptions} = useOppStatusOptions();
    const { clientOptions } = useClientOptions();
    const {comercialResponsableOptions} = useComercialResponsableOptions();
    const { fields } = useOpportunityMandatoryFields(
      projectOptions,
      oppStatusOptions,
      clientOptions,
      comercialResponsableOptions
    );

    const handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(setOpportunity({ ...opportunity, [name]: value }));
    }

    const handleChangeAutocomplete = (name: string, optionId: number | string) => {
      console.log("handleChangeAutocomplete");

      dispatch(setOpportunity({...opportunity, [name]: optionId}));
    }

    const handleSubmit = async (e : React.FormEvent) => {
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
          FK_CODCOLIGADAL: opportunity?.FK_CODCOLIGADA,
          RESPONSAVEL: opportunity?.RESPONSAVEL,
        };
        try {
          const createOpp: Opportunity = await OpportunityService.create(payload, { isAdicional });
          dispatch(setOpportunity(null));
          dispatch(setCreating(false));
          navigate(`/oportunidades/${createOpp.CODOS}`);
        } catch (error) {
          dispatch(setFeedback({ message: 'Erro ao criar oportunidade', type: 'error' }));
          console.error(error);
        }
    }

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack direction="row" alignItems="center">
          <Checkbox
            onChange={(e) => setIsAdicional(e.target.checked)}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
          />
          <Typography fontSize="small" fontWeight="bold" color="text.secondary">
            Adicional
          </Typography>
        </Stack>
        {projectOptions.length > 0 && oppStatusOptions.length > 0 && (
          <Grid
            container
           
            sx={{
              gap: 1,
              maxHeight: 300,
              dislplay: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap'
            }}
          >
            {fields.map((field, index) => {
              if (field.type === "autocomplete") {
                if (!field.options) return null;
                if (field.field === "ID_PROJETO" && !isAdicional) return null;
                return (
                  <Grid item xs={12} sm={8} key={index}>
                    <OptionsField
                      required={field.required}
                      label={field.label}
                      options={field.options}
                      optionHeight={field.field === 'FK_CODCLIENTE' ? 60 : 30}
                      value={
                        opportunity
                          ? String(
                              opportunity[field.field as keyof Opportunity]
                            )
                          : ""
                      }
                      onChange={(optionId) =>  {
                        handleChangeAutocomplete(field.field, optionId)}
                      }
                    />
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <ElegantInput 
                  value={field.value}
                  onChange={handleChangeTextField}
                  name={field.field}
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  disabled={field.disabled}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
        <Button variant="contained" type="submit">
          Salvar
        </Button>
      </Box>
    );
}

export default OpportunityForm