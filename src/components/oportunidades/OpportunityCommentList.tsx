import {
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OpportunityCommentService } from "../../services/oportunidades/OpportunityCommentService";
import { debounce, set } from "lodash";
import { OpportunityComment } from "../../models/oportunidades/OpportunityComment";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import { RootState } from "../../redux/store";
import { formatDateToISOstring, getDateStringFromDateObject, getDateStringFromISOstring } from "../../utils";

const OpportunityCommentList = () => {
  const dispatch = useDispatch();
  const { CODOS } = useParams();
  const user  = useSelector((state: RootState) => state.user.user);
  const [comments, setComments] = useState<OpportunityComment[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentBeingDeleted, setCommentBeingDeleted] =
    useState<OpportunityComment | null>(null);
  const [commentBeingEdited, setCommentBeingEdited] =
    useState<OpportunityComment | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);
  const handleOpenDeleteDialog = (comment: OpportunityComment) => {
    setCommentBeingDeleted(comment);
    setDeleteDialogOpen(true);
  };

  const saveComment = async (updatedComment: Partial<OpportunityComment>) => {
    if (!updatedComment.CODCOMENTARIO) return;
    try {
      const comment = await OpportunityCommentService.update(
        updatedComment.CODCOMENTARIO,
        updatedComment
      );
      setComments(
        comments.map((c) =>
          c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c
        )
      );
      setCommentBeingEdited(comment);
    } catch (e) {}
  };

  const debounceSaveComment = React.useMemo(
    () => debounce(saveComment, 800),
    [commentBeingEdited, comments]
  );

  const handleChangeCommentBeingEdited = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!commentBeingEdited) return;
    if (!user) return;
    setCommentBeingEdited({ ...commentBeingEdited, DESCRICAO: e.target.value });
    debounceSaveComment({ ...commentBeingEdited, DESCRICAO: e.target.value });
  };

  const handleCreateComment = async () => {
    if (!CODOS) return;
    const commnent = await OpportunityCommentService.create({
      DESCRICAO: newComment,
      CODOS: Number(CODOS),
      RECCREATEDBY: user?.NOME || "",
      CODAPONT: 0,
      RECCREATEDON: formatDateToISOstring(new Date()),
    });
    setComments([...comments, commnent]);
    setCreating(false);
    setNewComment("");
  };

  const handleDeleteComment = async () => {
    if (commentBeingDeleted) {
      await OpportunityCommentService.delete(commentBeingDeleted.CODCOMENTARIO);
      setComments(
        comments.filter(
          (comment) =>
            comment.CODCOMENTARIO !== commentBeingDeleted.CODCOMENTARIO
        )
      );
      setDeleteDialogOpen(false);
      setCommentBeingDeleted(null);
      dispatch(
        setFeedback({
          message: "Comentário da oportunidade excluído!",
          type: "success",
        })
      );
    }
  };

  const fetchCommnts = useCallback(async () => {
    if (!CODOS) return;
    const comments = await OpportunityCommentService.getMany(Number(CODOS));
    setComments(comments);
  }, [CODOS]);

  useEffect(() => {
    fetchCommnts();
  }, [fetchCommnts]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "start",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          Comentários
        </Typography>
        <Tooltip title="Adicionar Comentário">
          <IconButton
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              height: 30,
              width: 30,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => setCreating(true)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <List>
        <Divider />
        {comments.map((comment) => (
          <ListItem key={comment.CODCOMENTARIO}>
            <Stack direction="column" width="100%" gap={1}>
              <ListItemText
                primary={comment.CODCOMENTARIO}
                secondary={comment.DESCRICAO}
              />
              <Typography variant="caption">
                Criado por {comment.RECCREATEDBY} em{" "}
                {getDateStringFromISOstring(comment.RECCREATEDON)}
              </Typography>
            </Stack>
            <IconButton
              onClick={() => handleOpenDeleteDialog(comment)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleDeleteComment}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCommentBeingDeleted(null);
        }}
      />
      <Dialog open={creating} onClose={() => setCreating(false)}>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Novo Comentário
          </Typography>
        </DialogTitle>
        <DialogContent sx={{minWidth: 300}}>
          <TextField
            label="Comentário"
            multiline
            fullWidth
            value={newComment}
            sx={{ mt: 2 }}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setCreating(false)}
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCreateComment}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpportunityCommentList;
