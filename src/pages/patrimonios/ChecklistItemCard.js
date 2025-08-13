import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, CardContent, Button, CircularProgress } from "@mui/material";
import imagePlaceholder from '../../assets/images/imagePlaceholder.svg';
import { useChecklistItemPermission } from "../../hooks/patrimonios/useChecklistItemPermission";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FirebaseService from "../../services/FireBaseService";
import { ChecklistItemService } from "../../services/patrimonios/ChecklistItemService";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { useState } from "react";
import BaseViewFileDialog from "../../components/shared/BaseVIewFileDialog";
export default function ChecklistItemCard({ checklist, checklistItem, updateSingleItem, }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { permissionToUploadImage } = useChecklistItemPermission(checklist);
    const [fullScreenImage, setFullScreenImage] = useState(false);
    const uploadImage = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        if (!checklistItem)
            return;
        if (!updateSingleItem)
            return;
        try {
            setLoading(true);
            const file = e.target.files[0];
            const fileUrl = await FirebaseService.upload(file, file.name || "");
            const { id_item_checklist_movimentacao } = checklistItem;
            const payload = { arquivo: fileUrl };
            const updatedITem = await ChecklistItemService.update(id_item_checklist_movimentacao, payload);
            updateSingleItem(updatedITem, id_item_checklist_movimentacao);
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            dispatch(setFeedback({
                message: `Erro ao fazer upload da imagem`,
                type: "error",
            }));
        }
        //TODO: upload image
    };
    return (_jsxs(Box, { sx: {
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
        }, children: [_jsx(Box, { onClick: () => setFullScreenImage(true), sx: {
                    height: 200,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }, children: loading ? (_jsx(CircularProgress, {})) : (_jsx(Box, { component: "img", src: checklistItem.arquivo ? checklistItem.arquivo : imagePlaceholder, sx: {
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: 2,
                    } })) }), _jsxs(CardContent, { sx: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "start",
                }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: checklistItem.nome_item_checklist }), _jsx(Typography, { variant: "body2", color: "textSecondary", component: "p", children: checklistItem.observacao }), permissionToUploadImage && (_jsxs(_Fragment, { children: [_jsx("input", { accept: "image/*", capture: "user", style: { display: "none" }, id: "raised-button-file", multiple: true, type: "file", onChange: uploadImage }), _jsx("label", { htmlFor: "raised-button-file", children: _jsx(Button, { variant: "contained", component: "span", startIcon: _jsx(CloudUploadIcon, {}), onChange: uploadImage, children: "Anexar imagem" }) })] }))] }), _jsx(BaseViewFileDialog, { open: fullScreenImage, onClose: () => setFullScreenImage(false), fileUrl: checklistItem.arquivo || "" })] }));
}
