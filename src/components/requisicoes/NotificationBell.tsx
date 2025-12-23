import React from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from '../../hooks/requisicoes/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { notifications, unseenCount, loading, markAsSeen, markAllAsSeen } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (id_aviso: number, id_requisicao: number) => {
    await markAsSeen(id_aviso);
    handleClose();
    navigate(`/requisicoes/${id_requisicao}`);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsSeen();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'white',
        }}
      >
        <Badge badgeContent={unseenCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 400, maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notificações</Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ textTransform: 'none' }}
              >
                Marcar todas como lidas
              </Button>
            )}
          </Box>
          <Divider />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma notificação nova
              </Typography>
            </Box>
          ) : (
            <List sx={{ overflow: 'auto', flexGrow: 1 }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id_aviso}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification.id_aviso, notification.id_requisicao)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold">
                          {notification.nome_transicao || 'Mudança de status'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" component="span" display="block">
                            Requisição: {notification.requisicao?.DESCRICAO || `#${notification.id_requisicao}`}
                          </Typography>
                          <Typography variant="caption" component="span" display="block" color="text.secondary">
                            Por: {notification.remetente?.nome || 'Sistema'}
                          </Typography>
                          {/* <Typography variant="caption" component="span" display="block" color="text.secondary">
                            {formatDistanceToNow(new Date(notification.data_criacao), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </Typography> */}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;
