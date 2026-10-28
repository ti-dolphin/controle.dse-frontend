import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import RequisitionHeaderEditDialog from "./RequisitionHeaderEditDialog";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import { setFeedback } from "../../redux/slices/feedBackSlice";

const headerTextSx = {
  fontSize: {
    xs: "0.8rem",
    sm: "1.2rem",
  },
  fontWeight: 600,
  color: "primary.main",
} as const;

interface EditableSpanProps {
  value?: string | number | null;
  canEdit: boolean;
  onStartEditing: () => void;
}

const EditableSpan = ({ value, canEdit, onStartEditing }: EditableSpanProps) => {
  const content = (
    <Typography
      component="span"
      onDoubleClick={canEdit ? onStartEditing : undefined}
      sx={{
        ...headerTextSx,
        cursor: canEdit ? "pointer" : "default",
        userSelect: canEdit ? "none" : "auto",
        "&:hover": canEdit ? { textDecoration: "underline" } : undefined,
      }}
    >
      {value || "-"}
    </Typography>
  );

  if (!canEdit) {
    return content;
  }

  return (
    <Tooltip title="Duplo clique para editar" arrow>
      {content}
    </Tooltip>
  );
};

const RequisitionHeaderTitle = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { requisition } = useSelector((state: RootState) => state.requisition);

  const isAdmin = Number(user?.PERM_ADMINISTRADOR) === 1;
  const isRequisitante = Number(requisition.ID_RESPONSAVEL) === Number(user?.CODPESSOA)
  const canEdit = (isAdmin || isRequisitante) && Boolean(requisition.ID_REQUISICAO);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [initialFocus, setInitialFocus] = useState<"description" | "project">(
    "description"
  );

  const openEditDialog = (focus: "description" | "project") => {
    setInitialFocus(focus);
    setEditDialogOpen(true);
  };

  const toggleFavorite = async () => {
    const projectId = Number(requisition.ID_PROJETO);
    if (!projectId || savingFavorite) return;
    const nextFavorite = !requisition.projeto_favoritado;
    setSavingFavorite(true);
    try {
      await RequisitionService.setProjectFavorite(projectId, nextFavorite);
      dispatch(setRequisition({ ...requisition, projeto_favoritado: nextFavorite }));
    } catch {
      dispatch(setFeedback({
        message: "Não foi possível atualizar o projeto favorito",
        type: "error",
      }));
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.75,
      }}
    >
      <Typography component="span" sx={headerTextSx}>
        {requisition.ID_REQUISICAO}
      </Typography>
      <Typography component="span" sx={headerTextSx}>
        |
      </Typography>

      <EditableSpan
        value={requisition.DESCRIPTION}
        canEdit={canEdit}
        onStartEditing={() => openEditDialog("description")}
      />

      <Typography component="span" sx={headerTextSx}>
        |
      </Typography>

      <EditableSpan
        value={requisition.projeto?.DESCRICAO}
        canEdit={canEdit}
        onStartEditing={() => openEditDialog("project")}
      />

      <Tooltip title={requisition.projeto_favoritado ? "Remover projeto dos favoritos" : "Favoritar projeto"}>
        <span>
          <IconButton
            size="small"
            aria-label={requisition.projeto_favoritado ? "Remover projeto dos favoritos" : "Favoritar projeto"}
            onClick={toggleFavorite}
            disabled={savingFavorite || !requisition.ID_PROJETO}
            sx={{ ml: 0.25 }}
          >
            {requisition.projeto_favoritado
              ? <StarIcon sx={{ color: "#fbc02d" }} />
              : <StarBorderIcon sx={{ color: "#fff", filter: "drop-shadow(0 0 1px #666)" }} />}
          </IconButton>
        </span>
      </Tooltip>

      {editDialogOpen && (
        <RequisitionHeaderEditDialog
          open
          requisition={requisition}
          initialFocus={initialFocus}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
    </Box>
  );
};

export default RequisitionHeaderTitle;
