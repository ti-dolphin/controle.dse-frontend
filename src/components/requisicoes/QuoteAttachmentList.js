import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Box, Typography, IconButton, List, ListItem, ListItemSecondaryAction, Button, CircularProgress, Stack, Tooltip, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StyledLink from "../shared/StyledLink";
import { useDispatch, useSelector } from "react-redux";
import FirebaseService from "../../services/FireBaseService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import { QuoteFileService } from "../../services/requisicoes/QuoteFileService";
import BaseViewFileDialog from "../shared/BaseVIewFileDialog";
const QuoteAttachmentList = ({ id_cotacao, }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingFile, setDeletingFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const openViewFile = (file) => {
        setSelectedFile(file);
    };
    const closeViewFile = () => {
        setSelectedFile(null);
    };
    const openDeleteDialog = (file) => {
        const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
        const purchaser = Number(user?.PERM_COMPRADOR) === 1;
        const deleteFilePermittedForUser = admin || purchaser;
        if (!deleteFilePermittedForUser) {
            dispatch(setFeedback({
                message: "Você não tem permissão para excluir este anexo.",
                type: "error",
            }));
            return;
        }
        setDeletingFile(file);
        setDeleteDialogOpen(true);
    };
    const closeDeleteDialog = () => {
        setDeletingFile(null);
        setDeleteDialogOpen(false);
    };
    const fetchAttachments = async () => {
        setLoading(true);
        try {
            const files = await QuoteFileService.getMany({ id_cotacao });
            setAttachments(files);
        }
        catch (err) {
            setError("Erro ao buscar anexos.");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAttachments();
        // eslint-disable-next-line
    }, [id_cotacao]);
    const handleFileChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        const file = e.target.files[0];
        const newFile = {
            id_cotacao,
            nome_arquivo: file.name,
            url: "",
        };
        setLoading(true);
        try {
            const fileUrl = await FirebaseService.upload(file, newFile.nome_arquivo || '');
            newFile.url = fileUrl;
            const createdFile = await QuoteFileService.create(newFile);
            setAttachments((prev) => [...prev, createdFile]);
            fetchAttachments();
            dispatch(setFeedback({
                message: "Anexo adicionado!",
                type: "success",
            }));
        }
        catch (err) {
            dispatch(setFeedback({
                message: `Houve um erro ao adicionar o anexo: ${err.message}`,
                type: "error",
            }));
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!deletingFile)
            return;
        const { id_anexo_cotacao } = deletingFile;
        setLoading(true);
        try {
            await FirebaseService.delete(deletingFile.url);
            await QuoteFileService.delete(id_anexo_cotacao);
            setAttachments((prev) => prev.filter((a) => a.id_anexo_cotacao !== id_anexo_cotacao));
            dispatch(setFeedback({
                message: "Anexo excluído!",
                type: "success",
            }));
            closeDeleteDialog();
        }
        catch (err) {
            dispatch(setFeedback({
                message: `Erro ao excluir anexo: ${err.message}`,
                type: "error",
            }));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Box, { children: [error && (_jsx(Typography, { color: "error", mb: 1, children: error })), loading ? (_jsx(CircularProgress, {})) : (_jsxs(List, { sx: { maxHeight: 120, overflow: "auto" }, children: [attachments.length === 0 && (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Nenhum anexo encontrado." })), attachments.map((file) => (_jsxs(ListItem, { divider: true, sx: { maxHeight: 40 }, children: [_jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [_jsx(StyledLink, { link: file.url, onClick: () => openViewFile(file) }), _jsx(Typography, { fontSize: "12px", color: "text.secondary" })] }), _jsx(ListItemSecondaryAction, { children: _jsx(Tooltip, { title: "Excluir", children: _jsx(IconButton, { edge: "end", color: "error", onClick: () => openDeleteDialog(file), children: _jsx(DeleteIcon, {}) }) }) })] }, file.id_anexo_cotacao)))] })), _jsxs(Button, { variant: "contained", component: "label", startIcon: _jsx(CloudUploadIcon, {}), disabled: loading, children: ["Adicionar Anexo", _jsx("input", { type: "file", hidden: true, onChange: handleFileChange, accept: "*" })] }), _jsx(BaseDeleteDialog, { open: deleteDialogOpen, onConfirm: handleDelete, onCancel: closeDeleteDialog }), _jsx(BaseViewFileDialog, { open: selectedFile !== null, onClose: closeViewFile, fileUrl: selectedFile?.url || "", title: selectedFile?.nome_arquivo })] }));
};
export default QuoteAttachmentList;
