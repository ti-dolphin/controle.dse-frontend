import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKanbans, setSelectedKanban, } from "../../redux/slices/requisicoes/requisitionTableSlice";
import RequisitionKanbanService from "../../services/requisicoes/RequisitionKanbanService";
import { setFeedback } from "../../redux/slices/feedBackSlice";
export function useRequisitionKanban() {
    const dispatch = useDispatch();
    const selectedKanban = useSelector((state) => state.requisitionTable.selectedKanban);
    useEffect(() => {
        const fetchKanbans = async () => {
            try {
                const kanbans = await RequisitionKanbanService.getMany();
                dispatch(setKanbans(kanbans));
                if (kanbans.length > 0 && !selectedKanban) {
                    dispatch(setSelectedKanban(kanbans[0]));
                }
            }
            catch (e) {
                dispatch(setFeedback({
                    message: "Houve um erro ao buscar os kanbans",
                    type: "error",
                }));
            }
        };
        fetchKanbans();
    }, [dispatch]);
}
