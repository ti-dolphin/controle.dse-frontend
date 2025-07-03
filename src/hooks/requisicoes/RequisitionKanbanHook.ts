
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setKanbans,
  setSelectedKanban,
} from "../../redux/slices/requisicoes/requisitionTableSlice";
import RequisitionKanbanService from "../../services/requisicoes/RequisitionKanbanService";
import { setFeedback } from "../../redux/slices/feedBackSlice";

export function useRequisitionKanban() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchKanbans = async () => {
      try {
        const kanbans = await RequisitionKanbanService.getMany();
        dispatch(setKanbans(kanbans));
        if (kanbans.length > 0) {
          dispatch(setSelectedKanban(kanbans[0]));
        }
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: "Houve um erro ao buscar os kanbans",
            type: "error",
          })
        );
      }
    };
    fetchKanbans();
  }, [dispatch]);
}