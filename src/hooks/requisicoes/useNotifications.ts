import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { RootState } from '../../redux/store';
import NotificationService, { Notification } from '../../services/requisicoes/NotificationService';

export const useNotifications = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);
      const data = await NotificationService.getUnseen(user.CODPESSOA);
      setNotifications(data);
      setUnseenCount(data.length);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      dispatch(
        setFeedback({
          message: "Erro ao buscar notificações",
          type: "error",
        })
      );
    }
  }, [user, dispatch]);

  const markAsSeen = useCallback(async (id_aviso: number) => {
    try {
      await NotificationService.markAsSeen(id_aviso);
      // Atualiza localmente
      setNotifications(prev => prev.filter(n => n.id_aviso !== id_aviso));
      setUnseenCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao marcar notificação como vista",
          type: "error",
        })
      );
    }
  }, [dispatch]);

  const markAllAsSeen = useCallback(async () => {
    try {
      if (!user) return;
      await NotificationService.markAllAsSeen(user.CODPESSOA);
      setNotifications([]);
      setUnseenCount(0);
      dispatch(
        setFeedback({
          message: "Todas as notificações foram marcadas como lidas",
          type: "success",
        })
      );
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao marcar todas como lidas",
          type: "error",
        })
      );
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { 
    notifications, 
    unseenCount, 
    loading,
    markAsSeen,
    markAllAsSeen,
    refresh: fetchNotifications
  };
};

interface NotificationData {
  id_aviso: number;
  mensagem: string;
  data: string;
  tipo: string;
  visto: boolean;
  remetente?: {
    CODPESSOA: number;
    nome: string; // Alterar de NOME para nome
  };
}
