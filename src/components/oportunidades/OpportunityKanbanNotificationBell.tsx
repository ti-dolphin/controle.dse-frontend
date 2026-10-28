import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Box, Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemText, Popover, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import OpportunityKanbanService, { OpportunityKanbanNotification } from "../../services/oportunidades/OpportunityKanbanService";

const OpportunityKanbanNotificationBell = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<OpportunityKanbanNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setNotifications(await OpportunityKanbanService.getMovementNotifications());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => undefined);
    const interval = window.setInterval(() => refresh().catch(() => undefined), 30000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const handleNotificationClick = async (notification: OpportunityKanbanNotification) => {
    try {
      await OpportunityKanbanService.markMovementNotificationSeen(notification.id);
      setNotifications((current) => current.filter((item) => item.id !== notification.id));
    } catch {
      // Navigating to the card is still useful if marking the notification fails.
    } finally {
      setAnchorEl(null);
      navigate(`/oportunidades/${notification.oportunidade.CODOS}`);
    }
  };

  const handleMarkAllAsSeen = async () => {
    await OpportunityKanbanService.markAllMovementNotificationsSeen();
    setNotifications([]);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="Notificações de oportunidades" onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ color: "primary.main" }}>
        <Badge badgeContent={notifications.length} color="error"><NotificationsIcon /></Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 420, maxWidth: "90vw", maxHeight: 520, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Atualizações dos cartões</Typography>
            {notifications.length > 0 && <Button size="small" onClick={handleMarkAllAsSeen} sx={{ textTransform: "none" }}>Marcar todas como lidas</Button>}
          </Box>
          <Divider />
          {loading && notifications.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress size={24} /></Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}><Typography variant="body2" color="text.secondary">Nenhuma atualização nova</Typography></Box>
          ) : (
            <List sx={{ overflow: "auto", flexGrow: 1, p: 0 }}>
              {notifications.map((notification) => {
                const movement = notification.movimento;
                const opportunity = notification.oportunidade;
                const projectName = opportunity.projeto?.ID != null
                  ? `Projeto ${opportunity.projeto.ID}${opportunity.adicional?.NUMERO ? `.${opportunity.adicional.NUMERO}` : ""}`
                  : `Oportunidade #${opportunity.CODOS}`;
                return (
                  <Box key={notification.id}>
                    <ListItem button onClick={() => { void handleNotificationClick(notification); }} sx={{ "&:hover": { backgroundColor: "action.hover" } }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight="bold">{movement.coluna_origem_nome || "Entrada no quadro"} → {movement.coluna_destino_nome}</Typography>}
                        secondary={
                          <>
                            <Typography variant="caption" component="span" display="block">{projectName} · {movement.quadro}</Typography>
                            <Typography variant="caption" component="span" display="block" color="text.secondary">Por: {movement.usuario_nome || "Sistema"}</Typography>
                            <Typography variant="caption" component="span" display="block" color="text.secondary">
                              {formatDistanceToNow(new Date(notification.data_criacao), { addSuffix: true, locale: ptBR })}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default OpportunityKanbanNotificationBell;
