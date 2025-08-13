import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setCreating, setViewing } from "../../redux/slices/oportunidades/opportunitySlice";
import OpportunityForm from "./OpportunityForm";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 4,
    borderRadius: 2,
    minWidth: {
        xs: 300,
        sm: 600
    },
};
const OpportunityFormModal = () => {
    const dispatch = useDispatch();
    const { creating, viewing } = useSelector((state) => state.opportunity);
    const close = () => {
        dispatch(setCreating(false));
        dispatch(setViewing(false));
    };
    const handleClose = () => {
        close();
    };
    return (_jsx(Modal, { open: creating || viewing, onClose: handleClose, children: _jsxs(Box, { sx: style, children: [_jsx(IconButton, { onClick: handleClose, sx: { position: "absolute", top: 0, right: 0 }, children: _jsx(CloseIcon, { color: "error" }) }), _jsx(Typography, { variant: "h6", fontWeight: 600, textTransform: "uppercase", color: "primary.main", children: "Nova Proposta" }), _jsx(Box, { sx: { mt: 4, width: '100%' }, children: _jsx(OpportunityForm, {}) })] }) }));
};
export default OpportunityFormModal;
