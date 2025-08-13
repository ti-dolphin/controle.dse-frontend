import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { setCreating, setMode } from "../../redux/slices/requisicoes/requisitionSlice";
import { Modal, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RequisitionForm from "./RequisitionForm";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    minWidth: 350,
};
const RequisitionFormModal = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.requisition);
    const handleOpen = () => {
        dispatch(setMode("create"));
        dispatch(setCreating(true));
    };
    const handleClose = () => {
        dispatch(setMode("view"));
    };
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { sx: {
                    bgcolor: "secondary.main",
                    color: "white",
                    borderRadius: "50%",
                    "&:hover": {
                        bgcolor: "secondary.main",
                    },
                }, onClick: handleOpen, "aria-label": "Adicionar Requisi\u00E7\u00E3o", children: _jsx(AddIcon, {}) }), _jsx(Modal, { open: mode === "create", onClose: handleClose, children: _jsx(Box, { sx: style, children: _jsx(RequisitionForm, {}) }) })] }));
};
export default RequisitionFormModal;
