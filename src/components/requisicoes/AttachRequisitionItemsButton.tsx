import { useRef, useState } from "react";
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch, useSelector } from "react-redux";
import { readRequisitionItemSpreadsheet } from "../../utils/requisicoes/requisitionItemSpreadsheet";
import { RootState } from "../../redux/store";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import { setRefresh } from "../../redux/slices/requisicoes/requisitionItemSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import AttachmentDropZone from "../shared/AttachmentDropZone";

const AttachRequisitionItemsButton = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const requisition = useSelector((state: RootState) => state.requisition.requisition);
  const refresh = useSelector((state: RootState) => state.requisitionItem.refresh);
  const [open, setOpen] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [rows, setRows] = useState<unknown[][]>([]);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const working = useRef(false);

  const readFile = async (files: File[]) => {
    if (working.current) return;
    setRows([]);
    setFilename("");
    setError("");
    if (files.length !== 1 || !/\.(xlsx|xls|csv)$/i.test(files[0].name)) {
      setError("Selecione uma única tabela nos formatos XLSX, XLS ou CSV.");
      return;
    }
    working.current = true;
    setBusy(true);
    try {
      const validated = readRequisitionItemSpreadsheet(await files[0].arrayBuffer());
      setRows(validated);
      setFilename(files[0].name);
    } catch (err: any) {
      setError(err.message || "Não foi possível ler a tabela.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  };

  const handleImport = async () => {
    if (working.current || !rows.length) return;
    working.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await RequisitionItemService.importRows(requisition.ID_REQUISICAO, rows, replaceExisting);
      dispatch(setRefresh(!refresh));
      dispatch(setFeedback({ message: `${result.count} itens ${replaceExisting ? "atualizados" : "adicionados"} na requisição.`, type: "success" }));
      setOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Não foi possível confirmar a importação. Confira os itens da requisição antes de tentar novamente.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  };

  const status = requisition.status?.nome?.trim().toLowerCase();
  const personId = Number(user?.CODPESSOA);
  const canImport = status === "em edição" &&
    (Number(user?.PERM_COMPRADOR) === 1 || Number(user?.PERM_ADMINISTRADOR) === 1 ||
      (personId > 0 && personId === Number(requisition.ID_RESPONSAVEL)));
  if (!canImport) return null;

  return (
    <>
      <Button variant="contained" size="small" startIcon={<UploadFileIcon />} onClick={() => {
        setRows([]);
        setFilename("");
        setError("");
        setReplaceExisting(false);
        setOpen(true);
      }}>
        Importar itens
      </Button>
      <Dialog open={open} onClose={() => { if (!busy) setOpen(false); }} fullWidth maxWidth="sm">
        <DialogTitle>Anexar itens</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              A tabela não pode conter cabeçalho. observação do item na coluna A, QTD na coluna B e Unidade na coluna C. Ambas obrigatórias.
            </DialogContentText>
            <Typography variant="body2" color="text.secondary">
              Formatos: XLSX, XLS ou CSV. Será lida a primeira aba. A QTD deve ser inteira e maior que zero.
            </Typography>
            <FormControlLabel control={<Checkbox checked={replaceExisting} disabled={busy} onChange={(event) => {
              setReplaceExisting(event.target.checked);
              setError("");
            }} />} label="Atualizar itens existentes na requisição" />
            <Typography variant="body2" color="text.secondary">
              {replaceExisting
                ? "Atualiza apenas Material ou serviço não cadastrado com campos incompletos, na ordem dos itens da requisição. Linhas com observação, QTD e unidade preenchidas serão preservadas. O número de linhas da tabela não pode superar o de itens disponíveis."
                : "Cria um novo item Material ou serviço não cadastrado na requisição para cada linha da tabela."}
            </Typography>
            <AttachmentDropZone disabled={busy} onFiles={readFile}>
              <Button component="label" disabled={busy}>
                Adicionar Anexo
                <input type="file" hidden disabled={busy} accept=".xlsx,.xls,.csv" onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  event.target.value = "";
                  if (files.length) void readFile(files);
                }} />
              </Button>
            </AttachmentDropZone>
            {filename && <Typography variant="body2">{filename} — {rows.length} itens</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" disabled={busy || !rows.length} onClick={handleImport}>
            {busy ? "Processando..." : replaceExisting ? "Atualizar itens" : "Criar itens"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttachRequisitionItemsButton;
