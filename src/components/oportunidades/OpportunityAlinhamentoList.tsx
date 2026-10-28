import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import {
  OpportunityAlinhamentoService,
} from "../../services/oportunidades/OpportunityAlinhamentoService";
import { OpportunityAlinhamento } from "../../models/oportunidades/OpportunityAlinhamento";

interface OpportunityAlinhamentoListProps {
  CODOS: number;
}

const OpportunityAlinhamentoList = ({ CODOS }: OpportunityAlinhamentoListProps) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState<OpportunityAlinhamento[]>([]);
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await OpportunityAlinhamentoService.getMany(CODOS);
      const description = data
        .map((item) => item.descricao)
        .filter((item) => item.trim())
        .join("\n");
      setItems(data);
      setText(description);
      setSavedText(description);
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao carregar alinhamento" }));
    }
  }, [dispatch, CODOS]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (saving) return;
    const description = text.trim();
    setSaving(true);
    try {
      if (items.length > 0) {
        await OpportunityAlinhamentoService.update(items[0].id_alinhamento, {
          descricao: description,
          concluido: false,
        });
        await Promise.all(items.slice(1).map((item) =>
          OpportunityAlinhamentoService.update(item.id_alinhamento, {
            descricao: "",
            concluido: false,
          })
        ));
      } else if (description) {
        const item = await OpportunityAlinhamentoService.create({
          CODOS,
          descricao: description,
          ordem: 1,
        });2
        setItems([item]);
      }
      setText(description);
      setSavedText(description);
      dispatch(setFeedback({ type: "success", message: "Alinhamento salvo com sucesso" }));
      if (items.length > 0) await fetchData();
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao salvar alinhamento" }));
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
          Alinhamento
        </Typography>
        <Button size="small" variant="contained" onClick={() => void handleSave()} disabled={saving || text === savedText}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Stack>
      <TextField
        fullWidth
        multiline
        minRows={4}
        maxRows={12}
        size="small"
        placeholder="Registre o alinhamento da oportunidade"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </Box>
  );
};

export default OpportunityAlinhamentoList;