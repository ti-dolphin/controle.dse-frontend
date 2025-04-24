import { Box, Button, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { OpportunityInfoContext } from "../../context/OpportunityInfoContext";
import { AlertInterface, Project } from "../../../Requisitions/types";
import Autocomplete from "@mui/material/Autocomplete";
import { Client, Opportunity, Status } from "../../types";
import { fetchAllProjects } from "../../../Requisitions/utils";
import { fetchAllClients, fetchStatusList } from "../../utils";
import typographyStyles from "../../../Requisitions/utilStyles";
import { CloseModalButton } from "../../../generalUtilities";
import { debounce } from "lodash";
import { BaseButtonStyles } from "../../../utilStyles";
import { styles } from "./OpportunityRegistration.styles";

interface props {
  handleClose: () => void;
  opp: Opportunity;
  setOpp: React.Dispatch<React.SetStateAction<Opportunity>>;
}

const OpportunityRegistration = ({ handleClose, opp, setOpp }: props) => {
  const { creatingOpportunity } = useContext(OpportunityInfoContext);
  const [clientOptions, setClientOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [projectOptions, setProjectOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [statusOptions, setStatusOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);

  const [choseProjectModalOpen, setChoseProjectModalOpen] =
    useState<boolean>(false);
  const [idProjeto, setIdProjeto] = useState<number>(opp.ID_PROJETO || 0);
  const [numeroAdicional, setNumeroAdicional] = useState<number>(opp.adicional.NUMERO);
  const [nome, setNome] = useState<string>(opp.NOME || "");
  const [codStatus, setCodStatus] = useState<number>(opp.CODSTATUS || 0);
  const [descricaoVenda, setDescricaoVenda] = useState<string>(opp.DESCRICAO_VENDA || "");
  const [fkCodCliente, setFkCodCliente] = useState<number>(opp.FK_CODCLIENTE || 0);
  const [fkCodColigada, setFkCodColigada] = useState<number>(opp.FK_CODCOLIGADA || 0);
  const [dataSolicitacao, setDataSolicitacao] = useState<Date | null>(
    new Date(opp.DATASOLICITACAO)
  );
  const [dataInicio, setDataInicio] = useState<Date | null>(
    new Date(opp.DATAINICIO)
  );
  const [dataEntrega, setDataEntrega] = useState<Date | null>(
    new Date(opp.DATAENTREGA)
  );
  const [alert, setAlert] = useState<AlertInterface>();

  const displayAlert = async (severity: string, message: string) => {
    setTimeout(() => {
      setAlert(undefined);
    }, 3000);
    setAlert({ severity, message });
    return;
  };

  const debouncedSetOppNome = useCallback(
    debounce((value: string) => {
      setOpp((prev: Opportunity) => ({ ...prev, NOME: value }));
    }, 300),
    [setOpp]
  );

  const debouncedSetOppDescricaoVenda = useCallback(
    debounce((value: string) => {
      setOpp((prev: Opportunity) => ({ ...prev, DESCRICAO_VENDA: value }));
    }, 300),
    [setOpp]
  );

  const debouncedSetOppDataSolicitacao = useCallback(
    debounce((value: Date) => {
      setOpp((prev: Opportunity) => ({ ...prev, DATASOLICITACAO: value }));
    }, 300),
    [setOpp]
  );

  const debouncedSetOppDataInicio = useCallback(
    debounce((value: Date) => {
      setOpp((prev: Opportunity) => ({ ...prev, DATAINICIO: value }));
    }, 300),
    [setOpp]
  );

  const debouncedSetOppDataEntrega = useCallback(
    debounce((value: Date) => {
      setOpp((prev: Opportunity) => ({ ...prev, DATAENTREGA: value }));
    }, 300),
    [setOpp]
  );

  useEffect(() => {
    const fetchProjectOptions = async () => {
      try {
        const data = await fetchAllProjects();
        const options = data.map((item: Project) => ({
          label: item.DESCRICAO,
          value: item.ID,
        }));
        setProjectOptions(options);
      } catch (e) {
        console.error(e);
        displayAlert("error", "Erro ao buscar projetos");
      }
    };
    const fetchClientOptions = async () => {
      try {
        if (opp) {
          const data = await fetchAllClients(opp.ID_PROJETO);
          const options = data.map((item: Client) => ({
            label: item.NOMEFANTASIA,
            value: item.CODCLIENTE,
          }));
          setClientOptions(options);
        }
      } catch (e) {
        console.error(e);
        displayAlert("error", "Erro ao buscar clientes");
      }
    };
    const fetchStatusOptions = async () => {
      try {
        const data = await fetchStatusList();
        const options = data.map((item: Status) => ({
          label: item.NOME,
          value: item.CODSTATUS,
        }));
        setStatusOptions(options);
      } catch (e) {
        console.error(e);
        displayAlert("error", "Erro ao buscar status");
      }
    };
    if (creatingOpportunity) {
      setChoseProjectModalOpen(true);
    }
    fetchStatusOptions();
    fetchProjectOptions();
    fetchClientOptions();
  }, []);

  useEffect(() => {
    debouncedSetOppNome(nome);
    return () => {
      debouncedSetOppNome.cancel();
    };
  }, [nome, debouncedSetOppNome]);

  useEffect(() => {
    debouncedSetOppDescricaoVenda(descricaoVenda);
    return () => {
      debouncedSetOppDescricaoVenda.cancel();
    };
  }, [descricaoVenda, debouncedSetOppDescricaoVenda]);

  useEffect(() => {
    debouncedSetOppDataSolicitacao(dataSolicitacao || new Date());
    return () => {
      debouncedSetOppDataSolicitacao.cancel();
    };
  }, [dataSolicitacao, debouncedSetOppDataSolicitacao]);

  useEffect(() => {
    debouncedSetOppDataInicio(dataInicio || new Date());
    return () => {
      debouncedSetOppDataInicio.cancel();
    };
  }, [dataInicio, debouncedSetOppDataInicio]);

  useEffect(() => {
    debouncedSetOppDataEntrega(dataEntrega || new Date());
    return () => {
      debouncedSetOppDataEntrega.cancel();
    };
  }, [dataEntrega, debouncedSetOppDataEntrega]);



  return (
    <Box
      sx={styles.container}
    >
      <Box>
        <Autocomplete
          options={projectOptions}
          getOptionLabel={(option) =>
            option.label ? option.label : `ID PROJETO: ${option.value}`
          }
          getOptionKey={(option) => option.value}
          value={
            projectOptions.find((option) => option.value === idProjeto) || null
          }
          disabled
          renderInput={(params) => (
            <TextField {...params} label="Projeto" fullWidth margin="normal" />
          )}
        />
        <Autocomplete
          options={clientOptions}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.value}
          onChange={(event, newValue) => {
            setFkCodCliente(newValue ? newValue.value : 0);
            setOpp((prev: Opportunity) => ({...prev, FK_CODCLIENTE: newValue ? newValue.value : 0}));
          }}
          value={
            clientOptions.find((option) => option.value === fkCodCliente) ||
            null
          }
          renderInput={(params) => (
            <TextField {...params} label="Cliente" fullWidth margin="normal" />
          )}
        />
        <Autocomplete
          options={statusOptions}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.value}
          onChange={(event, newValue) => {
            setCodStatus(newValue ? newValue.value : 0);
            setOpp((prev: Opportunity) => ({...prev, CODSTATUS: newValue ? newValue.value : 0}));
          }}
          value={
            statusOptions.find((option) => option.value === codStatus) || null
          }
          renderInput={(params) => (
            <TextField {...params} label="Status" fullWidth margin="normal" />
          )}
        />

        <TextField
          label="Descrição da Proposta"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Descrição da Venda"
          value={descricaoVenda}
          onChange={(e) => setDescricaoVenda(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Número Adicional"
          type="number"
          value={numeroAdicional}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data de Solicitação"
          type="date"
          value={
            dataSolicitacao ? dataSolicitacao.toISOString().split("T")[0] : ""
          }
          onChange={(e) =>
            setDataSolicitacao(e.target.value ? new Date(e.target.value) : null)
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data de Início"
          type="date"
          value={dataInicio ? dataInicio.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setDataInicio(e.target.value ? new Date(e.target.value) : null)
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data de Entrega"
          type="date"
          value={dataEntrega ? dataEntrega.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setDataEntrega(e.target.value ? new Date(e.target.value) : null)
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </Box>{" "}
      {choseProjectModalOpen && (
        <Box
          sx={styles.modal}
        >
          <CloseModalButton handleClose={handleClose} />
          <Typography sx={{ ...typographyStyles.heading2 }}>
            Escolher Projeto
          </Typography>
          <Autocomplete
            options={projectOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => {
              setIdProjeto(newValue ? newValue.value : 0);
              setChoseProjectModalOpen(false);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Selecione um Projeto" fullWidth />
            )}
          />
          <Button sx={{ ...BaseButtonStyles }}>Salvar</Button>
        </Box>
      )}
    </Box>
  );
};

export default OpportunityRegistration;
