import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/slices/userSlice';
import { Avatar, Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
const ProfileButton = () => {
    const user = useSelector((state) => state.user.user);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(clearUser());
        navigate('/auth'); // Redireciona para a página de autenticação
        handleClose();
    };
    if (!user)
        return null;
    return (_jsxs(Box, { children: [_jsx(Button, { color: "inherit", onClick: handleClick, startIcon: _jsx(Avatar, { sx: { width: 32, height: 32, bgcolor: 'secondary.main' }, children: user.NOME?.[0] || '?' }), endIcon: _jsx(ArrowDropDownIcon, { sx: { color: 'white' } }), sx: { textTransform: 'none', fontWeight: 500 }, children: _jsx(Typography, { variant: "body1", color: "primary.main", children: user.NOME?.split(' ')[0] || 'Usuário' }) }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: handleClose, children: [_jsx(MenuItem, { onClick: handleClose, children: "Perfil" }), _jsx(MenuItem, { onClick: handleLogout, children: "Sair" })] })] }));
};
export default ProfileButton;
