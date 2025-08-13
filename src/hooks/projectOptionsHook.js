import { useCallback, useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../redux/slices/feedBackSlice';
export function useProjectOptions() {
    const dispatch = useDispatch();
    const [options, setOptions] = useState([]);
    const getProjectDesc = (proj) => {
        const validDescription = proj.DESCRICAO !== null && proj.DESCRICAO !== undefined && proj.DESCRICAO !== '';
        if (validDescription) {
            return proj.DESCRICAO;
        }
        return `Projeto sem descricao - ${proj.ID}`;
    };
    const fetchProjects = useCallback(async () => {
        try {
            const projects = await ProjectService.getMany({});
            const options = projects.map((proj) => ({
                id: proj.ID,
                name: getProjectDesc(proj),
            }));
            setOptions(options);
        }
        catch (e) {
            dispatch(setFeedback({
                type: 'error',
                message: `Erro ao buscar opções de projetos: ${e.message}`
            }));
        }
    }, [dispatch]);
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);
    return { projectOptions: options };
}
