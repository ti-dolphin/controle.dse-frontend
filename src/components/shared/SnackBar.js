import { jsx as _jsx } from "react/jsx-runtime";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { clearFeedback } from "../../redux/slices/feedBackSlice";
const SnackBar = () => {
    const dispatch = useDispatch();
    const { message, type } = useSelector((state) => state.feedback);
    const open = Boolean(message);
    const handleClose = (_event, reason) => {
        if (reason === 'clickaway')
            return;
        dispatch(clearFeedback());
    };
    return (_jsx(Snackbar, { open: open, autoHideDuration: 4000, onClose: handleClose, anchorOrigin: { vertical: 'top', horizontal: 'center' }, children: _jsx(Alert, { onClose: handleClose, severity: type || 'info', sx: { width: '100%', color: 'white' }, variant: "filled", children: message }) }));
};
export default SnackBar;
