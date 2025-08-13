import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Avatar, Box, List, ListItem, ListItemIcon, ListItemText, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, } from "@mui/material";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import { getDateStringFromISOstring } from "../../utils";
import RequisitionCommentService from "../../services/requisicoes/RequisitionCommentService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
const RequisitionCommentList = () => {
    const dispatch = useDispatch();
    const { id_requisicao } = useParams();
    const user = useSelector((state) => state.user.user);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const fetchData = useCallback(async () => {
        try {
            const data = await RequisitionCommentService.getMany({ id_requisicao });
            setComments(data);
        }
        catch {
            dispatch(setFeedback({ type: "error", message: "Falha ao carregar comentários" }));
        }
    }, [dispatch, id_requisicao]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const addComment = (comment) => setComments((prev) => [comment, ...prev,]);
    const removeComment = (id) => setComments((prev) => prev.filter((c) => c.id_comentario_requisicao !== id));
    const replaceComment = (comment) => setComments((prev) => prev.map((c) => c.id_comentario_requisicao === comment.id_comentario_requisicao
        ? comment
        : c));
    const permToEditOrDelete = (comment) => user?.CODPESSOA === comment.pessoa_criado_por?.CODPESSOA ||
        user?.PERM_ADMINISTRADOR;
    const handleAddComment = async () => {
        if (!newComment.trim())
            return;
        try {
            const createdComment = await RequisitionCommentService.create({
                id_requisicao: Number(id_requisicao),
                descricao: newComment,
                criado_por: user?.CODPESSOA || 0,
            });
            addComment(createdComment);
            setNewComment("");
        }
        catch {
            dispatch(setFeedback({ type: "error", message: "Erro ao adicionar comentário" }));
        }
    };
    const handleEditComment = async () => {
        if (!editingComment || !editingComment.descricao.trim())
            return;
        try {
            const updated = await RequisitionCommentService.update(editingComment.id_comentario_requisicao, { descricao: editingComment.descricao });
            replaceComment(updated);
            setEditDialogOpen(false);
            setEditingComment(null);
        }
        catch {
            dispatch(setFeedback({ type: "error", message: "Erro ao atualizar comentário" }));
        }
    };
    const handleDeleteComment = async () => {
        if (!commentToDelete)
            return;
        try {
            await RequisitionCommentService.delete(commentToDelete);
            removeComment(commentToDelete);
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
        }
        catch {
            dispatch(setFeedback({ type: "error", message: "Erro ao excluir comentário" }));
        }
    };
    return (_jsxs(Box, { sx: { p: 1 }, children: [_jsx(TextField, { fullWidth: true, placeholder: "Adicionar coment\u00E1rio...", value: newComment, onChange: (e) => setNewComment(e.target.value), variant: "outlined", size: "small", multiline: true, maxRows: 3, onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                    }
                }, sx: {
                    mb: 1,
                    "& .MuiInputBase-root": { fontSize: 13, py: 0.5 },
                } }), _jsx(List, { dense: true, sx: { py: 0 }, children: comments.map((comment) => (_jsxs(ListItem, { disableGutters: true, sx: { py: 0.5 }, secondaryAction: permToEditOrDelete(comment) && (_jsxs(_Fragment, { children: [_jsx(IconButton, { size: "small", onClick: () => {
                                    setEditingComment(comment);
                                    setEditDialogOpen(true);
                                }, children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => {
                                    setCommentToDelete(comment.id_comentario_requisicao);
                                    setDeleteDialogOpen(true);
                                }, children: _jsx(DeleteIcon, { fontSize: "small" }) })] })), children: [_jsx(ListItemIcon, { sx: { minWidth: 36 }, children: _jsx(Avatar, { sx: { width: 28, height: 28, fontSize: 12 }, children: comment.pessoa_criado_por?.NOME?.[0] || "?" }) }), _jsx(ListItemText, { primaryTypographyProps: {
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }, secondaryTypographyProps: { fontSize: 12, lineHeight: 1.2 }, primary: `${comment.pessoa_criado_por?.NOME} • ${getDateStringFromISOstring(comment.data_criacao)}`, secondary: comment.descricao })] }, comment.id_comentario_requisicao))) }), _jsxs(Dialog, { open: editDialogOpen, onClose: () => setEditDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontSize: 16, py: 1 }, children: "Editar coment\u00E1rio" }), _jsx(DialogContent, { sx: { py: 1 }, children: _jsx(TextField, { fullWidth: true, value: editingComment?.descricao || "", onChange: (e) => setEditingComment((prev) => prev ? { ...prev, descricao: e.target.value } : null), variant: "outlined", size: "small", multiline: true, maxRows: 3 }) }), _jsxs(DialogActions, { sx: { py: 1 }, children: [_jsx(Button, { size: "small", color: "error", onClick: () => setEditDialogOpen(false), children: "Cancelar" }), _jsx(Button, { size: "small", color: "success", onClick: handleEditComment, children: "Salvar" })] })] }), _jsx(BaseDeleteDialog, { open: deleteDialogOpen, onCancel: () => setDeleteDialogOpen(false), onConfirm: handleDeleteComment })] }));
};
export default RequisitionCommentList;
