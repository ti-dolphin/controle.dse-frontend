import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import NoteCommentService from "../../services/NoteCommentService";
import { NoteComment } from "../../models/NoteComment";
import { format } from "date-fns";

interface NoteCommentDialogProps {
  open: boolean;
  onClose: () => void;
  codapont: number;
  userName: string;
  onCommentChange?: () => void;
}

const NoteCommentDialog: React.FC<NoteCommentDialogProps> = ({
  open,
  onClose,
  codapont,
  userName,
  onCommentChange,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [comments, setComments] = useState<NoteComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedComments, setSelectedComments] = useState<GridRowSelectionModel>([]);

  const fetchComments = useCallback(async () => {
    if (!codapont) return;
    
    setLoading(true);
    try {
      const data = await NoteCommentService.getMany(codapont);
      setComments(data);
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: error.message || "Erro ao buscar comentários",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [codapont, dispatch]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      dispatch(
        setFeedback({
          message: "Digite um comentário",
          type: "error",
        })
      );
      return;
    }

    setLoading(true);
    try {
      await NoteCommentService.create({
        CODAPONT: codapont,
        DESCRICAO: newComment,
        RECCREATEDBY: userName,
        EMAIL: false,
      });

      setNewComment("");
      await fetchComments();
      onCommentChange?.();

      dispatch(
        setFeedback({
          message: "Comentário criado com sucesso",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: error.message || "Erro ao criar comentário",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComments = async () => {
    if (selectedComments.length === 0) {
      dispatch(
        setFeedback({
          message: "Selecione ao menos um comentário para excluir",
          type: "error",
        })
      );
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedComments.map((id) =>
          NoteCommentService.delete(Number(id))
        )
      );

      setSelectedComments([]);
      await fetchComments();
      onCommentChange?.();

      dispatch(
        setFeedback({
          message: "Comentário(s) excluído(s) com sucesso",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: error.message || "Erro ao excluir comentário(s)",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "CODCOMENTARIO",
      headerName: "Id",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DESCRICAO",
      headerName: "Descrição",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "RECCREATEDON",
      headerName: "Data",
      width: 150,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value: any) => {
        try {
          return format(new Date(value), "dd/MM/yyyy HH:mm");
        } catch {
          return value;
        }
      },
    },
    {
      field: "RECCREATEDBY",
      headerName: "Usuário",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          maxHeight: 700,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Comentários do Apontamento</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Campo de novo comentário */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Comentário
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Digite seu comentário aqui..."
              variant="outlined"
            />
          </Box>

          {/* Botões de ação */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            
            <Button
              variant="outlined"
              size="small"
              onClick={handleDeleteComments}
              disabled={selectedComments.length === 0 || loading || (!user?.PERM_COMENT_APONT && !user?.PERM_ADMINISTRADOR)}
              title={(!user?.PERM_COMENT_APONT && !user?.PERM_ADMINISTRADOR) ? "Você não tem permissão para excluir comentários" : ""}
              sx={{ fontSize: 11 }}
            >
              Excluir
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateComment}
              disabled={!newComment.trim() || loading || (!user?.PERM_COMENT_APONT && !user?.PERM_ADMINISTRADOR)}
              title={(!user?.PERM_COMENT_APONT && !user?.PERM_ADMINISTRADOR) ? "Você não tem permissão para criar comentários" : ""}
              sx={{ fontSize: 11 }}
            >
              Comentar
            </Button>
          </Box>

          {/* Tabela de comentários */}
          <Box sx={{ height: 350, width: "100%" }}>
            <DataGrid
              rows={comments}
              columns={columns}
              loading={loading}
              checkboxSelection
              disableRowSelectionOnClick
              rowSelectionModel={selectedComments}
              onRowSelectionModelChange={setSelectedComments}
              getRowId={(row) => row.CODCOMENTARIO}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: 12,
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: 12,
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteCommentDialog;
