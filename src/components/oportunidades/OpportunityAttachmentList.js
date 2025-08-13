import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import OpportunityAttachmentService from '../../services/oportunidades/OpportunityAttachmentService';
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FirebaseService from '../../services/FireBaseService';
import BaseViewFileDialog from '../shared/BaseVIewFileDialog';
import StyledLink from '../shared/StyledLink';
const OpportunityAttachmentList = () => {
    const dispatch = useDispatch();
    const { CODOS } = useParams();
    const user = useSelector((state) => state.user.user);
    const [attachments, setAttachments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [attachmentBeingDeleted, setAttachmentBeingDeleted] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    //handleDelete 
    const handleUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        if (!user)
            return;
        const file = e.target.files[0];
        setLoading(true);
        try {
            const newFile = {
                codos: Number(CODOS),
                nome_arquivo: file.name,
                arquivo: "",
            };
            const fileUrl = await FirebaseService.upload(file, newFile.nome_arquivo || '');
            newFile.arquivo = fileUrl;
            const createdFile = await OpportunityAttachmentService.create(newFile);
            setAttachments((prev) => [...prev, createdFile]);
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
    //fetchData
    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const attachments = await OpportunityAttachmentService.getMany(Number(CODOS));
            setAttachments(attachments);
        }
        catch (error) {
            dispatch(setFeedback({
                message: "Erro ao buscar anexos",
                type: "error",
            }));
        }
        finally {
            setLoading(false);
        }
    }, [CODOS, dispatch]);
    const handleDelete = React.useCallback(async () => {
        if (attachmentBeingDeleted) {
            try {
                const { id_anexo_os } = attachmentBeingDeleted;
                await FirebaseService.delete(attachmentBeingDeleted.arquivo);
                await OpportunityAttachmentService.delete(id_anexo_os);
                setAttachments(attachments.filter((attachment) => attachment.id_anexo_os !== attachmentBeingDeleted.id_anexo_os));
                dispatch(setFeedback({
                    message: "Anexo excluído com sucesso",
                    type: "success",
                }));
                setAttachmentBeingDeleted(null);
            }
            catch (error) {
                dispatch(setFeedback({
                    message: "Erro ao excluir anexo",
                    type: "error",
                }));
            }
        }
    }, [attachmentBeingDeleted, dispatch, fetchData]);
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (_jsxs(Box, { sx: {
            display: "flex",
            width: "fit-content",
            flexDirection: "column",
            alignItems: "start",
            gap: 2,
        }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, color: "primary.main", fontWeight: "bold", children: "Anexos" }), !loading && (_jsx(List, { children: attachments.map((attachment) => (_jsxs(ListItem, { divider: true, sx: { maxHeight: 40 }, children: [_jsx(Stack, { direction: "row", alignItems: "center", gap: 1, children: _jsx(StyledLink, { link: attachment.arquivo, onClick: () => setSelectedFile(attachment) }) }), _jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { edge: "end", color: "error", onClick: () => setAttachmentBeingDeleted(attachment), children: _jsx(DeleteIcon, {}) }) })] }, attachment.id_anexo_os))) })), loading && (_jsx(Box, { sx: { display: "flex", justifyContent: "center", width: "100%" }, children: _jsx(CircularProgress, { color: "primary" }) })), _jsxs(Button, { variant: "contained", component: "label", startIcon: _jsx(CloudUploadIcon, {}), disabled: loading, children: ["Adicionar Anexo", _jsx("input", { type: "file", hidden: true, onChange: handleUpload, accept: "*" })] }), _jsx(BaseDeleteDialog, { open: Boolean(attachmentBeingDeleted), onConfirm: handleDelete, onCancel: () => setAttachmentBeingDeleted(null) }), _jsx(BaseViewFileDialog, { open: selectedFile !== null, onClose: () => setSelectedFile(null), fileUrl: selectedFile?.arquivo || "", title: selectedFile?.nome_arquivo })] }));
};
export default OpportunityAttachmentList;
