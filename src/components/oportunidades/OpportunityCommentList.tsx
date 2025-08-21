import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { getDateStringFromISOstring } from "../../utils";
import { OpportunityCommentService } from "../../services/oportunidades/OpportunityCommentService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";

interface OpportunityComment {
  CODCOMENTARIO: number;
  CODOS: number;
  RECCREATEDON: string;
  DESCRICAO: string;
  RECCREATEDBY: string;
}

const OpportunityCommentList = () => {
  const dispatch = useDispatch();
  const { CODOS } = useParams<{ CODOS: string }>();
  const user = useSelector((state: RootState) => state.user.user);
  const [comments, setComments] = useState<OpportunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] =
    useState<OpportunityComment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await OpportunityCommentService.getMany(Number(CODOS));
      setComments(data);
    } catch {
      dispatch(
        setFeedback({ type: "error", message: "Falha ao carregar comentários" })
      );
    }
  }, [dispatch, CODOS]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addComment = (comment: OpportunityComment) =>
    setComments((prev) => [comment, ...prev]);

  const removeComment = (id: number) =>
    setComments((prev) => prev.filter((c) => c.CODCOMENTARIO !== id));

  const replaceComment = (comment: OpportunityComment) =>
    setComments((prev) =>
      prev.map((c) => (c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c))
    );

  const permToEditOrDelete = (comment: OpportunityComment) =>
    user?.NOME === comment.RECCREATEDBY || user?.PERM_ADMINISTRADOR;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const createdComment = await OpportunityCommentService.create({
        CODOS: Number(CODOS),
        DESCRICAO: newComment,
        RECCREATEDBY: user?.NOME || "",
        RECCREATEDON: new Date().toISOString(),
      });
      addComment(createdComment);
      setNewComment("");
    } catch {
      dispatch(
        setFeedback({ type: "error", message: "Erro ao adicionar comentário" })
      );
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editingComment.DESCRICAO.trim()) return;
    try {
      const updated = await OpportunityCommentService.update(
        editingComment.CODCOMENTARIO,
        { DESCRICAO: editingComment.DESCRICAO }
      );
      replaceComment(updated);
      setEditDialogOpen(false);
      setEditingComment(null);
    } catch {
      dispatch(
        setFeedback({ type: "error", message: "Erro ao atualizar comentário" })
      );
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await OpportunityCommentService.delete(commentToDelete);
      removeComment(commentToDelete);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch {
      dispatch(
        setFeedback({ type: "error", message: "Erro ao excluir comentário" })
      );
    }
  };

  return (
    <Box sx={{width: '100%'}}>
      <TextField
        fullWidth
        placeholder="Adicionar comentário..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        variant="outlined"
        size="small"
        multiline
        maxRows={3}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
          }
        }}
        sx={{
          mb: 1,
          "& .MuiInputBase-root": { fontSize: 13, py: 0.5 },
        }}
      />
      <List dense sx={{ py: 0 }}>
        {comments.map((comment) => (
          <ListItem
            key={comment.CODCOMENTARIO}
            disableGutters
            sx={{ py: 0.5, display: "flex", gap: 1.8 }}
            secondaryAction={
              permToEditOrDelete(comment) && (
                <Box sx={{display: 'flex', gap: 1}}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingComment(comment);
                      setEditDialogOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setCommentToDelete(comment.CODCOMENTARIO);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
            }
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                {comment.RECCREATEDBY?.[0] || "?"}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
              secondaryTypographyProps={{ fontSize: 12, lineHeight: 1.2 }}
              primary={`${comment.RECCREATEDBY} • ${getDateStringFromISOstring(
                comment.RECCREATEDON
              )}`}
              secondary={comment.DESCRICAO}
            />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: 16, py: 1 }}>
          Editar comentário
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <TextField
            fullWidth
            value={editingComment?.DESCRICAO || ""}
            onChange={(e) =>
              setEditingComment((prev) =>
                prev ? { ...prev, DESCRICAO: e.target.value } : null
              )
            }
            variant="outlined"
            size="small"
            multiline
            maxRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ py: 1 }}>
          <Button
            size="small"
            color="error"
            onClick={() => setEditDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button size="small" color="success" onClick={handleEditComment}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteComment}
      />
    </Box>
  );
};

export default OpportunityCommentList;
