import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  LinearProgress,
  Checkbox,
  TextField,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { RootState } from "../../redux/store";
import {
  OpportunityAlinhamentoComment,
  OpportunityAlinhamentoService,
} from "../../services/oportunidades/OpportunityAlinhamentoService";
import { OpportunityAlinhamento } from "../../models/oportunidades/OpportunityAlinhamento";

interface OpportunityAlinhamentoListProps {
  CODOS: number;
}

type CommentsByItem = Record<number, OpportunityAlinhamentoComment[]>;

const OpportunityAlinhamentoList = ({ CODOS }: OpportunityAlinhamentoListProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [itens, setItens] = useState<OpportunityAlinhamento[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [commentsByItem, setCommentsByItem] = useState<CommentsByItem>({});
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [draftComments, setDraftComments] = useState<Record<number, string>>({});

  const handleAddComment = async (itemId: number) => {
    const texto = (draftComments[itemId] || "").trim();
    if (!texto) return;
    try {
      const comment = await OpportunityAlinhamentoService.createComment({
        id_alinhamento: itemId,
        comentario: texto,
      });
      setCommentsByItem((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), comment],
      }));
      setDraftComments((prev) => ({ ...prev, [itemId]: "" }));
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao adicionar comentário no alinhamento" }));
    }
  };

  const handleDeleteComment = async (itemId: number, commentId: number) => {
    try {
      await OpportunityAlinhamentoService.deleteComment(commentId);
      setCommentsByItem((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || []).filter((comment) => comment.id !== commentId),
      }));
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao remover comentário do alinhamento" }));
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [data, comments] = await Promise.all([
        OpportunityAlinhamentoService.getMany(CODOS),
        OpportunityAlinhamentoService.getManyComments(CODOS),
      ]);
      setItens(data);
      setCommentsByItem(comments.reduce<CommentsByItem>((grouped, comment) => {
        grouped[comment.id_alinhamento] = grouped[comment.id_alinhamento] || [];
        grouped[comment.id_alinhamento].push(comment);
        return grouped;
      }, {}));
      setExpandedComments([]);
      setDraftComments({});
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao carregar alinhamento" }));
    }
  }, [dispatch, CODOS]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const total = itens.length;
  const done = itens.filter((i) => i.concluido).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleToggle = async (item: OpportunityAlinhamento) => {
    try {
      const updated = await OpportunityAlinhamentoService.update(item.id_alinhamento, {
        concluido: !item.concluido,
      });
      setItens((prev) => prev.map((i) => (i.id_alinhamento === item.id_alinhamento ? updated : i)));
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao atualizar item" }));
    }
  };

  const handleAdd = async () => {
    const descricao = novoItem.trim();
    if (!descricao) return;
    const ordem = itens.length > 0 ? Math.max(...itens.map((i) => i.ordem)) + 1 : 1;
    try {
      const item = await OpportunityAlinhamentoService.create({ CODOS, descricao, ordem });
      setItens((prev) => [...prev, item]);
      setNovoItem("");
      setAddingItem(false);
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao adicionar item" }));
    }
  };

  const handleDelete = async (item: OpportunityAlinhamento) => {
    try {
      await OpportunityAlinhamentoService.delete(item.id_alinhamento);
      setItens((prev) => prev.filter((i) => i.id_alinhamento !== item.id_alinhamento));
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao excluir item" }));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(itens);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    const comOrdem = reordered.map((item, index) => ({ ...item, ordem: index + 1 }));

    setItens(comOrdem);

    try {
      await OpportunityAlinhamentoService.reordenar(
        comOrdem.map((item) => ({ id_alinhamento: item.id_alinhamento, ordem: item.ordem }))
      );
    } catch {
      dispatch(setFeedback({ type: "error", message: "Erro ao reordenar itens" }));
      fetchData();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
          Alinhamento
        </Typography>
        <IconButton
          size="small"
          onClick={() => setAddingItem(true)}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            height: 24,
            width: 24,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>

      {total > 0 && (
        <Box sx={{ mb: 1.5, flexShrink: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {done}/{total} concluídos
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {pct}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      )}

      <Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="alinhamento">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {itens.map((item, index) => (
                  <Draggable key={item.id_alinhamento} draggableId={String(item.id_alinhamento)} index={index}>
                    {(dragProvided) => (
                      <Box>
                        <Stack
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          direction="row"
                          alignItems="center"
                          sx={{ backgroundColor: "white", borderRadius: 1, mb: 0.5, pr: 1 }}
                        >
                          <Box {...dragProvided.dragHandleProps} sx={{ display: "flex", color: "text.secondary" }}>
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                          <Checkbox size="small" checked={item.concluido} onChange={() => handleToggle(item)} />
                          <Typography
                            variant="body2"
                            sx={{
                              flex: 1,
                              textDecoration: item.concluido ? "line-through" : "none",
                              color: item.concluido ? "text.secondary" : "text.primary",
                            }}
                          >
                            {item.descricao}
                          </Typography>
                          <IconButton size="small" onClick={() => handleDelete(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                        <Box sx={{ pl: 5, pr: 1, pb: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<CommentOutlinedIcon fontSize="small" />}
                            endIcon={expandedComments.includes(item.id_alinhamento) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            onClick={() => setExpandedComments((prev) => prev.includes(item.id_alinhamento)
                              ? prev.filter((id) => id !== item.id_alinhamento)
                              : [...prev, item.id_alinhamento])}
                            sx={{
                              textTransform: "none",
                              minHeight: 28,
                              px: 0.75,
                              backgroundColor: "#fff",
                              color: "primary.main",
                              borderColor: "primary.main",
                              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                                color: "primary.main",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "primary.main",
                              },
                              "&:hover": {
                                backgroundColor: "#fff",
                                borderColor: "primary.dark",
                                color: "primary.dark",
                                "& .MuiButton-startIcon, & .MuiButton-endIcon, & .MuiSvgIcon-root": {
                                  color: "primary.dark",
                                },
                              },
                            }}
                          >
                            Comentários ({commentsByItem[item.id_alinhamento]?.length || 0})
                          </Button>
                          <Collapse in={expandedComments.includes(item.id_alinhamento)}>
                            <List dense disablePadding sx={{ mb: 0.5 }}>
                              {(commentsByItem[item.id_alinhamento] || []).map((comment) => (
                                <ListItem
                                  key={comment.id}
                                  disableGutters
                                  sx={{ py: 0.25, pr: 4 }}
                                  secondaryAction={
                                    Number(user?.CODPESSOA) === Number(comment.criado_por) || Boolean(Number(user?.PERM_ADMINISTRADOR)) ? (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="Remover comentário"
                                        onClick={() => handleDeleteComment(item.id_alinhamento, comment.id)}
                                      >
                                        <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                    ) : null
                                  }
                                >
                                  <ListItemText
                                    primary={comment.comentario}
                                    secondary={`${comment.criado_por_nome || `Usuário ${comment.criado_por}`} • ${new Date(comment.criado_em).toLocaleString()}`}
                                    primaryTypographyProps={{ variant: "body2", sx: { whiteSpace: "pre-wrap", overflowWrap: "anywhere" } }}
                                    secondaryTypographyProps={{ variant: "caption" }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                            <Stack direction="row" alignItems="flex-start" gap={0.5}>
                              <TextField
                                fullWidth
                                size="small"
                                multiline
                                maxRows={3}
                                placeholder="Adicionar comentário..."
                                value={draftComments[item.id_alinhamento] || ""}
                                onChange={(event) => setDraftComments((prev) => ({ ...prev, [item.id_alinhamento]: event.target.value }))}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    handleAddComment(item.id_alinhamento);
                                  }
                                }}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    fontSize: 13,
                                    py: 0.5,
                                    backgroundColor: "#fff",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.dark",
                                  },
                                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                  },
                                }}
                              />
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label="Enviar comentário"
                                disabled={!(draftComments[item.id_alinhamento] || "").trim()}
                                onClick={() => handleAddComment(item.id_alinhamento)}
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Collapse>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      <Dialog open={addingItem} onClose={() => setAddingItem(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Adicionar item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            size="small"
            placeholder="Descrição do item"
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddingItem(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdd}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpportunityAlinhamentoList;
