import { Box, Grid, IconButton, Menu, MenuItem, Typography, Stack } from '@mui/material'
import React from 'react'
import crm from '../assets/images/crm.jpg'
import patrimonios from '../assets/images/patrimonios.jpg';
import requisicoes from '../assets/images/requisicoes.jpg';
import apontamentos from '../assets/images/apontamentos.png';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';

const modules = [
  {
    name: "Requisições",
    image: requisicoes,
    path: "/requisicoes",
    description:
      "Realize solicitações de materiais aplicados no projeto, materiais de consumo, EPI's, equipamentos do operacional ou TI, ferramentas e serviços.",
  },
  {
    name: "Controle de Patrimônios",
    image: patrimonios,
    path: "/patrimonios",
    description:
      "Gerenciar a localização; Responsável pela guarda; Registro de movimentações (Obra, sede e manutenção/calibração). Controle dos acessórios (Cabos, bateria reserva)",
  },
  {
    name: "CRM",
    image: crm,
    path: "/oportunidades",
    description: "Gerenciamneto e acompanhamento de Projetos",
  },
  // {
  //   name: "Apontamentos",
  //   image: apontamentos,
  //   path: "/apontamentos",
  //   description: "Controle e registro de horas trabalhadas",
  // },
]

const HomePage = () => {

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useSelector((state: any) => state.user.user);
  const isAdmin = user ? user.PERM_ADMINISTRADOR === 1 : false;

  // Redireciona para /auth se não estiver logado
  React.useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const formatUserName = (name: string | undefined): string => {
    if (!name) return 'Usuário';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        minHeight: "100vh",
        bgcolor: "#fff",
      }}
    >

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
        }}
      >
        <Typography
          variant="body1"
          color="primary.main"
          fontWeight={500}
          sx={{
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {formatUserName(user?.NOME)}
        </Typography>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            color: "primary.main",
          }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Stack>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/perfil'); }}>
          Perfil
        </MenuItem>
        <MenuItem onClick={( ) => navigate('/auth')}>
          Logout
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={( ) => navigate('/admin')}>
            painel admin
          </MenuItem>
        )}
      </Menu>
      <Typography
        variant="h4"
        color="primary"
        gutterBottom
        textAlign="center"
        fontWeight={600}
      >
        Bem Vindo ao Dolphin Controle
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
        sx={{
          width: {
            xs: "100%",
            sm: "90%",
            md: "70%",
          },
          mt: 2,
        }}
      >
        {modules.map((module) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={module.name}
            sx={{ height: 600 }}
          >
            <Box
              onClick={() => navigate(module.path)}
              sx={{
                p: 0,
                borderRadius: 4,
                textAlign: "left",
                bgcolor: "#fff",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "box-shadow 0.3s, transform 0.3s",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-6px) scale(1.03)",
                },
              }}
            >
              <Box
                component="img"
                src={module.image}
                alt={module.name}
                sx={{
                  height: 220,
                  width: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  mb: 2,
                }}
              />
              <Box sx={{ px: 3, pb: 3, width: "100%" }}>
                <Typography
                  fontSize="1.25rem"
                  textAlign="center"
                  color="#222831"
                  mb={1}
                >
                  {module.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage