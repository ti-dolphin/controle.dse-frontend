import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { clearUser } from '../../redux/slices/userSlice';

import { Avatar, Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

const ProfileButton: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  if (!user) return null;

  return (
    <Box >
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={<Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>{user.NOME?.[0] || '?'}</Avatar>}
        endIcon={<ArrowDropDownIcon sx={{color: 'white'}}/>}
        sx={{ textTransform: 'none', fontWeight: 500 }}
      >
        <Typography variant="body1" color="primary.main">
          {user.NOME?.split(' ')[0] || 'Usuário'}
        </Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileButton;