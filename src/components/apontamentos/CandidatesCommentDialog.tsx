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
import { format } from "date-fns";
import CandidateApplicationService, { CandidateComment } from '../../services/CandidateApplicationService'

interface CandidateCommentDialogProps {
  open: boolean;
  onClose: () => void;
  id_candidato: number;
  onCommentChange?: (hasComments: boolean) => void;
}

const CandidatesCommentDialog: React.FC<CandidateCommentDialogProps> = ({
  open,
  onClose,
  id_candidato,
  onCommentChange,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [comments, setComments] = useState<CandidateComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedComments, setSelectedComments] = useState<GridRowSelectionModel>([]);

  const fetchComments = useCallback(async () => {
    if (!id_candidato) return;
    setLoading(true);
    setSelectedComments([]);
    try {
      const data = await CandidateApplicationService.getCandidateComments(id_candidato);
      setComments(data);
      return data;
    } catch (error: any) {
      dispatch(setFeedback({ message: error?.response?.data?.error || "Erro ao buscar comentários", type: "error" }));
      return null;
    } finally {
      setLoading(false);
    }
  }, [id_candidato, dispatch]);

  useEffect(() => {
    if (open) fetchComments();
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
      await CandidateApplicationService.createCandidateComment(id_candidato, newComment.trim());

      setNewComment("");
      const updatedComments = await fetchComments();
      if (updatedComments) onCommentChange?.(updatedComments.length > 0);

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
          CandidateApplicationService.deleteCandidateComment(Number(id))
        )
      );

      setSelectedComments([]);
      const updatedComments = await fetchComments();
      if (updatedComments) onCommentChange?.(updatedComments.length > 0);

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
      field: "id_comentario",
      headerName: "Id",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "comentario",
      headerName: "Descrição",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "criado_em",
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
      field: "criado_por_nome",
      headerName: "Usuário",
      width: 180,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value: unknown, row: CandidateComment) => row.PESSOA?.NOME || "-",
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
          <Typography variant="h6">Comentários do Candidato</Typography>
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
              disabled={selectedComments.length === 0 || loading || (Number(user?.PERM_COMENT_CANDIDATO) !== 1 && Number(user?.PERM_ADMINISTRADOR) !== 1)}
              title={(Number(user?.PERM_COMENT_CANDIDATO) !== 1 && Number(user?.PERM_ADMINISTRADOR) !== 1) ? "Você não tem permissão para excluir comentários" : ""}
              sx={{ fontSize: 11 }}
            >
              Excluir
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateComment}
              disabled={!newComment.trim() || loading || (Number(user?.PERM_COMENT_CANDIDATO) !== 1 && Number(user?.PERM_ADMINISTRADOR) !== 1)}
              title={(Number(user?.PERM_COMENT_CANDIDATO) !== 1 && Number(user?.PERM_ADMINISTRADOR) !== 1) ? "Você não tem permissão para criar comentários" : ""}
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
              getRowId={(row) => (row as CandidateComment).id_comentario}
              pageSizeOptions={[10, 25, 50, 1000]}
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

export default CandidatesCommentDialog;
