import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { List, ListItem, ListItemText, Divider, IconButton, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Tooltip, Typography, Stack, } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OpportunityCommentService } from "../../services/oportunidades/OpportunityCommentService";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import { formatDateToISOstring, getDateStringFromISOstring } from "../../utils";
const OpportunityCommentList = () => {
    const dispatch = useDispatch();
    const { CODOS } = useParams();
    const user = useSelector((state) => state.user.user);
    const [comments, setComments] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentBeingDeleted, setCommentBeingDeleted] = useState(null);
    // const [commentBeingEdited, setCommentBeingEdited] = useState<OpportunityComment | null>(null);
    const [newComment, setNewComment] = useState("");
    const [creating, setCreating] = useState(false);
    const handleOpenDeleteDialog = (comment) => {
        setCommentBeingDeleted(comment);
        setDeleteDialogOpen(true);
    };
    // const saveComment = async (updatedComment: Partial<OpportunityComment>) => {
    //   if (!updatedComment.CODCOMENTARIO) return;
    //   try {
    //     const comment = await OpportunityCommentService.update(
    //       updatedComment.CODCOMENTARIO,
    //       updatedComment
    //     );
    //     setComments(
    //       comments.map((c) =>
    //         c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c
    //       )
    //     );
    //     setCommentBeingEdited(comment);
    //   } catch (e) {}
    // };
    const handleCreateComment = async () => {
        if (!CODOS)
            return;
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
            setComments(comments.filter((comment) => comment.CODCOMENTARIO !== commentBeingDeleted.CODCOMENTARIO));
            setDeleteDialogOpen(false);
            setCommentBeingDeleted(null);
            dispatch(setFeedback({
                message: "Comentário da oportunidade excluído!",
                type: "success",
            }));
        }
    };
    const fetchCommnts = useCallback(async () => {
        if (!CODOS)
            return;
        const comments = await OpportunityCommentService.getMany(Number(CODOS));
        setComments(comments);
    }, [CODOS]);
    useEffect(() => {
        fetchCommnts();
    }, [fetchCommnts]);
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "start",
        }, children: [_jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [_jsx(Typography, { variant: "h6", color: "primary.main", fontWeight: "bold", children: "Coment\u00E1rios" }), _jsx(Tooltip, { title: "Adicionar Coment\u00E1rio", children: _jsx(IconButton, { sx: {
                                backgroundColor: "primary.main",
                                color: "white",
                                height: 30,
                                width: 30,
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                },
                            }, onClick: () => setCreating(true), children: _jsx(AddIcon, {}) }) })] }), _jsxs(List, { children: [_jsx(Divider, {}), comments.map((comment) => (_jsxs(ListItem, { children: [_jsxs(Stack, { direction: "column", width: "100%", gap: 1, children: [_jsx(ListItemText, { primary: comment.CODCOMENTARIO, secondary: comment.DESCRICAO }), _jsxs(Typography, { variant: "caption", children: ["Criado por ", comment.RECCREATEDBY, " em", " ", getDateStringFromISOstring(comment.RECCREATEDON)] })] }), _jsx(IconButton, { onClick: () => handleOpenDeleteDialog(comment), color: "error", children: _jsx(DeleteIcon, {}) })] }, comment.CODCOMENTARIO)))] }), _jsx(BaseDeleteDialog, { open: deleteDialogOpen, onConfirm: handleDeleteComment, onCancel: () => {
                    setDeleteDialogOpen(false);
                    setCommentBeingDeleted(null);
                } }), _jsxs(Dialog, { open: creating, onClose: () => setCreating(false), children: [_jsx(DialogTitle, { children: _jsx(Typography, { variant: "h6", fontWeight: "bold", color: "primary.main", children: "Novo Coment\u00E1rio" }) }), _jsx(DialogContent, { sx: { minWidth: 300 }, children: _jsx(TextField, { label: "Coment\u00E1rio", multiline: true, fullWidth: true, value: newComment, sx: { mt: 2 }, onChange: (e) => setNewComment(e.target.value) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { variant: "contained", color: "error", onClick: () => setCreating(false), children: "Cancelar" }), _jsx(Button, { variant: "contained", onClick: handleCreateComment, children: "Salvar" })] })] })] }));
};
export default OpportunityCommentList;
