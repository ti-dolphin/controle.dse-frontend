import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React from "react";
import { useUserOptions } from "../../hooks/useUserOptions";
import { useProjectOptions } from "../../hooks/projectOptionsHook";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { PatrimonyService } from "../../services/patrimonios/PatrimonyService";
import MovementationService from "../../services/patrimonios/MovementationService";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "lodash";
import { usePatrimonyTypeOptions } from "../../hooks/patrimonios/usePatrimonyTypeOptions";
import { formatDateToISOstring } from "../../utils";
import { Patrimony } from "../../models/patrimonios/Patrimony";
import { usePatrimonyFormPermissions } from "../../hooks/patrimonios/usePatrimonyFormPermissions";

interface FormData {
  nome: string;
  descricao: string;
  nserie: string;
  tipo: number;
  valor_compra: number;
  responsavel?: number;
  projeto?: number;
}
const PatrimonyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id_patrimonio } = useParams();
  const [patrimony, setPatrimony] = React.useState<Partial<Patrimony>>();
  const [formData, setFormData] = React.useState<FormData>({
    nome: "",
    descricao: "",
    nserie: "",
    tipo: 0,
    valor_compra: 0,
  });

  //mode
  const [mode, setMode] = React.useState<"create" | "edit">("create");
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
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Houve um erro ao buscar os dados",
          type: "error",
        })
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //criar novo patrimônio
      if (!id_patrimonio) {
        if (
          !formData.nome ||
          !formData.descricao ||
          !formData.tipo ||
          !formData.responsavel ||
          !formData.projeto
        ){ 
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
            dispatch(
              setFeedback({
                message: "Patrimônio criado com sucesso",
                type: "success",
              })
            );
          }
          navigate(`/patrimonios/${newPatrymony.id_patrimonio}`);
          return;
        }
      }
      //atualizar patrimônio
      const updatedPatrimony = await PatrimonyService.update(
        Number(id_patrimonio),
        formData
      );
      if (updatedPatrimony) {
        setPatrimony(updatedPatrimony);
        dispatch(
          setFeedback({
            message: "Patrimônio atualizado com sucesso",
            type: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        setFeedback({
          message: "Erro ao criar patrimônio",
          type: "error",
        })
      );
    }
  };

  const handleFocus = (e : React.FocusEvent<HTMLInputElement> ) =>  {
    if (!permissionToEdit)  { 
      e.target.blur();
      dispatch(setFeedback({type: "error", message: "Você nao tem permissão para editar o campo."}));
    };
  }

  React.useEffect(() => {
    fetchData();
  }, [dispatch, id_patrimonio]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        alignItems: "center",
      }}
    >
      <TextField
        label="Nome"
        variant="outlined"
        fullWidth
        required
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        onFocus={handleFocus}
        disabled={!permissionToEdit}
      />
      <TextField
        label="Descrição"
        variant="outlined"
        multiline
        fullWidth
        required
        value={formData.descricao}
        onChange={(e) =>
          setFormData({ ...formData, descricao: e.target.value })
        }
        onFocus={handleFocus}
        disabled={!permissionToEdit}
      />
      <TextField
        label="Nº de série"
        variant="outlined"
        fullWidth
        value={formData.nserie}
        onChange={(e) => setFormData({ ...formData, nserie: e.target.value })}
        onFocus={handleFocus}
        disabled={!permissionToEdit}
      />
      <TextField
        label="Valor de compra"
        variant="outlined"
        type="number"
        fullWidth
        value={formData.valor_compra}
        onChange={(e) =>
          setFormData({ ...formData, valor_compra: Number(e.target.value) })
        }
        onFocus={handleFocus}
        disabled={!permissionToEdit}
      />

      {/* autoComplete */}

      <Autocomplete
        id="tipo"
        fullWidth
        options={patirmonyTypeOptions}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => option.name}
        aria-required
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Tipo"
            onFocus={handleFocus}
            disabled={!permissionToEdit}
          />
        )}
        slotProps={{
          paper: {
            style: {
              width: 250,
              fontSize: 12,
            },
          },
        }}
        value={
          patirmonyTypeOptions.find(
            (option) => option.id === formData.tipo
          ) || { id: 0, name: "" }
        }
        onChange={(e, newValue) =>
          setFormData({ ...formData, tipo: Number(newValue?.id) })
        }
        disabled={!permissionToEdit}
      />
      {mode === "create" && (
        <>
          <Autocomplete
            id="responsavel"
            aria-required
            options={userOptions}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            fullWidth
            slotProps={{
              paper: {
                style: {
                  fontSize: 12,
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Responsável"
                onFocus={handleFocus}
                disabled={!permissionToEdit}
              />
            )}
            value={userOptions.find(
              (option) => option.id === formData.responsavel
            )}
            onChange={(e, newValue) =>
              setFormData({ ...formData, responsavel: Number(newValue?.id) })
            }
            disabled={!permissionToEdit}
          />

          <Autocomplete
            id="projeto"
            fullWidth
            aria-required
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            options={projectOptions}
            slotProps={{
              paper: {
                style: {
                  fontSize: 12,
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Projeto"
                onFocus={handleFocus}
                disabled={!permissionToEdit}
              />
            )}
            value={projectOptions.find(
              (option) => option.id === formData.projeto
            )}
            onChange={(e, newValue) =>
              setFormData({ ...formData, projeto: Number(newValue?.id) })
            }
            disabled={!permissionToEdit}
          />
        </>
      )}

      <Button type="submit" variant="contained">
        {mode === "create" ? "Criar" : "Salvar"}
      </Button>
    </Box>
  );
};

export default PatrimonyForm;
