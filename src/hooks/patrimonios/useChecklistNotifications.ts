import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { RootState } from '../../redux/store';
import { CheckListService } from '../../services/patrimonios/ChecklistService';

export const useChecklistNotifications = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const [notifications, setNotifications] = React.useState<number>();

    const fetchChecklistsByUser = React.useCallback(async () => {
      try {
        if (!user) return;
        const params = {
          searchTerm: "",
          situacao: "todas",
        };
        const data = await CheckListService.getManyByUser(user.CODPESSOA, params);
        console.log("data", data.length);
        setNotifications(data.length);
      } catch (e) {
        dispatch(
          setFeedback({
            message: "Houve um erro ao buscar os dados",
            type: "error",
          })
        );
      }
    }, [user, dispatch]);

    useEffect(() => { 
      fetchChecklistsByUser();
    }, [fetchChecklistsByUser]);
  return { notifications };
}

