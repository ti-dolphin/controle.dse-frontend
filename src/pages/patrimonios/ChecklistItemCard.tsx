
import { Box, Typography, IconButton, CardContent, Button, CircularProgress } from "@mui/material"
import { ChecklistItem } from "../../models/patrimonios/ChecklistItem"
import VisibilityIcon from '@mui/icons-material/Visibility';
import imagePlaceholder from '../../assets/images/imagePlaceholder.svg';
import { Checklist } from "../../models/patrimonios/Checklist";
import { useChecklistItemPermission } from "../../hooks/patrimonios/useChecklistItemPermission";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FirebaseService from "../../services/FireBaseService";
import { ChecklistItemService } from "../../services/patrimonios/ChecklistItemService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { set } from "lodash";
import { useState } from "react";
import BaseViewFileDialog from "../../components/shared/BaseVIewFileDialog";

interface ChecklistItemCardProps {
  checklistItem: ChecklistItem;
  checklist: Partial<Checklist>;
  updateSingleItem?: (
    item: Partial<ChecklistItem>,
    id_item_checklist_movimentacao: number
  ) => void;
}
export default function ChecklistItemCard({
  checklist,
  checklistItem,
  updateSingleItem,
}: ChecklistItemCardProps) {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { permissionToUploadImage } = useChecklistItemPermission(checklist);
  const [fullScreenImage, setFullScreenImage] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!checklistItem) return;
    if(!updateSingleItem) return;
    try {
      setLoading(true);
      const file = e.target.files[0];
      const fileUrl = await FirebaseService.upload(file, file.name || "");
      const { id_item_checklist_movimentacao } = checklistItem;
      const payload: Partial<ChecklistItem> = { arquivo: fileUrl };
      const updatedITem = await ChecklistItemService.update(
        id_item_checklist_movimentacao,
        payload
      );
      updateSingleItem(updatedITem, id_item_checklist_movimentacao);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: `Erro ao fazer upload da imagem`,
          type: "error",
        })
      );
    }
    //TODO: upload image
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        margin: 1,
        border: 1,
        borderRadius: 2,
        borderColor: "divider",
        boxShadow: 2,
        height: 380,
      }}
    >
      {/* //Card media */}
      <Box
        onClick={() => setFullScreenImage(true)}
        sx={{
          height: 200,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            component="img"
            src={
              checklistItem.arquivo ? checklistItem.arquivo : imagePlaceholder
            }
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        )}
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "start",
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          {checklistItem.nome_item_checklist}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {checklistItem.observacao}
        </Typography>
        {permissionToUploadImage && (
          <>
            <input
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={uploadImage}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                onChange={uploadImage}
              >
                Anexar imagem
              </Button>
            </label>
          </>
        )}
      </CardContent>

      <BaseViewFileDialog
        open={fullScreenImage}
        onClose={() => setFullScreenImage(false)}
        fileUrl={checklistItem.arquivo || ""}
      />
    </Box>
  );
}
